<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Expire subscriptions daily at midnight
        $schedule->command('subscriptions:expire')
            ->daily()
            ->at('00:00')
            ->withoutOverlapping()
            ->onSuccess(function () {
                Log::info('Subscription expiry check completed');
            })
            ->onFailure(function () {
                Log::error('Subscription expiry check failed');
            });

        // Send subscription reminders daily at 9:00 AM
        $schedule->command('subscriptions:remind')
            ->daily()
            ->at('09:00')
            ->withoutOverlapping()
            ->onSuccess(function () {
                Log::info('Subscription reminders sent');
            })
            ->onFailure(function () {
                Log::error('Subscription reminder job failed');
            });

        // Run subscription expiry checks daily at 6 AM (backup check)
        $schedule->command('subscription:check-expiry')
            ->daily()
            ->at('06:00')
            ->withoutOverlapping()
            ->onFailure(function () {
                Log::error('Scheduled subscription expiry check failed');
            });

        // Expire cancelled subscriptions daily at 1 AM
        $schedule->command('subscriptions:expire-cancelled')
            ->daily()
            ->at('01:00')
            ->withoutOverlapping()
            ->onSuccess(function () {
                Log::info('Cancelled subscriptions expiry check completed');
            })
            ->onFailure(function () {
                Log::error('Cancelled subscriptions expiry check failed');
            });

        // Auto-cancel pending payments older than 24 hours
        $schedule->call(function () {
            $expiredPending = \App\Models\Subscription::where('status', 'pending')
                ->where('created_at', '<', now()->subHours(24))
                ->get();

            foreach ($expiredPending as $subscription) {
                $subscription->update([
                    'status' => 'cancelled',
                    'cancelled_at' => now()
                ]);
                Log::info('Auto-cancelled expired pending payment', [
                    'subscription_id' => $subscription->id,
                    'order_id' => $subscription->midtrans_order_id
                ]);
            }
        })->hourly()->name('auto-cancel-expired-payments');

        // Cleanup pending payments (Midtrans 60 min expiry + buffer)
        $schedule->command('payment:cleanup-pending --hours=2')
            ->everyTwoHours()
            ->withoutOverlapping()
            ->onSuccess(function () {
                Log::info('Pending payment cleanup completed');
            })
            ->onFailure(function () {
                Log::error('Pending payment cleanup failed');
            });

        // Clean up old notifications (older than 30 days)
        $schedule->call(function () {
            \App\Models\UserNotification::where('created_at', '<', now()->subDays(30))
                ->whereNotNull('read_at')
                ->delete();
        })->weekly()->sundays()->at('02:00');

        // Clean up old payment notifications (older than 90 days)
        $schedule->call(function () {
            \App\Models\PaymentNotification::where('created_at', '<', now()->subDays(90))
                ->delete();
        })->monthly();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
