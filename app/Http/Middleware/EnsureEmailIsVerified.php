<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip check if user is not authenticated
        if (!$request->user()) {
            return $next($request);
        }

        // Skip check for OTP verification routes and logout
        if ($request->routeIs('verification.*') || 
            $request->routeIs('otp.*') || 
            $request->routeIs('logout')) {
            return $next($request);
        }

        // Redirect to OTP verification if email is not verified
        if ($request->user()->email_verified_at === null) {
            return redirect()->route('verification.notice')->with([
                'warning' => 'Silakan verifikasi email Anda untuk melanjutkan.',
            ]);
        }

        return $next($request);
    }
}
