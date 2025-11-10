<?php

use App\Services\OtpService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test OTP Generation (Web interface)
Route::get('/test-otp', function () {
    return redirect('/test-otp.html');
});

// API endpoint for sending OTP
Route::post('/api/test-otp-send', function (Request $request) {
    try {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;
        $otpService = app(OtpService::class);
        
        // Get or create test user
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Test User - ' . explode('@', $email)[0],
                'password' => bcrypt('password123'),
            ]
        );
        
        // Generate OTP
        $result = $otpService->generate(
            email: $user->email,
            type: 'email_verification',
            user: $user
        );

        if ($result['success']) {
            // Get the OTP code from database (for testing purposes)
            $otp = \App\Models\OtpCode::forEmail($email)
                ->ofType('email_verification')
                ->valid()
                ->latest()
                ->first();

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'code' => $otp ? $otp->code : null, // Show code for testing
                'expires_in_minutes' => config('otp.expiry_minutes'),
                'email_sent_to' => $email,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
        ], 400);
        
    } catch (\Exception $e) {
        \Log::error('OTP Test Error: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to send OTP',
            'error' => $e->getMessage(),
        ], 500);
    }
});

// Test OTP Verification
Route::post('/test-otp-verify', function (Request $request) {
    try {
        $otpService = app(OtpService::class);
        
        $result = $otpService->verify(
            email: $request->email,
            code: $request->code,
            type: 'email_verification'
        );
        
        return response()->json([
            'status' => $result['success'] ? 'success' : 'error',
            'data' => $result,
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
})->middleware('web');
