<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MidtransWebhookFailureTest extends TestCase
{
    use RefreshDatabase;

    public function test_midtrans_webhook_marks_failed_on_expire()
    {
        $user = User::factory()->create(['email' => 'buyer2@example.test']);
        $package = Package::create([
            'name' => 'Test Package 2',
            'description' => 'Test',
            'price' => 5000,
            'is_active' => true,
        ]);

        $orderId = 'order_test_expire_'.time();
        $sub = Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'midtrans',
            'midtrans_order_id' => $orderId,
            'status' => 'pending',
        ]);

        $statusCode = '200';
        $grossAmount = (string) $package->price;
        $transactionStatus = 'expire';
        $transactionId = 'trx_exp_'.uniqid();
        $signature = hash('sha512', $orderId.$statusCode.$grossAmount.env('MIDTRANS_SERVER_KEY'));

        $payload = [
            'order_id' => $orderId,
            'status_code' => $statusCode,
            'gross_amount' => $grossAmount,
            'signature_key' => $signature,
            'transaction_status' => $transactionStatus,
            'transaction_id' => $transactionId,
            'payment_type' => 'qris',
        ];

        $resp = $this->postJson('/webhooks/midtrans', $payload);
        $resp->assertStatus(200);

        $sub->refresh();
        $this->assertEquals('failed', $sub->status);
    }

    public function test_midtrans_webhook_marks_failed_on_deny()
    {
        $user = User::factory()->create(['email' => 'buyer3@example.test']);
        $package = Package::create([
            'name' => 'Test Package 3',
            'description' => 'Test',
            'price' => 7500,
            'is_active' => true,
        ]);

        $orderId = 'order_test_deny_'.time();
        $sub = Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'midtrans',
            'midtrans_order_id' => $orderId,
            'status' => 'pending',
        ]);

        $statusCode = '200';
        $grossAmount = (string) $package->price;
        $transactionStatus = 'deny';
        $transactionId = 'trx_den_'.uniqid();
        $signature = hash('sha512', $orderId.$statusCode.$grossAmount.env('MIDTRANS_SERVER_KEY'));

        $payload = [
            'order_id' => $orderId,
            'status_code' => $statusCode,
            'gross_amount' => $grossAmount,
            'signature_key' => $signature,
            'transaction_status' => $transactionStatus,
            'transaction_id' => $transactionId,
            'payment_type' => 'credit_card',
        ];

        $resp = $this->postJson('/webhooks/midtrans', $payload);
        $resp->assertStatus(200);

        $sub->refresh();
        $this->assertEquals('failed', $sub->status);
    }
}
