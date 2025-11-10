<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OtpVerificationController extends Controller
{
    /**
     * Display the OTP verification page.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        // If user is not authenticated, redirect to login
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = $request->user();

        // If already verified, redirect to dashboard
        // Only redirect if email is actually verified (not null)
        if ($user->email_verified_at !== null) {
            return redirect()->route('dashboard')->with([
                'message' => 'Email Anda sudah terverifikasi.',
            ]);
        }

        return Inertia::render('auth/verify-otp', [
            'email' => $user->email,
            'name' => $user->name,
            'status' => session('message'),
        ]);
    }

    /**
     * Verify the OTP code.
     */
    public function verify(Request $request, OtpService $otpService): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        $result = $otpService->verify(
            email: $user->email,
            code: $request->code,
            type: 'email_verification'
        );

        if (!$result['success']) {
            return back()->withErrors([
                'code' => $result['message'],
            ]);
        }

        return redirect()->route('dashboard')->with([
            'message' => '✅ Email berhasil diverifikasi! Selamat datang di ' . config('app.name') . '!',
        ]);
    }

    /**
     * Resend OTP code.
     */
    public function resend(Request $request, OtpService $otpService): RedirectResponse
    {
        $user = $request->user();

        $result = $otpService->resend(
            email: $user->email,
            type: 'email_verification',
            user: $user
        );

        if (!$result['success']) {
            return back()->withErrors([
                'resend' => $result['message'],
            ]);
        }

        return back()->with([
            'message' => $result['message'],
        ]);
    }
}
