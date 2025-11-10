<?php

namespace App\Services;

use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;
use App\Models\PaymentNotification;
use App\Exceptions\MidtransException;
use App\Exceptions\SubscriptionException;
use App\Exceptions\PaymentException;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;

class MidtransService
{
    public function __construct()
    {
        $this->configureMidtrans();
    }

    private function configureMidtrans()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Create subscription payment
     */
    public function createSubscriptionPayment(User $user, Package $package, string $duration = '1_month')
    {
        try {
            // Validate input parameters
            if (!in_array($duration, ['1_month', '3_months', '6_months', '1_year'])) {
                throw new \InvalidArgumentException("Invalid duration: {$duration}");
            }

            if (!$package->is_active) {
                throw new \InvalidArgumentException("Package is not active: {$package->name}");
            }

            if ($package->price <= 0) {
                return [
                    'success' => false,
                    'error' => 'Free packages do not require payment processing.',
                    'error_code' => 'FREE_PACKAGE_NOT_SUPPORTED'
                ];
            }

            // Check for existing active subscription
            $existingSubscription = $user->subscriptions()
                ->where('status', 'active')
                ->with('package')
                ->first();

            if ($existingSubscription) {
                $currentPackage = $existingSubscription->package;
                
                // Prevent subscribing to the same package
                if ($currentPackage->id === $package->id) {
                    throw new \Exception("You already have an active {$currentPackage->name} subscription");
                }
                
                // Allow upgrades (from lower price to higher price) or package changes
                if ($package->price >= $currentPackage->price) {
                    \Log::info('Preparing upgrade/change package', [
                        'user_id' => $user->id,
                        'from_package' => $currentPackage->name,
                        'from_price' => $currentPackage->price,
                        'to_package' => $package->name,
                        'to_price' => $package->price,
                        'is_upgrade' => $package->price > $currentPackage->price,
                    ]);
                    // Old subscription will be cancelled when new one is activated
                } else {
                    // Downgrade - also allow but log as warning
                    \Log::warning('User downgrading package', [
                        'user_id' => $user->id,
                        'from_package' => $currentPackage->name,
                        'from_price' => $currentPackage->price,
                        'to_package' => $package->name,
                        'to_price' => $package->price,
                    ]);
                }
            }

            $orderId = 'SUB-' . $user->id . '-' . $package->id . '-' . time();
            
            // Calculate end date based on duration
            $endsAt = $this->calculateEndDate($duration);
            
            // Create subscription record in database transaction
            \DB::beginTransaction();
            
            try {
                $subscription = Subscription::create([
                    'user_id' => $user->id,
                    'package_id' => $package->id,
                    'provider' => 'midtrans',
                    'midtrans_order_id' => $orderId,
                    'price_cents' => $package->calculatePrice($duration) * 100, // Convert to cents
                    'currency' => 'IDR',
                    'interval' => $duration,
                    'status' => 'pending',
                    'starts_at' => now(),
                    'ends_at' => $endsAt,
                ]);

                // Prepare Midtrans transaction data
                $transactionData = $this->buildTransactionData($user, $package, $subscription, $duration);

                $snapToken = Snap::getSnapToken($transactionData);
                
                // Update subscription with snap token
                $subscription->update(['snap_token' => $snapToken]);
                
                \DB::commit();
                
                \Log::info('Subscription payment created successfully', [
                    'user_id' => $user->id,
                    'package_id' => $package->id,
                    'subscription_id' => $subscription->id,
                    'order_id' => $orderId,
                    'duration' => $duration,
                ]);

                return [
                    'success' => true,
                    'snap_token' => $snapToken,
                    'subscription' => $subscription,
                    'order_id' => $orderId,
                ];

            } catch (\Exception $e) {
                \DB::rollback();
                throw $e;
            }

        } catch (\Midtrans\Exceptions\MidtransException $e) {
            \Log::error('Midtrans API error in createSubscriptionPayment', [
                'user_id' => $user->id,
                'package_id' => $package->id,
                'error' => $e->getMessage(),
                'http_status' => $e->getHttpStatus() ?? null,
                'response' => $e->getResponse() ?? null,
            ]);

            return [
                'success' => false,
                'error' => 'Payment gateway error: ' . $e->getMessage(),
                'error_code' => 'MIDTRANS_API_ERROR',
            ];

        } catch (\InvalidArgumentException $e) {
            \Log::error('Invalid argument in createSubscriptionPayment', [
                'user_id' => $user->id,
                'package_id' => $package->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'error_code' => 'INVALID_ARGUMENT',
            ];

        } catch (\Exception $e) {
            \Log::error('Unexpected error in createSubscriptionPayment', [
                'user_id' => $user->id,
                'package_id' => $package->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'An unexpected error occurred. Please try again.',
                'error_code' => 'UNEXPECTED_ERROR',
            ];
        }
    }

    /**
     * Build transaction data for Midtrans
     */
    private function buildTransactionData(User $user, Package $package, Subscription $subscription, string $duration): array
    {
        $finalPrice = $package->calculatePrice($duration);
        
        return [
            'transaction_details' => [
                'order_id' => $subscription->midtrans_order_id,
                'gross_amount' => $finalPrice,
            ],
            'customer_details' => [
                'first_name' => $user->name ?? 'Customer',
                'email' => $user->email,
                'phone' => $user->phone ?? '+628123456789', // Default phone
            ],
            'item_details' => [
                [
                    'id' => 'package-' . $package->id,
                    'price' => $finalPrice,
                    'quantity' => 1,
                    'name' => $package->name . ' - ' . $this->formatDuration($duration),
                    'category' => 'Subscription',
                ]
            ],
            'callbacks' => [
                'finish' => url('/subscriptions/success'),
                'error' => url('/subscriptions/error'),
                'pending' => url('/subscriptions/pending'),
            ],
            'expiry' => [
                'duration' => 60, // 60 minutes
                'unit' => 'minute'
            ],
            'custom_field1' => $subscription->id, // Store subscription ID for webhook
            'custom_field2' => $duration,
            'custom_field3' => $user->id,
        ];
    }

    /**
     * Process payment notification from Midtrans
     */
    public function processPaymentNotification(array $notification)
    {
        try {
            // Validate required fields
            $requiredFields = ['order_id', 'transaction_status', 'signature_key'];
            foreach ($requiredFields as $field) {
                if (!isset($notification[$field]) || empty($notification[$field])) {
                    throw new \InvalidArgumentException("Missing required field: {$field}");
                }
            }

            $orderId = $notification['order_id'];
            $transactionStatus = $notification['transaction_status'];
            $fraudStatus = $notification['fraud_status'] ?? null;

            // Find subscription by order ID
            $subscription = Subscription::where('midtrans_order_id', $orderId)->first();
            
            if (!$subscription) {
                throw new \Exception("Subscription with order ID {$orderId} not found");
            }

            // Check if notification already processed
            if ($subscription->midtrans_transaction_id === ($notification['transaction_id'] ?? null) 
                && in_array($subscription->status, ['active', 'cancelled', 'failed'])) {
                \Log::info('Payment notification already processed', [
                    'order_id' => $orderId,
                    'subscription_id' => $subscription->id,
                    'current_status' => $subscription->status,
                ]);
                return $subscription;
            }

            // Start database transaction
            \DB::beginTransaction();

            try {
                // Update subscription with transaction details
                $subscription->update([
                    'midtrans_transaction_id' => $notification['transaction_id'] ?? null,
                    'midtrans_payment_type' => $notification['payment_type'] ?? null,
                ]);

                // Process based on transaction status
                switch ($transactionStatus) {
                    case 'capture':
                        if ($fraudStatus === 'accept') {
                            $this->activateSubscription($subscription);
                        } elseif ($fraudStatus === 'challenge') {
                            $subscription->update(['status' => 'pending']);
                            \Log::warning('Payment requires manual review', [
                                'order_id' => $orderId,
                                'fraud_status' => $fraudStatus,
                            ]);
                        } else {
                            $subscription->update(['status' => 'failed']);
                            \Log::warning('Payment failed fraud check', [
                                'order_id' => $orderId,
                                'fraud_status' => $fraudStatus,
                            ]);
                        }
                        break;
                        
                    case 'settlement':
                        $this->activateSubscription($subscription);
                        break;
                        
                    case 'pending':
                        $subscription->update(['status' => 'pending']);
                        \Log::info('Payment is pending', ['order_id' => $orderId]);
                        break;
                        
                    case 'deny':
                    case 'expire':
                    case 'cancel':
                    case 'failure':
                        $subscription->update(['status' => 'failed']);
                        \Log::info('Payment failed or cancelled', [
                            'order_id' => $orderId,
                            'status' => $transactionStatus,
                        ]);
                        break;

                    default:
                        \Log::warning('Unknown transaction status', [
                            'order_id' => $orderId,
                            'status' => $transactionStatus,
                        ]);
                        break;
                }

                \DB::commit();

                \Log::info('Payment notification processed successfully', [
                    'order_id' => $orderId,
                    'subscription_id' => $subscription->id,
                    'status' => $subscription->status,
                    'transaction_status' => $transactionStatus,
                ]);

                return $subscription;

            } catch (\Exception $e) {
                \DB::rollback();
                throw $e;
            }

        } catch (\InvalidArgumentException $e) {
            \Log::error('Invalid payment notification data', [
                'error' => $e->getMessage(),
                'notification' => $notification,
            ]);
            throw $e;

        } catch (\Exception $e) {
            \Log::error('Error processing payment notification', [
                'error' => $e->getMessage(),
                'notification' => $notification,
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Activate subscription
     */
    private function activateSubscription(Subscription $subscription)
    {
        try {
            // Cancel any other active/pending subscriptions for this user
            Subscription::where('user_id', $subscription->user_id)
                ->where('id', '!=', $subscription->id)
                ->whereIn('status', ['pending', 'active'])
                ->update([
                    'status' => 'cancelled',
                    'cancelled_at' => now(),
                ]);
            
            $subscription->update([
                'status' => 'active',
                'starts_at' => now(),
                'activated_at' => now(), // Set activated_at timestamp
            ]);
            
            // Clear user package cache (without tags - for file/database cache driver)
            \Cache::forget("user_package_{$subscription->user_id}");

            \Log::info('Subscription activated successfully', [
                'subscription_id' => $subscription->id,
                'user_id' => $subscription->user_id,
                'package_id' => $subscription->package_id,
                'starts_at' => $subscription->starts_at,
                'ends_at' => $subscription->ends_at,
            ]);

            // Send activation notification email
            try {
                \Mail::to($subscription->user)->send(
                    new \App\Mail\SubscriptionActivatedMail($subscription)
                );
            } catch (\Exception $e) {
                \Log::warning('Failed to send activation email', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);
            }

            // Send payment success email
            try {
                $amount = $subscription->price_cents / 100;
                \Mail::to($subscription->user)->send(
                    new \App\Mail\PaymentSuccessMail(
                        $subscription,
                        $subscription->midtrans_transaction_id ?? 'N/A',
                        $amount
                    )
                );
            } catch (\Exception $e) {
                \Log::warning('Failed to send payment success email', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);
            }

            // Create in-app notification
            try {
                \App\Models\UserNotification::create([
                    'user_id' => $subscription->user_id,
                    'type' => 'success',
                    'title' => 'Subscription Activated',
                    'message' => "Your {$subscription->package->name} subscription is now active!",
                    'action_text' => 'View Dashboard',
                    'action_url' => route('dashboard'),
                ]);
            } catch (\Exception $e) {
                \Log::warning('Failed to create in-app notification', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);
            }

        } catch (\Exception $e) {
            \Log::error('Failed to activate subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Calculate end date based on duration
     */
    private function calculateEndDate(string $duration): \Carbon\Carbon
    {
        try {
            $now = now();
            
            switch ($duration) {
                case '1_month':
                    return $now->copy()->addMonth();
                case '3_months':
                    return $now->copy()->addMonths(3);
                case '6_months':
                    return $now->copy()->addMonths(6);
                case '1_year':
                    return $now->copy()->addYear();
                default:
                    throw new \InvalidArgumentException("Invalid duration: {$duration}");
            }
        } catch (\Exception $e) {
            \Log::error('Error calculating end date', [
                'duration' => $duration,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Format duration for display
     */
    private function formatDuration(string $duration): string
    {
        $durations = [
            '1_month' => '1 Bulan',
            '3_months' => '3 Bulan',
            '6_months' => '6 Bulan',
            '1_year' => '1 Tahun',
        ];

        return $durations[$duration] ?? '1 Bulan';
    }

    /**
     * Check if subscription is about to expire
     */
    public function checkExpiringSubscriptions()
    {
        $expiringSubscriptions = Subscription::where('status', 'active')
            ->where('ends_at', '<=', now()->addDays(7))
            ->where('ends_at', '>', now())
            ->get();

        foreach ($expiringSubscriptions as $subscription) {
            // Send expiring notification
            // Mail::to($subscription->user)->send(new SubscriptionExpiringMail($subscription));
        }

        return $expiringSubscriptions;
    }

    /**
     * Expire subscriptions
     */
    public function expireSubscriptions()
    {
        $expiredSubscriptions = Subscription::where('status', 'active')
            ->where('ends_at', '<=', now())
            ->get();

        foreach ($expiredSubscriptions as $subscription) {
            $subscription->update(['status' => 'expired']);
            
            // Send expired notification
            // Mail::to($subscription->user)->send(new SubscriptionExpiredMail($subscription));
        }

        return $expiredSubscriptions;
    }

    /**
     * Process payment notification for testing (bypasses signature verification)
     */
    public function processPaymentNotificationTest(array $notification)
    {
        try {
            // Validate required fields (excluding signature_key for testing)
            $requiredFields = ['order_id', 'transaction_status'];
            foreach ($requiredFields as $field) {
                if (!isset($notification[$field]) || empty($notification[$field])) {
                    throw new \InvalidArgumentException("Missing required field: {$field}");
                }
            }

            $orderId = $notification['order_id'];
            $transactionStatus = $notification['transaction_status'];
            $fraudStatus = $notification['fraud_status'] ?? null;

            Log::info('Processing test payment notification', [
                'order_id' => $orderId,
                'transaction_status' => $transactionStatus,
                'notification_data' => $notification
            ]);

            // Find subscription by order ID
            $subscription = Subscription::where('midtrans_order_id', $orderId)->first();
            
            if (!$subscription) {
                throw new \Exception("Subscription with order ID {$orderId} not found");
            }

            // Check if notification already processed
            if ($subscription->midtrans_transaction_id === ($notification['transaction_id'] ?? null) 
                && in_array($subscription->status, ['active', 'cancelled', 'failed'])) {
                Log::info('Payment notification already processed', [
                    'order_id' => $orderId,
                    'subscription_id' => $subscription->id,
                    'current_status' => $subscription->status,
                ]);
                return [
                    'success' => true,
                    'subscription' => $subscription,
                    'message' => 'Already processed'
                ];
            }

            // Start database transaction
            DB::beginTransaction();

            try {
                // Save payment notification
                $paymentNotification = PaymentNotification::create([
                    'provider' => 'midtrans',
                    'provider_event_id' => $notification['transaction_id'] ?? 'test-txn',
                    'order_id' => $orderId,
                    'signature' => $notification['signature_key'] ?? 'test-signature',
                    'payload' => $notification,
                    'processed_at' => now(),
                ]);

                // Update subscription based on transaction status
                $newStatus = $this->mapTransactionStatusToSubscriptionStatus($transactionStatus, $fraudStatus);
                
                $updateData = [
                    'midtrans_transaction_id' => $notification['transaction_id'] ?? 'test-txn',
                    'midtrans_payment_type' => $notification['payment_type'] ?? 'test',
                    'status' => $newStatus,
                ];

                // If payment is successful, set active dates
                if ($newStatus === 'active') {
                    $updateData['starts_at'] = now();
                    $updateData['activated_at'] = now();
                    $updateData['ends_at'] = $this->calculateEndDate($subscription->interval);
                }

                $subscription->update($updateData);

                DB::commit();

                Log::info('Test payment notification processed successfully', [
                    'order_id' => $orderId,
                    'subscription_id' => $subscription->id,
                    'old_status' => $subscription->getOriginal('status'),
                    'new_status' => $newStatus,
                    'payment_notification_id' => $paymentNotification->id,
                ]);

                return [
                    'success' => true,
                    'subscription' => $subscription->fresh(),
                    'payment_notification' => $paymentNotification,
                ];

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Failed to process test payment notification', [
                'error' => $e->getMessage(),
                'notification_data' => $notification,
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Map Midtrans transaction status to subscription status
     */
    private function mapTransactionStatusToSubscriptionStatus(string $transactionStatus, ?string $fraudStatus = null): string
    {
        // If transaction has fraud status, handle it first
        if ($fraudStatus === 'deny') {
            return 'failed';
        }

        // Map transaction status to subscription status
        switch ($transactionStatus) {
            case 'capture':
            case 'settlement':
                return 'active';
            
            case 'pending':
                return 'pending';
            
            case 'deny':
            case 'cancel':
            case 'expire':
            case 'failure':
                return 'failed';
            
            default:
                return 'pending';
        }
    }
}