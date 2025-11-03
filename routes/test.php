<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MidtransWebhookController;
use App\Services\MidtransService;

/*
|--------------------------------------------------------------------------
| Test Routes for Midtrans Webhook
|--------------------------------------------------------------------------
|
| Routes untuk testing webhook Midtrans tanpa perlu menunggu notifikasi
| dari server Midtrans yang sebenarnya.
|
*/

Route::prefix('test')->group(function () {
    // Test webhook dengan signature verification
    Route::post('/webhook/midtrans', [MidtransWebhookController::class, 'handle']);
    
    // Test webhook dengan simulation (bypass signature)
    Route::post('/webhook/midtrans/simulate', function (Illuminate\Http\Request $request) {
        $midtransService = app(MidtransService::class);
        
        // Default test data jika tidak ada payload
        $testPayload = $request->all() ?: [
            'order_id' => 'SUB-8-3-1762179553',
            'transaction_status' => 'settlement',
            'transaction_id' => 'test-txn-' . time(),
            'payment_type' => 'bank_transfer',
            'gross_amount' => '100000',
            'status_code' => '200',
            'fraud_status' => 'accept',
        ];
        
        \Log::info('Testing webhook simulation', ['payload' => $testPayload]);
        
        try {
            $result = $midtransService->processPaymentNotificationTest($testPayload);
            
            return response()->json([
                'success' => true,
                'message' => 'Webhook simulation completed',
                'result' => $result,
                'payload_used' => $testPayload,
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Webhook simulation failed', [
                'error' => $e->getMessage(),
                'payload' => $testPayload,
            ]);
            
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'payload_used' => $testPayload,
            ], 500);
        }
    });
    
    // Get subscription status
    Route::get('/subscription/{orderId}', function ($orderId) {
        $subscription = \App\Models\Subscription::where('midtrans_order_id', $orderId)->first();
        
        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }
        
        return response()->json([
            'subscription' => [
                'id' => $subscription->id,
                'status' => $subscription->status,
                'midtrans_order_id' => $subscription->midtrans_order_id,
                'midtrans_transaction_id' => $subscription->midtrans_transaction_id,
                'midtrans_payment_type' => $subscription->midtrans_payment_type,
                'starts_at' => $subscription->starts_at,
                'ends_at' => $subscription->ends_at,
                'created_at' => $subscription->created_at,
                'updated_at' => $subscription->updated_at,
            ]
        ]);
    });
    
    // Manually activate subscription (for emergency)
    Route::post('/subscription/{orderId}/activate', function ($orderId) {
        $subscription = \App\Models\Subscription::where('midtrans_order_id', $orderId)->first();
        
        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }
        
        if ($subscription->status === 'active') {
            return response()->json(['message' => 'Subscription already active']);
        }
        
        \Log::info('Manually activating subscription', [
            'subscription_id' => $subscription->id,
            'order_id' => $orderId,
            'old_status' => $subscription->status,
        ]);
        
        $subscription->update([
            'status' => 'active',
            'starts_at' => now(),
            'midtrans_transaction_id' => 'manual-activation-' . time(),
            'midtrans_payment_type' => 'manual',
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Subscription activated manually',
            'subscription' => [
                'id' => $subscription->id,
                'status' => $subscription->status,
                'starts_at' => $subscription->starts_at,
            ]
        ]);
    });
});