<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MidtransWebhookTest extends TestCase
{
    use RefreshDatabase;

    public function test_midtrans_webhook_activates_subscription_and_is_idempotent()
    {
        // Prepare environment
        config(['midtrans.server_key' => env('MIDTRANS_SERVER_KEY')]);

        // Create user and package
        $user = User::factory()->create(['email' => 'buyer@example.test']);
        $package = Package::create([
            'name' => 'Test Package',
            'description' => 'Test',
            'price' => 10000, // IDR
            'is_active' => true,
        ]);

        // Create pending subscription linked by order_id
        $orderId = 'order_test_'.time();
        $sub = Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'midtrans',
            'midtrans_order_id' => $orderId,
            'price_cents' => $package->price * 100,
            'currency' => 'IDR',
            'interval' => 'month',
            'status' => 'pending',
        ]);

        // Build payload similar to Midtrans notification
        $statusCode = '200';
        $grossAmount = (string) $package->price; // Midtrans sends as string
        $transactionStatus = 'settlement';
        $transactionId = 'trx_'.uniqid();

        $signature = hash('sha512', $orderId.$statusCode.$grossAmount.env('MIDTRANS_SERVER_KEY'));

        $payload = [
            'order_id' => $orderId,
            'status_code' => $statusCode,
            'gross_amount' => $grossAmount,
            'signature_key' => $signature,
            'transaction_status' => $transactionStatus,
            'transaction_id' => $transactionId,
            'payment_type' => 'bank_transfer',
        ];

        // First call - should process and activate subscription
        $resp = $this->postJson('/webhooks/midtrans', $payload);
        $resp->assertStatus(200);

        $sub->refresh();
        $this->assertEquals('active', $sub->status);
        $this->assertNotNull($sub->midtrans_transaction_id);

        // Ensure payment_notification recorded and processed
        $this->assertDatabaseHas('payment_notifications', [
            'provider' => 'midtrans',
            'order_id' => $orderId,
            'provider_event_id' => $transactionId,
        ]);

        // Second call (duplicate) - should be idempotent and not change processed state
        $resp2 = $this->postJson('/webhooks/midtrans', $payload);
        $resp2->assertStatus(200);

        // Ensure only one processed notification remains (processed_at set)
        $this->assertDatabaseHas('payment_notifications', [
            'provider' => 'midtrans',
            'order_id' => $orderId,
        ]);
    }
}
