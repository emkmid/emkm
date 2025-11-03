<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\MidtransWebhookController;
use Illuminate\Http\Request;

class TestMidtransWebhook extends Command
{
    protected $signature = 'test:midtrans-webhook {order_id} {status=settlement}';
    protected $description = 'Test Midtrans webhook processing';

    public function handle()
    {
        try {
            $orderId = $this->argument('order_id');
            $status = $this->argument('status');

            $this->info("Testing Midtrans Webhook");
            $this->info("Order ID: {$orderId}");
            $this->info("Status: {$status}");
            $this->line('');

            // Create fake webhook request data
            $webhookData = [
                'transaction_time' => now()->format('Y-m-d H:i:s'),
                'transaction_status' => $status,
                'transaction_id' => 'test-txn-' . time(),
                'status_message' => 'midtrans payment success',
                'status_code' => '200',
                'signature_key' => 'test-signature-key',
                'settlement_time' => now()->format('Y-m-d H:i:s'),
                'payment_type' => 'credit_card',
                'order_id' => $orderId,
                'merchant_id' => config('midtrans.merchant_id', 'G150957554'),
                'gross_amount' => '50000.00',
                'fraud_status' => 'accept',
                'currency' => 'IDR'
            ];

            $this->info("Webhook data:");
            $this->line(json_encode($webhookData, JSON_PRETTY_PRINT));
            $this->line('');

            // Create fake request
            $request = new Request();
            $request->merge($webhookData);

            // Get subscription before webhook
            $subscription = \App\Models\Subscription::where('midtrans_order_id', $orderId)->first();
            if ($subscription) {
                $this->info("Found subscription before webhook:");
                $this->info("- ID: {$subscription->id}");
                $this->info("- Status: {$subscription->status}");
                $this->info("- User: {$subscription->user->name}");
                $this->info("- Package: {$subscription->package->name}");
                $this->line('');
            } else {
                $this->warn("No subscription found with order ID: {$orderId}");
            }

            // Process webhook using service directly
            $this->info("Processing webhook...");
            $midtransService = app(\App\Services\MidtransService::class);
            
            // Use test mode to bypass signature verification
            $result = $midtransService->processPaymentNotificationTest($webhookData);

            if ($result['success']) {
                $this->info("✓ Webhook processed successfully!");
                
                // Get subscription after webhook
                $subscription = \App\Models\Subscription::where('midtrans_order_id', $orderId)->first();
                if ($subscription) {
                    $this->info("Subscription after webhook:");
                    $this->info("- ID: {$subscription->id}");
                    $this->info("- Status: {$subscription->status}");
                    $this->info("- Starts at: {$subscription->starts_at}");
                    $this->info("- Expires at: {$subscription->expires_at}");
                    $this->line('');
                }
                
                $this->info("Payment notification saved:");
                $notification = \App\Models\PaymentNotification::latest()->first();
                if ($notification) {
                    $this->info("- ID: {$notification->id}");
                    $this->info("- Transaction ID: {$notification->transaction_id}");
                    $this->info("- Status: {$notification->status}");
                    $this->info("- Amount: {$notification->gross_amount}");
                }
                
            } else {
                $this->error("✗ Webhook processing failed");
                if (isset($result['error'])) {
                    $this->error("Error: " . $result['error']);
                }
            }

        } catch (\Exception $e) {
            $this->error("Test failed with exception: " . $e->getMessage());
            $this->error("File: " . $e->getFile());
            $this->error("Line: " . $e->getLine());
            
            return 1;
        }

        return 0;
    }
}