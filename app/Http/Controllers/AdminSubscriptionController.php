<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminSubscriptionController extends Controller
{
    /**
     * Create a manual subscription for a user.
     */
    public function store(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'package_id' => ['required', 'integer', 'exists:packages,id'],
            'interval' => ['nullable', 'in:month,year,one'],
        ]);

        $package = Package::findOrFail($data['package_id']);

        $startsAt = Carbon::now();
        $endsAt = match($data['interval'] ?? 'month') {
            'year' => $startsAt->copy()->addYear(),
            'one' => null,
            default => $startsAt->copy()->addMonth(),
        };

        Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'manual',
            'provider_subscription_id' => null,
            'price_cents' => (int) ($package->price * 100),
            'currency' => 'USD',
            'interval' => $data['interval'] ?? 'month',
            'status' => 'active',
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
        ]);

        return back()->with('success', 'Subscription assigned to user.');
    }
}
