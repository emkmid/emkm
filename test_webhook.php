<?php

use App\Http\Controllers\MidtransWebhookController;
use Illuminate\Http\Request;

// Test webhook simulation
$orderId = 'SUB-1-2-1762169263';
$statusCode = '200';
$grossAmount = '50000.00';
$serverKey = config('midtrans.server_key');
$signature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

$testPayload = [
    'order_id' => $orderId,
    'status_code' => $statusCode,
    'gross_amount' => $grossAmount,
    'signature_key' => $signature,
    'transaction_status' => 'settlement',
    'transaction_id' => 'TXN-' . time(),
    'payment_type' => 'bank_transfer',
    'transaction_time' => date('Y-m-d H:i:s'),
    'fraud_status' => 'accept',
];

echo "Test Webhook Payload:\n";
echo json_encode($testPayload, JSON_PRETTY_PRINT);
echo "\n\nSignature verification:\n";
echo "Expected: " . $signature . "\n";
echo "Order ID: " . $orderId . "\n";
echo "Status Code: " . $statusCode . "\n";
echo "Gross Amount: " . $grossAmount . "\n";