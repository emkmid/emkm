<?php

namespace App\Services;

use App\Mail\OtpMail;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OtpService
{
    /**
     * Generate and send OTP code to user's email.
     *
     * @param string $email
     * @param string $type
     * @param User|null $user
     * @return array
     */
    public function generate(string $email, string $type = 'email_verification', ?User $user = null): array
    {
        // Check rate limiting
        $rateLimitKey = 'otp-generate:' . $email;
        $maxAttempts = (int) config('otp.rate_limit.requests', 3);
        $decayMinutes = (int) config('otp.rate_limit.minutes', 60);

        if (RateLimiter::tooManyAttempts($rateLimitKey, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);
            return [
                'success' => false,
                'message' => "Terlalu banyak permintaan. Silakan coba lagi dalam " . ceil($seconds / 60) . " menit.",
                'retry_after' => $seconds,
            ];
        }

        // Invalidate previous OTP codes
        OtpCode::invalidateOthers($email, $type);

        // Generate OTP code
        $code = $this->generateCode();
        
        // Create OTP record
        $otp = OtpCode::create([
            'user_id' => $user?->id,
            'email' => $email,
            'code' => $code,
            'type' => $type,
            'expires_at' => Carbon::now()->addMinutes((int) config('otp.expiry_minutes', 5)),
            'ip_address' => request()->ip(),
        ]);

        // Send email
        try {
            Mail::to($email)->send(new OtpMail($code, $user?->name ?? 'User', $type));

            // Hit rate limiter
            RateLimiter::hit($rateLimitKey, $decayMinutes * 60);

            return [
                'success' => true,
                'message' => 'Kode OTP telah dikirim ke email Anda.',
                'expires_at' => $otp->expires_at,
                'expires_in_minutes' => config('otp.expiry_minutes'),
            ];
        } catch (\Exception $e) {
            // Log error with full context for debugging
            \Log::error('Failed to send OTP email', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'email' => $email,
                'user_id' => $user?->id,
            ]);

            // Don't delete OTP here; keep it so user can request resend without regenerating
            // $otp->delete();

            $message = 'Gagal mengirim kode OTP. Silakan coba lagi.';

            // Provide a more detailed message in local environment
            if (config('app.env') === 'local') {
                $message .= ' (' . $e->getMessage() . ')';
            }

            return [
                'success' => false,
                'message' => $message,
            ];
        }
    }

    /**
     * Verify OTP code.
     *
     * @param string $email
     * @param string $code
     * @param string $type
     * @return array
     */
    public function verify(string $email, string $code, string $type = 'email_verification'): array
    {
        $otp = OtpCode::forEmail($email)
            ->ofType($type)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (!$otp) {
            return [
                'success' => false,
                'message' => 'Kode OTP tidak ditemukan atau sudah digunakan.',
            ];
        }

        // Check if expired
        if ($otp->isExpired()) {
            return [
                'success' => false,
                'message' => 'Kode OTP sudah kedaluwarsa. Silakan minta kode baru.',
            ];
        }

        // Check if max attempts exceeded
        if ($otp->hasExceededAttempts()) {
            return [
                'success' => false,
                'message' => 'Terlalu banyak percobaan gagal. Silakan minta kode baru.',
            ];
        }

        // Verify code
        if ($otp->code !== $code) {
            $otp->incrementAttempts();
            
            $remainingAttempts = config('otp.max_attempts') - $otp->attempts;
            
            return [
                'success' => false,
                'message' => "Kode OTP salah. {$remainingAttempts} percobaan tersisa.",
                'remaining_attempts' => $remainingAttempts,
            ];
        }

        // Mark as verified
        $otp->markAsVerified();

        // If this is email verification, mark user's email as verified
        if ($type === 'email_verification' && $otp->user_id) {
            $user = User::find($otp->user_id);
            if ($user && !$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }
        }

        return [
            'success' => true,
            'message' => 'Kode OTP berhasil diverifikasi.',
            'user_id' => $otp->user_id,
        ];
    }

    /**
     * Resend OTP code.
     *
     * @param string $email
     * @param string $type
     * @param User|null $user
     * @return array
     */
    public function resend(string $email, string $type = 'email_verification', ?User $user = null): array
    {
        // Same as generate
        return $this->generate($email, $type, $user);
    }

    /**
     * Generate random OTP code.
     *
     * @return string
     */
    protected function generateCode(): string
    {
        $length = config('otp.length');
        
        // Generate random number with specified length
        $min = pow(10, $length - 1);
        $max = pow(10, $length) - 1;
        
        return (string) random_int($min, $max);
    }

    /**
     * Check if email has valid OTP.
     *
     * @param string $email
     * @param string $type
     * @return bool
     */
    public function hasValidOtp(string $email, string $type = 'email_verification'): bool
    {
        return OtpCode::forEmail($email)
            ->ofType($type)
            ->valid()
            ->exists();
    }

    /**
     * Get remaining time for OTP.
     *
     * @param string $email
     * @param string $type
     * @return int|null Remaining seconds, or null if no valid OTP
     */
    public function getRemainingTime(string $email, string $type = 'email_verification'): ?int
    {
        $otp = OtpCode::forEmail($email)
            ->ofType($type)
            ->valid()
            ->latest()
            ->first();

        if (!$otp) {
            return null;
        }

        return max(0, $otp->expires_at->diffInSeconds(now()));
    }

    /**
     * Clean up expired OTP codes.
     *
     * @return int Number of deleted records
     */
    public function cleanupExpired(): int
    {
        return OtpCode::where('expires_at', '<', now()->subDay())->delete();
    }
}
