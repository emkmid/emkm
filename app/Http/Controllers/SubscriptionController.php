<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    public function index()
    {
        $packages = Package::where('is_active', true)->get();
        return response()->json($packages);
    }

    /**
     * Render the Inertia packages page for users to view plans.
     */
    public function page()
    {
        return Inertia::render('dashboard/user/packages/index');
    }

    /**
     * Create a Stripe Checkout session for the authenticated user.
     * Requires STRIPE_SECRET in env and stripe/stripe-php installed.
     */
    public function createCheckout(Request $request)
    {
        $request->validate([
            'package_id' => ['required', 'integer', 'exists:packages,id'],
        ]);

        $user = Auth::user();
        $package = Package::findOrFail($request->package_id);

        // If Midtrans is configured, use Midtrans Snap (preferred for Indonesian merchants)
        if (env('MIDTRANS_SERVER_KEY') && env('MIDTRANS_CLIENT_KEY')) {
            try {
                // Build order id and params
                $orderId = 'order_'.time().'_'.uniqid();

                // Assume package->price is in IDR (integer). If decimals are used, adjust accordingly.
                $grossAmount = (int) $package->price;

                \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY');
                \Midtrans\Config::$isProduction = filter_var(env('MIDTRANS_IS_PRODUCTION', false), FILTER_VALIDATE_BOOLEAN);
                \Midtrans\Config::$clientKey = env('MIDTRANS_CLIENT_KEY');

                $params = [
                    'transaction_details' => [
                        'order_id' => $orderId,
                        'gross_amount' => $grossAmount,
                    ],
                    'customer_details' => [
                        'first_name' => $user->name ?? $user->email,
                        'email' => $user->email,
                    ],
                    'item_details' => [[
                        'id' => (string) $package->id,
                        'price' => $grossAmount,
                        'quantity' => 1,
                        'name' => $package->name,
                    ]],
                ];

                $snap = new \Midtrans\Snap();
                $snapToken = $snap->getSnapToken($params);

                // create a pending subscription to reconcile later via webhook
                $sub = Subscription::create([
                    'user_id' => $user->id,
                    'package_id' => $package->id,
                    'provider' => 'midtrans',
                    'midtrans_order_id' => $orderId,
                    'price_cents' => (int) ($package->price * 100),
                    'currency' => 'IDR',
                    'interval' => 'month',
                    'status' => 'pending',
                    'starts_at' => null,
                    'ends_at' => null,
                ]);

                return response()->json([
                    'snap_token' => $snapToken,
                    'client_key' => env('MIDTRANS_CLIENT_KEY'),
                    'is_production' => \Midtrans\Config::$isProduction,
                ]);
            } catch (\Throwable $e) {
                Log::error('Midtrans checkout error: '.$e->getMessage());
                return response()->json(['error' => 'Could not create midtrans snap token'], 500);
            }
        }

        // Simple fallback: if Stripe not configured, create a manual subscription
        if (! env('STRIPE_SECRET')) {
            $sub = Subscription::create([
                'user_id' => $user->id,
                'package_id' => $package->id,
                'provider' => 'manual',
                'price_cents' => (int) ($package->price * 100),
                'currency' => 'USD',
                'interval' => 'month',
                'status' => 'active',
                'starts_at' => now(),
                'ends_at' => now()->addMonth(),
            ]);

            return response()->json(['manual' => true, 'subscription_id' => $sub->id]);
        }

        // If stripe is available, use it (stripe/stripe-php must be installed)
        try {
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'mode' => 'subscription',
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => ['name' => $package->name],
                        'unit_amount' => (int) ($package->price * 100),
                        'recurring' => ['interval' => 'month'],
                    ],
                    'quantity' => 1,
                ]],
                'customer_email' => $user->email,
                'success_url' => route('dashboard').'?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('dashboard'),
            ]);

            return response()->json(['url' => $session->url]);
        } catch (\Throwable $e) {
            Log::error('Stripe checkout error: '.$e->getMessage());
            return response()->json(['error' => 'Could not create checkout session'], 500);
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
    }
