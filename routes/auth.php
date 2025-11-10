<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\OtpVerificationController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\SocialLoginController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');

    // Google
    Route::get('/auth/google', function () {
        return Socialite::driver('google')->redirect();
    });

    // Social Authentication
    Route::get('/auth/{provider}/redirect', [SocialLoginController::class, 'redirect']);
    Route::get('/auth/{provider}/callback', [SocialLoginController::class, 'callback']);
});

Route::middleware('auth')->group(function () {
    // OTP Verification Routes
    Route::get('verify-otp', [OtpVerificationController::class, 'show'])
        ->name('verification.notice');

    Route::post('verify-otp', [OtpVerificationController::class, 'verify'])
        ->middleware('throttle:10,1') // Max 10 attempts per minute
        ->name('otp.verify');

    Route::post('resend-otp', [OtpVerificationController::class, 'resend'])
        ->middleware('throttle:3,1') // Max 3 resends per minute
        ->name('otp.resend');

    // Legacy email verification routes (keep for compatibility)
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice.legacy');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
