<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendSubscriptionReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:remind';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder notifications for subscriptions expiring soon';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expiring subscriptions...');

        // Get subscriptions expiring in 7 days
        $expiringIn7Days = Subscription::where('status', 'active')
            ->whereBetween('ends_at', [now()->addDays(7), now()->addDays(7)->endOfDay()])
            ->with('user', 'package')
            ->get();

        // Get subscriptions expiring in 3 days
        $expiringIn3Days = Subscription::where('status', 'active')
            ->whereBetween('ends_at', [now()->addDays(3), now()->addDays(3)->endOfDay()])
            ->with('user', 'package')
            ->get();

        // Get subscriptions expiring in 1 day
        $expiringIn1Day = Subscription::where('status', 'active')
            ->whereBetween('ends_at', [now()->addDay(), now()->addDay()->endOfDay()])
            ->with('user', 'package')
            ->get();

        $totalReminders = 0;

        // Send 7-day reminders
        foreach ($expiringIn7Days as $subscription) {
            try {
                $this->sendReminder($subscription, 7);
                $totalReminders++;
            } catch (\Exception $e) {
                Log::error('Failed to send 7-day reminder', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Send 3-day reminders
        foreach ($expiringIn3Days as $subscription) {
            try {
                $this->sendReminder($subscription, 3);
                $totalReminders++;
            } catch (\Exception $e) {
                Log::error('Failed to send 3-day reminder', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Send 1-day reminders
        foreach ($expiringIn1Day as $subscription) {
            try {
                $this->sendReminder($subscription, 1);
                $totalReminders++;
            } catch (\Exception $e) {
                Log::error('Failed to send 1-day reminder', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("Sent {$totalReminders} reminder(s).");
        
        return 0;
    }

    /**
     * Send reminder notification
     */
    private function sendReminder(Subscription $subscription, int $days)
    {
        Log::info('Subscription expiring reminder sent', [
            'subscription_id' => $subscription->id,
            'user_id' => $subscription->user_id,
            'package_name' => $subscription->package->name,
            'expires_in_days' => $days,
            'ends_at' => $subscription->ends_at,
        ]);

        // Send email notification
        try {
            \Mail::to($subscription->user)->send(
                new \App\Mail\SubscriptionExpiringMail($subscription, $days)
            );
        } catch (\Exception $e) {
            Log::warning('Failed to send expiring email', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
        }

        // Create in-app notification
        try {
            \App\Models\UserNotification::create([
                'user_id' => $subscription->user_id,
                'type' => 'warning',
                'title' => 'Subscription Expiring Soon',
                'message' => "Your {$subscription->package->name} subscription will expire in {$days} day(s). Renew now to continue enjoying premium features.",
                'action_text' => 'Renew Subscription',
                'action_url' => route('dashboard.packages'),
            ]);
        } catch (\Exception $e) {
            Log::warning('Failed to create reminder notification', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
