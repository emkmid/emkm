<?php

namespace Database\Seeders;

use App\Models\Subscription;
use App\Models\User;
use App\Models\Package;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        $package = Package::where('name', 'Basic')->first();

        if (! $user || ! $package) {
            return;
        }

        Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'manual',
            'provider_subscription_id' => null,
            'price_cents' => (int) ($package->price * 100),
            'currency' => 'USD',
            'interval' => 'month',
            'status' => 'active',
            'starts_at' => Carbon::now(),
            'ends_at' => Carbon::now()->addMonth(),
        ]);
    }
}
