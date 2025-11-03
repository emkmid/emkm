<?php
// Contoh script untuk cancel pembayaran secara manual
// Jalankan dengan: php artisan tinker

use App\Models\Subscription;

// Method 1: Cancel berdasarkan Order ID
$subscription = Subscription::where('midtrans_order_id', 'ORDER-123')->first();
if ($subscription && $subscription->status === 'pending') {
    $subscription->update([
        'status' => 'cancelled',
        'cancelled_at' => now()
    ]);
    echo "Payment cancelled for order: " . $subscription->midtrans_order_id;
}

// Method 2: Cancel berdasarkan User ID
$userId = 1;
$pendingSubscription = Subscription::where('user_id', $userId)
    ->where('status', 'pending')
    ->latest()
    ->first();

if ($pendingSubscription) {
    $pendingSubscription->update([
        'status' => 'cancelled',
        'cancelled_at' => now()
    ]);
    echo "Payment cancelled for user: " . $userId;
}

// Method 3: Bulk cancel semua pending yang expired (lebih dari 24 jam)
$expiredPending = Subscription::where('status', 'pending')
    ->where('created_at', '<', now()->subHours(24))
    ->get();

foreach ($expiredPending as $subscription) {
    $subscription->update([
        'status' => 'cancelled',
        'cancelled_at' => now()
    ]);
    echo "Cancelled expired payment: " . $subscription->midtrans_order_id . "\n";
}
?>