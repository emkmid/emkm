<?php

namespace App\Http\Controllers;

use App\Models\PaymentNotification;
use App\Models\Subscription;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransWebhookController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * Handle Midtrans notification (server-to-server).
     */
    public function handle(Request $request)
    {
        $startTime = microtime(true);
        $payload = $request->all();
        
        \Log::info('Midtrans webhook received', [
            'payload' => $payload,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        try {
            // Basic validation
            $orderId = $payload['order_id'] ?? null;
            $statusCode = $payload['status_code'] ?? null;
            $grossAmount = $payload['gross_amount'] ?? null;
            $signature = $payload['signature_key'] ?? null;
            $transactionStatus = $payload['transaction_status'] ?? null;
            $transactionId = $payload['transaction_id'] ?? null;

            // Validate required fields
            $requiredFields = [
                'order_id' => $orderId,
                'status_code' => $statusCode,
                'gross_amount' => $grossAmount,
                'signature_key' => $signature,
                'transaction_status' => $transactionStatus,
            ];

            $missingFields = [];
            foreach ($requiredFields as $field => $value) {
                if (empty($value)) {
                    $missingFields[] = $field;
                }
            }

            if (!empty($missingFields)) {
                \Log::warning('Midtrans webhook missing required fields', [
                    'missing_fields' => $missingFields,
                    'payload' => $payload,
                ]);
                
                return response()->json([
                    'error' => 'Missing required fields',
                    'missing_fields' => $missingFields,
                ], 400);
            }

            // Verify signature
            if (!$this->verifySignature($orderId, $statusCode, $grossAmount, $signature)) {
                \Log::warning('Midtrans webhook signature verification failed', [
                    'order_id' => $orderId,
                    'signature_received' => $signature,
                    'ip' => $request->ip(),
                ]);
                
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            // Check for duplicate notifications using multiple criteria
            $existingNotification = PaymentNotification::where('provider', 'midtrans')
                ->where(function ($query) use ($orderId, $transactionId, $signature) {
                    $query->where('order_id', $orderId)
                          ->where('provider_event_id', $transactionId)
                          ->where('signature', $signature);
                })
                ->whereNotNull('processed_at')
                ->first();

            if ($existingNotification) {
                \Log::info('Midtrans webhook already processed', [
                    'order_id' => $orderId,
                    'transaction_id' => $transactionId,
                    'notification_id' => $existingNotification->id,
                    'processed_at' => $existingNotification->processed_at,
                ]);
                
                return response()->json(['status' => 'ok', 'message' => 'Already processed']);
            }

            // Store notification for idempotency
            $notification = PaymentNotification::create([
                'provider' => 'midtrans',
                'provider_event_id' => $transactionId,
                'order_id' => $orderId,
                'signature' => $signature,
                'payload' => $payload,
            ]);

            try {
                // Process payment notification
                $subscription = $this->midtransService->processPaymentNotification($payload);
                
                // Mark notification as processed
                $notification->update(['processed_at' => now()]);
                
                $processingTime = round((microtime(true) - $startTime) * 1000, 2);
                
                \Log::info('Midtrans webhook processed successfully', [
                    'order_id' => $orderId,
                    'subscription_id' => $subscription->id,
                    'status' => $subscription->status,
                    'transaction_status' => $transactionStatus,
                    'processing_time_ms' => $processingTime,
                ]);

                return response()->json([
                    'status' => 'ok',
                    'subscription_id' => $subscription->id,
                    'subscription_status' => $subscription->status,
                ]);

            } catch (\Exception $e) {
                // Mark notification as failed but don't delete it for debugging
                $notification->update([
                    'processed_at' => now(),
                    'payload' => array_merge($payload, [
                        'processing_error' => $e->getMessage(),
                        'processing_failed_at' => now()->toISOString(),
                    ])
                ]);

                throw $e;
            }

        } catch (\InvalidArgumentException $e) {
            \Log::error('Invalid data in Midtrans webhook', [
                'order_id' => $orderId ?? 'unknown',
                'error' => $e->getMessage(),
                'payload' => $payload,
            ]);

            return response()->json([
                'error' => 'Invalid data',
                'message' => $e->getMessage(),
            ], 400);

        } catch (\Exception $e) {
            \Log::error('Error processing Midtrans webhook', [
                'order_id' => $orderId ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $payload,
            ]);

            return response()->json([
                'error' => 'Processing failed',
                'message' => 'Internal server error',
            ], 500);
        }
    }

    /**
     * Verify Midtrans signature with enhanced security
     */
    private function verifySignature(string $orderId, string $statusCode, string $grossAmount, string $signature): bool
    {
        try {
            $serverKey = config('midtrans.server_key');
            
            if (empty($serverKey)) {
                \Log::error('Midtrans server key not configured');
                return false;
            }

            $expected = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
            
            // Use hash_equals for timing-safe comparison
            $isValid = hash_equals($expected, $signature);
            
            if (!$isValid) {
                \Log::warning('Signature verification failed', [
                    'order_id' => $orderId,
                    'expected' => $expected,
                    'received' => $signature,
                ]);
            }
            
            return $isValid;

        } catch (\Exception $e) {
            \Log::error('Error in signature verification', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}