<?php
/**
 * Test Webhook Locally dengan ngrok
 * File ini untuk simulasi webhook dari Midtrans
 */

// Load .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        die("Error: .env file not found at: $path\n");
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        if (!array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
        }
    }
}

loadEnv(__DIR__ . '/.env');

// Konfigurasi - Auto-detect ngrok URL
$ngrokApiUrl = 'http://localhost:4040/api/tunnels';
$ngrokUrl = '';

try {
    $ngrokData = @file_get_contents($ngrokApiUrl);
    if ($ngrokData) {
        $tunnels = json_decode($ngrokData, true);
        if (isset($tunnels['tunnels'][0]['public_url'])) {
            $ngrokUrl = $tunnels['tunnels'][0]['public_url'];
            echo "✓ Auto-detected ngrok URL: $ngrokUrl\n\n";
        }
    }
} catch (Exception $e) {
    // Ignore
}

// Fallback: Manual input jika auto-detect gagal
if (empty($ngrokUrl)) {
    echo "ngrok URL not detected automatically.\n";
    echo "https://feastless-unvoluntarily-freeman.ngrok-free.dev";
    $ngrokUrl = trim(fgets(STDIN));
    
    if (empty($ngrokUrl)) {
        die("Error: ngrok URL is required!\n");
    }
}

$webhookEndpoint = $ngrokUrl . '/webhooks/midtrans';

// Get server key from .env
$serverKey = getenv('MIDTRANS_SERVER_KEY');
if (empty($serverKey)) {
    die("Error: MIDTRANS_SERVER_KEY not found in .env file!\n");
}

// Load database connection
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Get or create test user and package
try {
    $user = \App\Models\User::first();
    if (!$user) {
        echo "⚠️  No users found in database. Please create a user first.\n";
        exit(1);
    }
    
    $package = \App\Models\Package::where('price', '>', 0)->first();
    if (!$package) {
        echo "⚠️  No paid packages found in database. Please create a package first.\n";
        exit(1);
    }
    
    echo "✓ Found test user: {$user->name} (ID: {$user->id})\n";
    echo "✓ Found test package: {$package->name} (Price: {$package->price})\n\n";
    
} catch (Exception $e) {
    echo "Error accessing database: " . $e->getMessage() . "\n";
    exit(1);
}

// Generate order ID format sama seperti yang dibuat MidtransService
$timestamp = time();
$orderId = 'SUB-' . $user->id . '-' . $package->id . '-' . $timestamp;

// Create dummy subscription in database untuk testing
try {
    $subscription = \App\Models\Subscription::create([
        'user_id' => $user->id,
        'package_id' => $package->id,
        'provider' => 'midtrans',
        'midtrans_order_id' => $orderId,
        'price_cents' => $package->price * 100,
        'currency' => 'IDR',
        'interval' => '1_month',
        'status' => 'pending',
        'starts_at' => now(),
        'ends_at' => now()->addMonth(),
    ]);
    
    echo "✓ Created test subscription (ID: {$subscription->id}) with order ID: {$orderId}\n\n";
    
} catch (Exception $e) {
    echo "Error creating subscription: " . $e->getMessage() . "\n";
    exit(1);
}

// Data test untuk berbagai status
$testScenarios = [
    'success_settlement' => [
        'order_id' => $orderId,
        'status_code' => '200',
        'gross_amount' => number_format($package->price, 2, '.', ''),
        'transaction_status' => 'settlement',
        'transaction_id' => 'TXN-' . $timestamp,
        'fraud_status' => 'accept',
        'payment_type' => 'bank_transfer',
        'transaction_time' => date('Y-m-d H:i:s'),
    ],
    'pending' => [
        'order_id' => $orderId,
        'status_code' => '201',
        'gross_amount' => number_format($package->price, 2, '.', ''),
        'transaction_status' => 'pending',
        'transaction_id' => 'TXN-' . $timestamp,
        'payment_type' => 'bank_transfer',
        'transaction_time' => date('Y-m-d H:i:s'),
    ],
    'expired' => [
        'order_id' => $orderId,
        'status_code' => '407',
        'gross_amount' => number_format($package->price, 2, '.', ''),
        'transaction_status' => 'expire',
        'transaction_id' => 'TXN-' . $timestamp,
        'payment_type' => 'bank_transfer',
        'transaction_time' => date('Y-m-d H:i:s'),
    ],
];

// Pilih scenario yang ingin ditest
echo "Available test scenarios:\n";
echo "1. success_settlement - Pembayaran berhasil (Settlement)\n";
echo "2. pending - Pembayaran pending\n";
echo "3. expired - Pembayaran expired\n";
echo "\nEnter scenario number (1-3) [default: 1]: ";

$scenarioInput = trim(fgets(STDIN));
if (empty($scenarioInput)) {
    $scenarioInput = '1';
}

$scenarioMap = [
    '1' => 'success_settlement',
    '2' => 'pending', 
    '3' => 'expired',
];

$scenario = $scenarioMap[$scenarioInput] ?? 'success_settlement';
$testData = $testScenarios[$scenario];

// Generate signature (sama seperti Midtrans)
$signatureString = $testData['order_id'] . $testData['status_code'] . $testData['gross_amount'] . $serverKey;
$testData['signature_key'] = hash('sha512', $signatureString);

echo "========================================\n";
echo "TESTING WEBHOOK LOCALLY WITH NGROK\n";
echo "========================================\n";
echo "Scenario: $scenario\n";
echo "Webhook URL: $webhookEndpoint\n";
echo "Order ID: {$testData['order_id']}\n";
echo "Transaction Status: {$testData['transaction_status']}\n";
echo "========================================\n\n";

// Kirim request ke webhook
$ch = curl_init($webhookEndpoint);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'User-Agent: Veritrans 2.0'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Untuk testing local

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Tampilkan hasil
echo "Response Code: $httpCode\n";
if ($error) {
    echo "Error: $error\n";
} else {
    echo "Response Body:\n";
    echo json_encode(json_decode($response), JSON_PRETTY_PRINT);
    echo "\n";
}

echo "========================================\n";
echo "Test selesai!\n";
echo "Cek log Laravel di storage/logs/laravel.log\n";
echo "========================================\n";

// Check result in database
if ($httpCode == 200 && $scenario === 'success_settlement') {
    echo "\n";
    echo "Checking database result...\n";
    
    sleep(1); // Give time for processing
    
    $updatedSubscription = \App\Models\Subscription::find($subscription->id);
    
    if ($updatedSubscription) {
        echo "Subscription Status: " . $updatedSubscription->status . "\n";
        echo "Activated At: " . ($updatedSubscription->activated_at ?? 'NULL') . "\n";
        echo "Expires At: " . ($updatedSubscription->ends_at ?? 'NULL') . "\n";
        
        if ($updatedSubscription->status === 'active') {
            echo "\n✅ SUCCESS! Subscription otomatis aktif!\n";
        } else {
            echo "\n⚠️  Subscription belum aktif. Cek error di log.\n";
        }
    }
}

echo "\n";
