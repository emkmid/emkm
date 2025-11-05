<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\PackageFeature;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $packages = Package::where('is_active', true)->get();
        return response()->json($packages);
    }

    /**
     * Display the subscription page.
     */
    public function page()
    {
        $packages = Package::where('is_active', true)->get();
        $userSubscription = Auth::user()->subscriptions()
            ->where('status', 'active')
            ->with('package')
            ->first();

        // Check for pending payment within last 10 minutes
        $pendingPayment = Auth::user()->subscriptions()
            ->where('status', 'pending')
            ->where('created_at', '>', now()->subMinutes(10))
            ->with('package')
            ->latest()
            ->first();

        $pendingPaymentData = null;
        if ($pendingPayment) {
            $pendingPaymentData = [
                'subscription_id' => $pendingPayment->id,
                'package_name' => $pendingPayment->package->name,
                'amount' => $pendingPayment->amount,
                'order_id' => $pendingPayment->provider_subscription_id,
                'snap_token' => $pendingPayment->snap_token ?? null,
                'created_at' => $pendingPayment->created_at->toISOString(),
            ];
        }

        // Get all features grouped by category
        $features = PackageFeature::orderBy('category')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('category');

        // Build feature comparison matrix
        $featureComparison = [];
        foreach ($features as $category => $categoryFeatures) {
            $featureComparison[$category] = [];
            
            foreach ($categoryFeatures as $feature) {
                $featureLimits = [];
                
                foreach ($packages as $package) {
                    $limit = DB::table('package_feature_limits')
                        ->where('package_id', $package->id)
                        ->where('package_feature_id', $feature->id)
                        ->first();
                    
                    $featureLimits[$package->id] = $limit ? [
                        'is_enabled' => $limit->is_enabled,
                        'numeric_limit' => $limit->numeric_limit,
                        'list_values' => $limit->list_values,
                    ] : [
                        'is_enabled' => false,
                        'numeric_limit' => null,
                        'list_values' => null,
                    ];
                }
                
                $featureComparison[$category][] = [
                    'feature' => $feature,
                    'limits' => $featureLimits,
                ];
            }
        }

        return Inertia::render('Subscription/Index', [
            'packages' => $packages,
            'userSubscription' => $userSubscription,
            'pendingPayment' => $pendingPaymentData,
            'featureComparison' => $featureComparison,
        ]);
    }

    /**
     * Create a Stripe Checkout session for the authenticated user.
     * Requires STRIPE_SECRET in env and stripe/stripe-php installed.
     */
    public function createCheckout(Request $request)
    {
        try {
            $request->validate([
                'package_id' => ['required', 'integer', 'exists:packages,id'],
                'duration' => ['required', 'string', 'in:1_month,3_months,6_months,1_year'],
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated.',
                    'error_code' => 'UNAUTHENTICATED',
                ], 401);
            }

            $package = Package::findOrFail($request->package_id);

            // Validate package is active
            if (!$package->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Package is currently not available.',
                    'error_code' => 'PACKAGE_INACTIVE',
                ], 400);
            }

            // Validate duration is supported for this package
            if (!in_array($request->duration, $package->duration_options ?? [])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected duration is not available for this package.',
                    'error_code' => 'INVALID_DURATION',
                ], 400);
            }

            // Check if user already has active subscription
            $activeSubscription = $user->subscriptions()
                ->where('status', 'active')
                ->first();

            if ($activeSubscription) {
                $errorData = [
                    'message' => 'Anda sudah memiliki subscription aktif.',
                    'error_code' => 'ACTIVE_SUBSCRIPTION_EXISTS',
                    'data' => [
                        'current_subscription' => [
                            'package_name' => $activeSubscription->package->name ?? 'Unknown',
                            'ends_at' => $activeSubscription->ends_at,
                        ]
                    ]
                ];

                if ($request->header('X-Inertia')) {
                    return redirect()->back()->withErrors(['subscription' => $errorData['message']])->with('error_details', $errorData);
                }

                return response()->json([
                    'success' => false,
                    ...$errorData
                ], 400);
            }

            // Check for recent pending subscription (prevent spam)
            $recentPending = $user->subscriptions()
                ->where('status', 'pending')
                ->where('created_at', '>', now()->subMinutes(5))
                ->first();

            if ($recentPending) {
                // Auto-cancel old pending and allow new checkout
                $recentPending->update([
                    'status' => 'cancelled',
                    'cancelled_at' => now()
                ]);
                
                \Log::info('Auto-cancelled old pending subscription for new checkout', [
                    'old_subscription_id' => $recentPending->id,
                    'user_id' => $user->id,
                ]);
            }

            // Use MidtransService for payment processing
            $midtransService = app(\App\Services\MidtransService::class);
            $result = $midtransService->createSubscriptionPayment($user, $package, $request->duration);

            \Log::info('MidtransService result', [
                'user_id' => $user->id,
                'package_id' => $package->id,
                'duration' => $request->duration,
                'result' => $result,
            ]);

            if ($result['success']) {
                \Log::info('Creating checkout data for Inertia', [
                    'snap_token' => $result['snap_token'],
                    'order_id' => $result['order_id'],
                    'subscription_id' => $result['subscription']->id,
                    'has_inertia_header' => $request->header('X-Inertia') ? 'yes' : 'no',
                ]);

                $checkoutData = [
                    'snap_token' => $result['snap_token'],
                    'order_id' => $result['order_id'],
                    'client_key' => config('midtrans.client_key'),
                    'is_production' => config('midtrans.is_production'),
                    'subscription_id' => $result['subscription']->id,
                ];

                // For Inertia requests, return checkout data directly in response
                if ($request->header('X-Inertia')) {
                    // Return Inertia response with checkout data in props
                    return \Inertia\Inertia::render('Subscription/Index', [
                        'packages' => Package::where('is_active', true)->get(),
                        'userSubscription' => $user->subscriptions()
                            ->where('status', 'active')
                            ->with('package')
                            ->first(),
                        'pendingPayment' => null,
                        'checkoutData' => $checkoutData,
                    ]);
                }

                // For regular AJAX requests
                return response()->json([
                    'success' => true,
                    ...$checkoutData
                ]);
            }

            // Only handle error responses if success is false
            $errorData = [
                'success' => false,
                'message' => $result['error'] ?? 'Gagal membuat pembayaran.',
                'error_code' => $result['error_code'] ?? 'PAYMENT_CREATION_FAILED',
            ];

            \Log::error('MidtransService returned error', [
                'user_id' => $user->id,
                'package_id' => $package->id,
                'error_data' => $errorData,
            ]);

            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors($errorData);
            }

            return response()->json($errorData, 500);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Validation error in createCheckout', [
                'user_id' => Auth::id(),
                'errors' => $e->errors(),
                'input' => $request->all(),
            ]);

            $errorData = [
                'success' => false,
                'message' => 'Data yang diberikan tidak valid.',
                'error_code' => 'VALIDATION_ERROR',
                'errors' => $e->errors(),
            ];

            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors($errorData);
            }

            return response()->json($errorData, 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::warning('Package not found in createCheckout', [
                'user_id' => Auth::id(),
                'package_id' => $request->package_id,
            ]);

            $errorData = [
                'success' => false,
                'message' => 'Package tidak ditemukan.',
                'error_code' => 'PACKAGE_NOT_FOUND',
            ];

            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors($errorData);
            }

            return response()->json($errorData, 404);

        } catch (\Exception $e) {
            \Log::error('Unexpected error in createCheckout', [
                'user_id' => Auth::id(),
                'package_id' => $request->package_id ?? null,
                'duration' => $request->duration ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $errorData = [
                'success' => false,
                'message' => 'Terjadi kesalahan sistem. Silakan coba lagi.',
                'error_code' => 'SYSTEM_ERROR',
            ];

            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors($errorData);
            }

            return response()->json($errorData, 500);
        }
    }

    /**
     * Handle Midtrans notification (server-to-server).
     * Expects the standard midtrans notification payload.
     */
    public function midtransWebhook(Request $request)
    {
        $payload = $request->all();

        $orderId = $payload['order_id'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signature = $payload['signature_key'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $transactionId = $payload['transaction_id'] ?? null;
        $paymentType = $payload['payment_type'] ?? null;

        Log::info('Midtrans webhook: order='.$orderId.' status='.$transactionStatus);

        // Verify signature
        if (! $orderId || ! $statusCode || ! $grossAmount || ! $signature) {
            Log::warning('Midtrans webhook missing fields');
            return response()->json(['error' => 'missing fields'], 400);
        }

        $expected = hash('sha512', $orderId.$statusCode.$grossAmount.env('MIDTRANS_SERVER_KEY'));
        if ($expected !== $signature) {
            Log::warning('Midtrans webhook signature mismatch for order '.$orderId);
            return response()->json(['error' => 'invalid signature'], 400);
        }

        // Idempotency: record notification and skip if already processed
        try {
            $existing = \App\Models\PaymentNotification::where('provider', 'midtrans')
                ->where(function ($q) use ($transactionId, $orderId, $signature) {
                    if ($transactionId) $q->orWhere('provider_event_id', $transactionId);
                    if ($orderId) $q->orWhere('order_id', $orderId);
                    if ($signature) $q->orWhere('signature', $signature);
                })
                ->first();

            if ($existing && $existing->processed_at) {
                Log::info('Midtrans webhook already processed for order '.$orderId);
                return response()->json(['status' => 'ok']);
            }

            $notification = \App\Models\PaymentNotification::create([
                'provider' => 'midtrans',
                'provider_event_id' => $transactionId,
                'order_id' => $orderId,
                'signature' => $signature,
                'payload' => $payload,
            ]);
        } catch (\Throwable $e) {
            Log::warning('Failed to persist midtrans notification: '.$e->getMessage());
        }

        // Find subscription by midtrans_order_id
        $sub = Subscription::where('midtrans_order_id', $orderId)->first();
        if (! $sub) {
            Log::warning('Midtrans webhook: subscription not found for order '.$orderId);
            return response()->json(['status' => 'ok']);
        }

        // Map statuses
        if (in_array($transactionStatus, ['capture', 'settlement'])) {
            $sub->status = 'active';
            $sub->midtrans_transaction_id = $transactionId;
            $sub->midtrans_payment_type = $paymentType;
            $sub->starts_at = now();
            $sub->ends_at = now()->addMonth();
            $sub->save();
            Log::info('Midtrans subscription activated: '.$sub->id);
            if (isset($notification)) {
                $notification->processed_at = now();
                $notification->save();
            }
        } elseif (in_array($transactionStatus, ['deny', 'cancel', 'expire', 'failure'])) {
            $sub->status = 'failed';
            $sub->midtrans_transaction_id = $transactionId;
            $sub->midtrans_payment_type = $paymentType;
            $sub->ends_at = now();
            $sub->save();
            Log::info('Midtrans subscription failed/expired: '.$sub->id);
            if (isset($notification)) {
                $notification->processed_at = now();
                $notification->save();
            }
        } else {
            Log::info('Midtrans webhook unhandled status: '.$transactionStatus);
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Handle Stripe webhook events.
     * Note: requires STRIPE_WEBHOOK_SECRET in env to validate signature.
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        if (env('STRIPE_SECRET') && env('STRIPE_WEBHOOK_SECRET')) {
            try {
                \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
                $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, env('STRIPE_WEBHOOK_SECRET'));
            } catch (\Throwable $e) {
                Log::error('Stripe webhook signature verification failed: '.$e->getMessage());
                return response()->json(['error' => 'Invalid signature'], 400);
            }
        } else {
            // If no webhook secret set, try to decode body
            $event = json_decode($payload, true);
        }

        // Process event
        $type = is_object($event) ? $event->type : ($event['type'] ?? null);
        Log::info('Stripe webhook received: '.$type);

        // A minimal implementation: handle checkout.session.completed and invoice.payment_succeeded
        if ($type === 'checkout.session.completed') {
            $session = is_object($event) ? $event->data->object : $event['data']['object'];
            // You would map the session to a user and create a subscription record here.
            Log::info('Checkout completed for customer_email: '.($session->customer_email ?? ''));
        }

        if ($type === 'invoice.payment_succeeded') {
            $invoice = is_object($event) ? $event->data->object : $event['data']['object'];
            Log::info('Invoice paid: '.($invoice->id ?? ''));
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Payment success callback
     */
    public function success(Request $request)
    {
        return Inertia::render('Subscription/Success', [
            'order_id' => $request->order_id,
            'transaction_id' => $request->transaction_id,
        ]);
    }

    /**
     * Payment error callback
     */
    public function error(Request $request)
    {
        return Inertia::render('Subscription/Error', [
            'message' => 'Pembayaran gagal atau dibatalkan.',
        ]);
    }

    /**
     * Payment pending callback
     */
    public function pending(Request $request)
    {
        return Inertia::render('Subscription/Pending', [
            'order_id' => $request->order_id,
            'message' => 'Pembayaran Anda sedang diproses.',
        ]);
    }

    /**
     * Show user's subscription history
     */
    public function history()
    {
        $subscriptions = Auth::user()->subscriptions()
            ->with('package')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Subscription/History', [
            'subscriptions' => $subscriptions,
        ]);
    }

    /**
     * Cancel subscription
     */
    public function cancel(Request $request)
    {
        $subscription = Auth::user()->subscriptions()
            ->where('status', 'active')
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada subscription aktif.',
            ], 400);
        }

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subscription berhasil dibatalkan.',
        ]);
    }

        /**
         * Change (upgrade/downgrade) a user's active Stripe subscription to another package.
         * Proration behavior is set to create_prorations by default.
         */
    public function change(Request $request)
    {
            $request->validate([
                'package_id' => ['required', 'integer', 'exists:packages,id'],
            ]);

            $user = Auth::user();
            $package = Package::findOrFail($request->package_id);

            $sub = Subscription::where('user_id', $user->id)->where('status', 'active')->where('provider', 'stripe')->first();
            if (! $sub) {
                return response()->json(['error' => 'No active stripe subscription found'], 404);
            }

            if (! $package->stripe_price_id) {
                return response()->json(['error' => 'Target package has no stripe price configured'], 400);
            }

            try {
                \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

                $stripeSub = \Stripe\Subscription::retrieve($sub->provider_subscription_id);

                // Pick the subscription item id to update
                $itemId = $stripeSub->items->data[0]->id ?? null;
                if (! $itemId) {
                    return response()->json(['error' => 'No subscription item found']);
                }

                $updated = \Stripe\Subscription::update($sub->provider_subscription_id, [
                    'items' => [[ 'id' => $itemId, 'price' => $package->stripe_price_id ]],
                    'proration_behavior' => 'create_prorations',
                ]);

                // Update local record with new package mapping (optionally map by price id to package)
                $sub->package_id = $package->id;
                $sub->price_cents = (int) ($package->price * 100);
                $sub->save();

                return response()->json(['status' => 'ok', 'stripe' => $updated]);
            } catch (\Throwable $e) {
                Log::error('Stripe subscription change error: '.$e->getMessage());
                return response()->json(['error' => 'Failed to update subscription'], 500);
            }
    }

    /**
     * Cancel a pending subscription
     */
    public function cancelPending(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|integer|exists:subscriptions,id'
        ]);

        $subscription = Subscription::findOrFail($request->subscription_id);
        
        // Check if subscription belongs to authenticated user
        if ($subscription->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Only allow cancelling pending subscriptions
        if ($subscription->status !== 'pending') {
            return response()->json(['error' => 'Can only cancel pending subscriptions'], 400);
        }

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now()
        ]);

        \Log::info('Subscription cancelled by user', [
            'subscription_id' => $subscription->id,
            'user_id' => Auth::id(),
            'order_id' => $subscription->midtrans_order_id
        ]);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Pembayaran berhasil dibatalkan');
        }

        return response()->json(['success' => true, 'message' => 'Subscription cancelled successfully']);
    }

    /**
     * Activate free package for user
     */
    public function activateFree(Request $request)
    {
        $request->validate([
            'package_id' => 'required|integer|exists:packages,id',
        ]);

        $user = Auth::user();
        $package = Package::findOrFail($request->package_id);

        // Only allow free packages
        if ($package->price > 0) {
            return response()->json([
                'success' => false,
                'message' => 'This method is only for free packages.',
                'error_code' => 'NOT_FREE_PACKAGE'
            ], 400);
        }

        // Check if user already has active subscription
        $activeSubscription = $user->subscriptions()
            ->where('status', 'active')
            ->first();

        if ($activeSubscription) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memiliki subscription aktif.',
                'error_code' => 'ACTIVE_SUBSCRIPTION_EXISTS'
            ], 400);
        }

        // Create free subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'provider' => 'internal',
            'price_cents' => 0,
            'currency' => 'IDR',
            'interval' => '1_year', // Free packages typically last 1 year
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => now()->addYear(),
        ]);

        \Log::info('Free subscription activated', [
            'user_id' => $user->id,
            'package_id' => $package->id,
            'subscription_id' => $subscription->id,
        ]);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Package gratis berhasil diaktivasi!');
        }

        return response()->json([
            'success' => true,
            'message' => 'Free package activated successfully',
            'subscription' => $subscription
        ]);
    }
}
