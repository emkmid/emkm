<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CleanupPendingPayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment:cleanup-pending
                            {--hours=1 : Number of hours after which pending payments should be cancelled}
                            {--dry-run : Run without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleanup pending payments that have exceeded Midtrans expiry time (default: 1 hour)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $hours = (int) $this->option('hours');
        $dryRun = $this->option('dry-run');
        
        $this->info("Cleaning up pending payments older than {$hours} hour(s)...");
        
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No changes will be made');
        }

        try {
            $cutoffTime = Carbon::now()->subHours($hours);
            
            // Find pending subscriptions older than cutoff time
            $pendingPayments = Subscription::where('status', 'pending')
                ->where('provider', 'midtrans')
                ->where('created_at', '<', $cutoffTime)
                ->whereNull('cancelled_at')
                ->get();

            $this->info("Found {$pendingPayments->count()} pending payment(s) to cleanup");

            $cancelledCount = 0;
            
            foreach ($pendingPayments as $subscription) {
                try {
                    $timeDiff = $subscription->created_at->diffInMinutes(now());
                    
                    if ($dryRun) {
                        $this->line("Would cancel: Subscription #{$subscription->id} (Order: {$subscription->midtrans_order_id}, Age: {$timeDiff} minutes)");
                    } else {
                        $subscription->update([
                            'status' => 'cancelled',
                            'cancelled_at' => now(),
                        ]);
                        
                        Log::info('Pending payment auto-cancelled due to timeout', [
                            'subscription_id' => $subscription->id,
                            'order_id' => $subscription->midtrans_order_id,
                            'user_id' => $subscription->user_id,
                            'age_minutes' => $timeDiff,
                            'created_at' => $subscription->created_at,
                        ]);
                        
                        $this->info("✓ Cancelled: Subscription #{$subscription->id} (Order: {$subscription->midtrans_order_id})");
                    }
                    
                    $cancelledCount++;
                    
                } catch (\Exception $e) {
                    $this->error("Failed to cancel subscription #{$subscription->id}: {$e->getMessage()}");
                    Log::error('Failed to auto-cancel pending payment', [
                        'subscription_id' => $subscription->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            if ($dryRun) {
                $this->info("\nDRY RUN: Would have cancelled {$cancelledCount} payment(s)");
            } else {
                $this->info("\n✓ Successfully cancelled {$cancelledCount} pending payment(s)");
            }
            
            return 0;

        } catch (\Exception $e) {
            $this->error('Error during cleanup: ' . $e->getMessage());
            Log::error('Pending payment cleanup failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return 1;
        }
    }
}
