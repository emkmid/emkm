<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class OtpCode extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'email',
        'code',
        'type',
        'expires_at',
        'verified_at',
        'attempts',
        'ip_address',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'verified_at' => 'datetime',
        'attempts' => 'integer',
    ];

    /**
     * Get the user that owns the OTP code.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include valid OTP codes.
     */
    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', now())
                    ->whereNull('verified_at')
                    ->where('attempts', '<', config('otp.max_attempts'));
    }

    /**
     * Scope a query to only include OTP codes for a specific email.
     */
    public function scopeForEmail($query, string $email)
    {
        return $query->where('email', $email);
    }

    /**
     * Scope a query to only include OTP codes of a specific type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Check if the OTP code is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if the OTP code is verified.
     */
    public function isVerified(): bool
    {
        return !is_null($this->verified_at);
    }

    /**
     * Check if the OTP code has exceeded max attempts.
     */
    public function hasExceededAttempts(): bool
    {
        return $this->attempts >= config('otp.max_attempts');
    }

    /**
     * Increment the attempts counter.
     */
    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }

    /**
     * Mark the OTP code as verified.
     */
    public function markAsVerified(): void
    {
        $this->update(['verified_at' => now()]);
    }

    /**
     * Check if the OTP code is valid for verification.
     */
    public function isValidForVerification(): bool
    {
        return !$this->isExpired() 
            && !$this->isVerified() 
            && !$this->hasExceededAttempts();
    }

    /**
     * Invalidate all other OTP codes for this email and type.
     */
    public static function invalidateOthers(string $email, string $type, ?int $exceptId = null): void
    {
        $query = static::forEmail($email)->ofType($type)->whereNull('verified_at');
        
        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }
        
        $query->update(['verified_at' => now()]);
    }
}
