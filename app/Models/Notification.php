<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'title',
        'message',
        'type',
        'target_users',
        'scheduled_at',
        'sent_at',
        'is_sent',
        'created_by',
    ];

    protected $casts = [
        'target_users' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'is_sent' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
