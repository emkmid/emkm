<?php

namespace App\Observers;

use App\Models\Subscription;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SubscriptionObserver
{
    public function creating(Subscription $subscription)
    {
        try {
            // Set default values if not provided
            if (!$subscription->status) {
                $subscription->status = 'pending';
            }

            // Generate unique transaction ID if not provided
            if (!$subscription->transaction_id) {
                $subscription->transaction_id = 'SUB-' . time() . '-' . $subscription->user_id;
            }

            Log::info('Creating new subscription', [
                'user_id' => $subscription->user_id,
                'package_id' => $subscription->package_id,
                'transaction_id' => $subscription->transaction_id,
                'status' => $subscription->status
            ]);

        } catch (\Exception $e) {
            Log::error('Error in subscription creating observer', [
                'error' => $e->getMessage(),
                'subscription_data' => $subscription->toArray()
            ]);
        }
    }

    public function created(Subscription $subscription)
    {
        try {
            Log::info('Subscription created successfully', [
                'subscription_id' => $subscription->id,
                'user_id' => $subscription->user_id,
                'package_id' => $subscription->package_id,
                'transaction_id' => $subscription->transaction_id,
                'status' => $subscription->status,
                'expires_at' => $subscription->expires_at
            ]);

        } catch (\Exception $e) {
            Log::error('Error in subscription created observer', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function updating(Subscription $subscription)
    {
        try {
            $oldStatus = $subscription->getOriginal('status');
            $newStatus = $subscription->status;

            if ($oldStatus !== $newStatus) {
                Log::info('Subscription status changing', [
                    'subscription_id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'transaction_id' => $subscription->transaction_id
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Error in subscription updating observer', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function updated(Subscription $subscription)
    {
        try {
            $changes = $subscription->getChanges();

            if (!empty($changes)) {
                Log::info('Subscription updated', [
                    'subscription_id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'changes' => $changes,
                    'current_status' => $subscription->status
                ]);

                // Handle status changes
                if (isset($changes['status'])) {
                    $this->handleStatusChange($subscription, $changes['status']);
                }
            }

        } catch (\Exception $e) {
            Log::error('Error in subscription updated observer', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function deleted(Subscription $subscription)
    {
        try {
            Log::warning('Subscription deleted', [
                'subscription_id' => $subscription->id,
                'user_id' => $subscription->user_id,
                'package_id' => $subscription->package_id,
                'status' => $subscription->status,
                'transaction_id' => $subscription->transaction_id
            ]);

        } catch (\Exception $e) {
            Log::error('Error in subscription deleted observer', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    private function handleStatusChange(Subscription $subscription, string $newStatus)
    {
        try {
            switch ($newStatus) {
                case 'active':
                    Log::info('Subscription activated', [
                        'subscription_id' => $subscription->id,
                        'user_id' => $subscription->user_id,
                        'starts_at' => $subscription->starts_at,
                        'expires_at' => $subscription->expires_at
                    ]);
                    break;

                case 'expired':
                    Log::warning('Subscription expired', [
                        'subscription_id' => $subscription->id,
                        'user_id' => $subscription->user_id,
                        'expired_at' => $subscription->expires_at
                    ]);
                    break;

                case 'cancelled':
                    Log::warning('Subscription cancelled', [
                        'subscription_id' => $subscription->id,
                        'user_id' => $subscription->user_id,
                        'cancelled_at' => Carbon::now()
                    ]);
                    break;

                case 'failed':
                    Log::error('Subscription payment failed', [
                        'subscription_id' => $subscription->id,
                        'user_id' => $subscription->user_id,
                        'transaction_id' => $subscription->transaction_id
                    ]);
                    break;
            }

        } catch (\Exception $e) {
            Log::error('Error handling subscription status change', [
                'subscription_id' => $subscription->id,
                'new_status' => $newStatus,
                'error' => $e->getMessage()
            ]);
        }
    }
}