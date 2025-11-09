<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use Illuminate\Console\Command;

class ExpireCancelledSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:expire-cancelled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire cancelled subscriptions that have passed their end date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for cancelled subscriptions to expire...');

        // Find subscriptions that are:
        // 1. Still marked as 'active'
        // 2. Have been cancelled (cancelled_at is not null)
        // 3. Have passed their end date
        $subscriptions = Subscription::where('status', 'active')
            ->whereNotNull('cancelled_at')
            ->where('ends_at', '<', now())
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info('No cancelled subscriptions to expire.');
            return 0;
        }

        $count = 0;
        foreach ($subscriptions as $subscription) {
            $subscription->update([
                'status' => 'expired',
            ]);

            $this->line("Expired subscription #{$subscription->id} for user #{$subscription->user_id} (Package: {$subscription->package->name})");
            $count++;
        }

        $this->info("Successfully expired {$count} subscription(s).");
        
        \Log::info('Expired cancelled subscriptions', [
            'count' => $count,
            'subscription_ids' => $subscriptions->pluck('id')->toArray(),
        ]);

        return 0;
    }
}
