<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Services\FeatureService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ExpireSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire subscriptions that have passed their end date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired subscriptions...');

        $expiredSubscriptions = Subscription::where('status', 'active')
            ->where('ends_at', '<=', now())
            ->get();

        if ($expiredSubscriptions->isEmpty()) {
            $this->info('No expired subscriptions found.');
            return 0;
        }

        $count = 0;
        $featureService = app(FeatureService::class);

        foreach ($expiredSubscriptions as $subscription) {
            try {
                $subscription->update(['status' => 'expired']);
                
                // Clear user's package cache
                $featureService->clearCache($subscription->user);
                
                $count++;

                Log::info('Subscription expired', [
                    'subscription_id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'package_id' => $subscription->package_id,
                    'ended_at' => $subscription->ends_at,
                ]);

                // Send expiration notification email
                try {
                    \Mail::to($subscription->user)->send(
                        new \App\Mail\SubscriptionExpiredMail($subscription)
                    );
                } catch (\Exception $e) {
                    Log::warning('Failed to send expiration email', [
                        'subscription_id' => $subscription->id,
                        'error' => $e->getMessage(),
                    ]);
                }

                // Create in-app notification
                try {
                    \App\Models\UserNotification::create([
                        'user_id' => $subscription->user_id,
                        'type' => 'error',
                        'title' => 'Subscription Expired',
                        'message' => "Your {$subscription->package->name} subscription has expired. Renew to continue using premium features.",
                        'action_text' => 'Renew Now',
                        'action_url' => route('dashboard.packages'),
                    ]);
                } catch (\Exception $e) {
                    Log::warning('Failed to create expiration notification', [
                        'subscription_id' => $subscription->id,
                        'error' => $e->getMessage(),
                    ]);
                }

            } catch (\Exception $e) {
                Log::error('Failed to expire subscription', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("Successfully expired {$count} subscription(s).");
        
        return 0;
    }
}
