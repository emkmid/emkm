<?php

namespace App\Jobs;

use App\Models\PaymentNotification;
use App\Services\MidtransService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessMidtransWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var array
     */
    public $backoff = [10, 30, 60, 120, 300]; // Exponential backoff: 10s, 30s, 1m, 2m, 5m

    /**
     * The maximum number of seconds the job can run.
     *
     * @var int
     */
    public $timeout = 120;

    protected $payload;
    protected $notificationId;

    /**
     * Create a new job instance.
     */
    public function __construct(array $payload, ?int $notificationId = null)
    {
        $this->payload = $payload;
        $this->notificationId = $notificationId;
    }

    /**
     * Execute the job.
     */
    public function handle(MidtransService $midtransService): void
    {
        $orderId = $this->payload['order_id'] ?? 'unknown';
        
        Log::info('Processing Midtrans webhook job', [
            'order_id' => $orderId,
            'attempt' => $this->attempts(),
            'notification_id' => $this->notificationId,
        ]);

        try {
            // Process the payment notification
            $subscription = $midtransService->processPaymentNotification($this->payload);
            
            // Mark notification as processed if we have the ID
            if ($this->notificationId) {
                PaymentNotification::where('id', $this->notificationId)
                    ->update(['processed_at' => now()]);
            }
            
            Log::info('Midtrans webhook processed successfully in job', [
                'order_id' => $orderId,
                'subscription_id' => $subscription->id,
                'status' => $subscription->status,
                'attempt' => $this->attempts(),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process Midtrans webhook in job', [
                'order_id' => $orderId,
                'attempt' => $this->attempts(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // If this is the last attempt, mark as failed
            if ($this->attempts() >= $this->tries) {
                if ($this->notificationId) {
                    PaymentNotification::where('id', $this->notificationId)
                        ->update([
                            'processed_at' => now(),
                            'payload' => array_merge($this->payload, [
                                'processing_failed' => true,
                                'final_error' => $e->getMessage(),
                                'failed_at' => now()->toISOString(),
                            ])
                        ]);
                }
            }

            throw $e; // Re-throw to trigger retry
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Midtrans webhook job failed after all retries', [
            'order_id' => $this->payload['order_id'] ?? 'unknown',
            'notification_id' => $this->notificationId,
            'error' => $exception->getMessage(),
        ]);

        // TODO: Send alert to admin/monitoring system
        // You could send email, Slack notification, etc.
    }
}
