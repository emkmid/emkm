<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureActiveSubscription
{
    /**
     * Handle an incoming request.
     * If user doesn't have an active subscription, redirect to packages page.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        $current = $user->current_subscription;

        if (! $current || ! $current->isActive()) {
            // Not subscribed: redirect to packages or abort
            return redirect('/dashboard/admin/packages');
        }

        return $next($request);
    }
}
