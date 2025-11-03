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
        // Run subscription expiry checks daily at 6 AM
        $schedule->command('subscription:check-expiry')
            ->daily()
            ->at('06:00')
            ->withoutOverlapping()
            ->onFailure(function () {
                Log::error('Scheduled subscription expiry check failed');
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
