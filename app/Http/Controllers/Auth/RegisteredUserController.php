<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request, OtpService $otpService): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => null, // Will be set after OTP verification
            ]);

            // Auto-assign Free package to new user
            // $freePackage = Package::where('name', 'Free')
            //     ->where('is_active', true)
            //     ->first();

            // if ($freePackage) {
            //     Subscription::create([
            //         'user_id' => $user->id,
            //         'package_id' => $freePackage->id,
            //         'provider' => 'internal',
            //         'status' => 'active',
            //         'price_cents' => 0,
            //         'currency' => 'IDR',
            //         'interval' => '1_year',
            //         'starts_at' => now(),
            //         'ends_at' => now()->addYear(),
            //     ]);

            //     Log::info('Free package auto-assigned to new user', [
            //         'user_id' => $user->id,
            //         'package_id' => $freePackage->id,
            //     ]);
            // } else {
            //     Log::warning('Free package not found for auto-assignment', [
            //         'user_id' => $user->id,
            //     ]);
            // }

            event(new Registered($user));

            // Generate and send OTP
            $otpResult = $otpService->generate(
                email: $user->email,
                type: 'email_verification',
                user: $user
            );

            DB::commit();

            // Login user (they can use the app but with limited features until verified)
            Auth::login($user);

            // Redirect to OTP verification page
            return redirect()->route('verification.notice')->with([
                'otpSent' => $otpResult['success'],
                'message' => $otpResult['message'],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('User registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'email' => $request->email,
            ]);

            return back()->withErrors([
                'email' => 'Registration failed: ' . $e->getMessage(),
            ])->withInput($request->except('password', 'password_confirmation'));
        }
    }
}
