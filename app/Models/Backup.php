<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Backup extends Model
{
    protected $fillable = [
        'filename',
        'path',
        'size',
        'type',
        'created_by',
        'description',
        'completed_at',
        'status',
        'error_message',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'size' => 'integer',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getSizeInMBAttribute()
    {
        return $this->size ? round($this->size / 1024 / 1024, 2) : 0;
    }

    public function getFormattedSizeAttribute()
    {
        if (!$this->size) return '0 B';
        
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = $this->size;
        
        for ($i = 0; $bytes >= 1024 && $i < 3; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
