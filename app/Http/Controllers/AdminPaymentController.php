<?php

namespace App\Http\Controllers;

use App\Models\PaymentNotification;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/admin/payments/index');
    }

    public function list(Request $request)
    {
        $query = PaymentNotification::query();

        if ($provider = $request->query('provider')) {
            $query->where('provider', $provider);
        }

        if ($orderId = $request->query('order_id')) {
            $query->where('order_id', 'like', "%{$orderId}%");
        }

        if ($eventId = $request->query('event_id')) {
            $query->where('provider_event_id', 'like', "%{$eventId}%");
        }

        if ($signature = $request->query('signature')) {
            $query->where('signature', 'like', "%{$signature}%");
        }

        if ($search = $request->query('q')) {
            // search order_id or provider_event_id or payload
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                    ->orWhere('provider_event_id', 'like', "%{$search}%")
                    ->orWhere('payload', 'like', "%{$search}%");
            });
        }

        $perPage = max(10, min(200, (int) $request->query('per_page', 25)));
        $items = $query->orderBy('created_at', 'desc')->paginate($perPage)->appends($request->query());

        return response()->json($items);
    }

    public function subscriptionsList(Request $request)
    {
        $query = Subscription::with(['user', 'package']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($orderId = $request->query('order_id')) {
            $query->where('midtrans_order_id', 'like', "%{$orderId}%");
        }

        if ($user = $request->query('user')) {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('email', 'like', "%{$user}%")->orWhere('name', 'like', "%{$user}%");
            });
        }

        $perPage = max(10, min(200, (int) $request->query('per_page', 25)));
        $subs = $query->orderBy('created_at', 'desc')->paginate($perPage)->appends($request->query());

        return response()->json($subs);
    }

    public function showNotification($id)
    {
        $n = PaymentNotification::findOrFail($id);
        return response()->json($n);
    }

    public function exportNotifications(Request $request)
    {
        $query = PaymentNotification::query();

        if ($provider = $request->query('provider')) {
            $query->where('provider', $provider);
        }

        $fileName = 'payment_notifications_'.date('Ymd_His').'.csv';

        $callback = function () use ($query) {
            $handle = fopen('php://output', 'w');
            // header
            fputcsv($handle, ['id','provider','order_id','provider_event_id','processed_at','created_at','payload']);

            $query->orderBy('created_at','desc')->chunk(200, function ($rows) use ($handle) {
                foreach ($rows as $r) {
                    fputcsv($handle, [
                        $r->id,
                        $r->provider,
                        $r->order_id,
                        $r->provider_event_id,
                        $r->processed_at ? $r->processed_at->toDateTimeString() : '',
                        $r->created_at ? $r->created_at->toDateTimeString() : '',
                        json_encode($r->payload),
                    ]);
                }
            });

            fclose($handle);
        };

        return response()->streamDownload($callback, $fileName, [
            'Content-Type' => 'text/csv',
        ]);
    }

    /**
     * Replay / reprocess a stored payment notification.
     * This will attempt to apply the same processing logic used by the live webhook.
     */
    public function replay(Request $request, $id)
    {
        $n = PaymentNotification::findOrFail($id);

        // Only support midtrans for now
        if ($n->provider !== 'midtrans') {
            return response()->json(['error' => 'unsupported provider'], 400);
        }

        $payload = $n->payload ?? [];
        $orderId = $payload['order_id'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $transactionId = $payload['transaction_id'] ?? null;
        $paymentType = $payload['payment_type'] ?? null;

        // Find the subscription
        $sub = Subscription::where('midtrans_order_id', $orderId)->first();
        if (! $sub) {
            return response()->json(['error' => 'subscription not found'], 404);
        }

        try {
            if (in_array($transactionStatus, ['capture', 'settlement'])) {
                $sub->status = 'active';
                $sub->midtrans_transaction_id = $transactionId;
                $sub->midtrans_payment_type = $paymentType;
                $sub->starts_at = now();
                $sub->ends_at = now()->addMonth();
                $sub->save();

                $n->processed_at = now();
                $n->save();

                return response()->json(['status' => 'ok', 'message' => 'Subscription activated']);
            }

            if (in_array($transactionStatus, ['deny', 'cancel', 'expire', 'failure'])) {
                $sub->status = 'failed';
                $sub->midtrans_transaction_id = $transactionId;
                $sub->midtrans_payment_type = $paymentType;
                $sub->ends_at = now();
                $sub->save();

                $n->processed_at = now();
                $n->save();

                return response()->json(['status' => 'ok', 'message' => 'Subscription marked failed/expired']);
            }

            return response()->json(['status' => 'ok', 'message' => 'No action for status: '.$transactionStatus]);
        } catch (\Throwable $e) {
            \Log::error('Replay notification failed: '.$e->getMessage());
            return response()->json(['error' => 'Replay failed'], 500);
        }
    }
}
