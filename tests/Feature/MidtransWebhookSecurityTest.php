<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MidtransWebhookSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Fake mail to prevent email sending errors in tests
        Mail::fake();
        
        // Set Midtrans configuration for testing
        config(['midtrans.server_key' => 'test-server-key']);
        config(['midtrans.is_production' => false]);
    }

    public function test_webhook_rejects_invalid_signature()
    {
        $user = User::factory()->create();
        $package = Package::create([
            'name' => 'Test Package',
            'description' => 'Test',
            'price' => 10000,
            'is_active' => true,
        ]);
        
        $orderId = 'order_test_' . time();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'midtrans',
            'midtrans_order_id' => $orderId,
            'price_cents' => 1000000,
            'currency' => 'IDR',
            'interval' => '1_month',
            'status' => 'pending',
        ]);

        $payload = [
            'order_id' => $orderId,
            'status_code' => '200',
            'gross_amount' => '10000',
            'signature_key' => 'invalid_signature',
            'transaction_status' => 'settlement',
            'transaction_id' => 'trx_' . uniqid(),
            'payment_type' => 'bank_transfer',
        ];

        $response = $this->postJson('/webhooks/midtrans', $payload);

        $response->assertStatus(401);
        $response->assertJson(['error' => 'Invalid signature']);
    }

    public function test_webhook_accepts_valid_signature()
    {
        $user = User::factory()->create();
        $package = Package::create([
            'name' => 'Test Package',
            'description' => 'Test',
            'price' => 10000,
            'is_active' => true,
        ]);
        
        $orderId = 'order_test_' . time();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'midtrans',
            'midtrans_order_id' => $orderId,
            'price_cents' => 1000000,
            'currency' => 'IDR',
            'interval' => '1_month',
            'status' => 'pending',
        ]);

        $statusCode = '200';
        $grossAmount = '10000';
        $serverKey = config('midtrans.server_key');
        $signature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        $payload = [
            'order_id' => $orderId,
            'status_code' => $statusCode,
            'gross_amount' => $grossAmount,
            'signature_key' => $signature,
            'transaction_status' => 'settlement',
            'transaction_id' => 'trx_' . uniqid(),
            'payment_type' => 'bank_transfer',
        ];

        $response = $this->postJson('/webhooks/midtrans', $payload);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'ok']);
        
        $subscription->refresh();
        $this->assertEquals('active', $subscription->status);
    }

    public function test_webhook_prevents_duplicate_processing()
    {
        $user = User::factory()->create();
        $package = Package::create([
            'name' => 'Test Package',
            'description' => 'Test',
            'price' => 10000,
            'is_active' => true,
        ]);
        
        $orderId = 'order_test_' . time();
        $transactionId = 'trx_' . uniqid();
        
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'midtrans',
            'midtrans_order_id' => $orderId,
            'price_cents' => 1000000,
            'currency' => 'IDR',
            'interval' => '1_month',
            'status' => 'pending',
        ]);

        $statusCode = '200';
        $grossAmount = '10000';
        $serverKey = config('midtrans.server_key');
        $signature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        $payload = [
            'order_id' => $orderId,
            'status_code' => $statusCode,
            'gross_amount' => $grossAmount,
            'signature_key' => $signature,
            'transaction_status' => 'settlement',
            'transaction_id' => $transactionId,
            'payment_type' => 'bank_transfer',
        ];

        // First request - should process
        $response1 = $this->postJson('/webhooks/midtrans', $payload);
        $response1->assertStatus(200);

        // Second request - should detect duplicate
        $response2 = $this->postJson('/webhooks/midtrans', $payload);
        $response2->assertStatus(200);
        $response2->assertJson(['message' => 'Already processed']);

        // Verify subscription was only activated once
        $subscription->refresh();
        $this->assertEquals('active', $subscription->status);
    }

    public function test_webhook_requires_all_fields()
    {
        $payload = [
            'order_id' => 'order_123',
            // Missing required fields
        ];

        $response = $this->postJson('/webhooks/midtrans', $payload);

        $response->assertStatus(400);
        $response->assertJsonStructure(['error', 'missing_fields']);
    }

    public function test_ip_whitelist_blocks_unauthorized_ips_in_production()
    {
        config(['midtrans.is_production' => true]);
        config(['midtrans.webhook_ip_whitelist_enabled' => true]);

        $user = User::factory()->create();
        $package = Package::create([
            'name' => 'Test Package',
            'description' => 'Test',
            'price' => 10000,
            'is_active' => true,
        ]);
        
        $orderId = 'order_test_' . time();
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'midtrans',
            'midtrans_order_id' => $orderId,
            'price_cents' => 1000000,
            'currency' => 'IDR',
            'interval' => '1_month',
            'status' => 'pending',
        ]);

        $statusCode = '200';
        $grossAmount = '10000';
        $serverKey = config('midtrans.server_key');
        $signature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        $payload = [
            'order_id' => $orderId,
            'status_code' => $statusCode,
            'gross_amount' => $grossAmount,
            'signature_key' => $signature,
            'transaction_status' => 'settlement',
            'transaction_id' => 'trx_' . uniqid(),
            'payment_type' => 'bank_transfer',
        ];

        // Simulate request from unauthorized IP
        $response = $this->withServerVariables(['REMOTE_ADDR' => '192.168.1.100'])
            ->postJson('/webhooks/midtrans', $payload);

        // Should be rejected in production
        $response->assertStatus(403);
    }
}
