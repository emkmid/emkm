<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'package_id',
        'provider',
        'provider_subscription_id',
        'midtrans_order_id',
        'midtrans_transaction_id',
        'midtrans_payment_type',
        'price_cents',
        'currency',
        'interval',
        'status',
        'starts_at',
        'ends_at',
        'trial_ends_at',
        'cancelled_at',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'trial_ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'price_cents' => 'integer',
        'midtrans_order_id' => 'string',
        'midtrans_transaction_id' => 'string',
        'midtrans_payment_type' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function isActive(): bool
    {
        return in_array($this->status, ['active', 'trial']);
    }

    public function isExpired(): bool
    {
        return $this->ends_at !== null && $this->ends_at->isPast();
    }
}
