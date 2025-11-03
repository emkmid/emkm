<?php
// Debug script untuk test Midtrans
require_once __DIR__ . '/vendor/autoload.php';

// Load Laravel bootstrap
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Package;
use App\Services\MidtransService;

try {
    echo "=== DEBUG MIDTRANS INTEGRATION ===\n\n";
    
    // 1. Test Environment Variables
    echo "1. Testing Environment Variables:\n";
    echo "MIDTRANS_SERVER_KEY: " . (config('midtrans.server_key') ? 'SET' : 'NOT SET') . "\n";
    echo "MIDTRANS_CLIENT_KEY: " . (config('midtrans.client_key') ? 'SET' : 'NOT SET') . "\n";
    echo "MIDTRANS_IS_PRODUCTION: " . (config('midtrans.is_production') ? 'TRUE' : 'FALSE') . "\n\n";
    
    // 2. Test Database Connection
    echo "2. Testing Database Connection:\n";
    $userCount = User::count();
    $packageCount = Package::count();
    echo "Users: {$userCount}\n";
    echo "Packages: {$packageCount}\n\n";
    
    // 3. Test User & Package
    $user = User::first();
    $package = Package::where('is_active', true)->where('price', '>', 0)->first(); // Get paid package
    
    if (!$user) {
        echo "ERROR: No users found in database\n";
        exit(1);
    }
    
    if (!$package) {
        echo "ERROR: No active paid packages found in database\n";
        exit(1);
    }
    
    echo "3. Testing with User & Package:\n";
    echo "User: {$user->name} ({$user->email})\n";
    echo "Package: {$package->name} - IDR " . number_format($package->price) . "\n\n";
    
    // 4. Test MidtransService
    echo "4. Testing MidtransService:\n";
    $midtransService = new MidtransService();
    
    // Check if user has active subscription
    $activeSubscription = $user->subscriptions()->where('status', 'active')->first();
    if ($activeSubscription) {
        echo "WARNING: User already has active subscription\n";
        echo "Subscription ID: {$activeSubscription->id}\n";
        echo "Package: {$activeSubscription->package->name}\n";
        echo "Status: {$activeSubscription->status}\n\n";
    }
    
    // 5. Test Create Payment (will fail if active subscription exists)
    echo "5. Testing Create Payment:\n";
    try {
        $result = $midtransService->createSubscriptionPayment($user, $package, '1_month');
        
        if ($result['success']) {
            echo "SUCCESS!\n";
            echo "Order ID: {$result['order_id']}\n";
            echo "Snap Token: " . substr($result['snap_token'], 0, 20) . "...\n";
            echo "Subscription ID: {$result['subscription']->id}\n\n";
            
            // 6. Test Frontend Data
            echo "6. Frontend Integration Data:\n";
            echo "Client Key: " . config('midtrans.client_key') . "\n";
            echo "Is Production: " . (config('midtrans.is_production') ? 'true' : 'false') . "\n";
            echo "Snap URL: " . (config('midtrans.is_production') ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js') . "\n\n";
            
            echo "7. JavaScript Code untuk Test:\n";
            echo "<script>\n";
            echo "// Load Midtrans Snap\n";
            echo "const script = document.createElement('script');\n";
            echo "script.src = '" . (config('midtrans.is_production') ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js') . "';\n";
            echo "script.setAttribute('data-client-key', '" . config('midtrans.client_key') . "');\n";
            echo "document.head.appendChild(script);\n\n";
            echo "// After script loads, call:\n";
            echo "snap.pay('{$result['snap_token']}');\n";
            echo "</script>\n\n";
            
        } else {
            echo "FAILED: {$result['error']}\n";
            if (isset($result['error_code'])) {
                echo "Error Code: {$result['error_code']}\n";
            }
            if (isset($result['details'])) {
                echo "Details: " . json_encode($result['details']) . "\n";
            }
        }
    } catch (\Exception $e) {
        echo "EXCEPTION: " . $e->getMessage() . "\n";
        echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
        echo "Trace: " . $e->getTraceAsString() . "\n\n";
    }
    
    echo "=== DEBUG COMPLETE ===\n";
    
} catch (\Exception $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
?>