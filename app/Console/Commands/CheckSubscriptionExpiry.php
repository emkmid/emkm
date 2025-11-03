<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Models\User;
use App\Notifications\SubscriptionExpiringNotification;
use App\Notifications\SubscriptionExpiredNotification;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CheckSubscriptionExpiry extends Command
{
    protected $signature = 'subscription:check-expiry';
    protected $description = 'Check for expiring and expired subscriptions';

    public function handle()
    {
        try {
            $this->info('Checking subscription expiry...');
            
            // Check for subscriptions expiring in 7 days
            $this->checkExpiringSubscriptions();
            
            // Check for expired subscriptions
            $this->checkExpiredSubscriptions();
            
            $this->info('Subscription expiry check completed successfully.');
            
        } catch (\Exception $e) {
            $this->error('Error checking subscription expiry: ' . $e->getMessage());
            Log::error('Subscription expiry check failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    private function checkExpiringSubscriptions()
    {
        try {
            $expiringDate = Carbon::now()->addDays(7);
            
            $expiringSubscriptions = Subscription::where('status', 'active')
                ->whereDate('expires_at', '=', $expiringDate->toDateString())
                ->with('user', 'package')
                ->get();

            foreach ($expiringSubscriptions as $subscription) {
                try {
                    if ($subscription->user) {
                        $subscription->user->notify(new SubscriptionExpiringNotification($subscription));
                        $this->info("Expiry notification sent for subscription ID: {$subscription->id}");
                        
                        Log::info('Subscription expiry notification sent', [
                            'subscription_id' => $subscription->id,
                            'user_id' => $subscription->user_id,
                            'expires_at' => $subscription->expires_at
                        ]);
                    }
                } catch (\Exception $e) {
                    $this->error("Failed to send expiry notification for subscription ID: {$subscription->id}");
                    Log::error('Failed to send subscription expiry notification', [
                        'subscription_id' => $subscription->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            $this->info("Checked {$expiringSubscriptions->count()} expiring subscriptions");
            
        } catch (\Exception $e) {
            Log::error('Error checking expiring subscriptions', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    private function checkExpiredSubscriptions()
    {
        try {
            $expiredSubscriptions = Subscription::where('status', 'active')
                ->where('expires_at', '<', Carbon::now())
                ->with('user', 'package')
                ->get();

            foreach ($expiredSubscriptions as $subscription) {
                try {
                    DB::transaction(function () use ($subscription) {
                        // Update subscription status
                        $subscription->update(['status' => 'expired']);

                        // Send notification
                        if ($subscription->user) {
                            $subscription->user->notify(new SubscriptionExpiredNotification($subscription));
                        }

                        Log::info('Subscription expired and user notified', [
                            'subscription_id' => $subscription->id,
                            'user_id' => $subscription->user_id,
                            'expired_at' => $subscription->expires_at
                        ]);
                    });

                    $this->info("Expired subscription ID: {$subscription->id}");
                    
                } catch (\Exception $e) {
                    $this->error("Failed to process expired subscription ID: {$subscription->id}");
                    Log::error('Failed to process expired subscription', [
                        'subscription_id' => $subscription->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            $this->info("Processed {$expiredSubscriptions->count()} expired subscriptions");
            
        } catch (\Exception $e) {
            Log::error('Error checking expired subscriptions', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}