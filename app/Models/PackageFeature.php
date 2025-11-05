<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PackageFeature extends Model
{
    protected $fillable = [
        'feature_key',
        'feature_name',
        'description',
        'category',
        'limit_type',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Packages that have this feature
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'package_feature_limits')
            ->withPivot(['is_enabled', 'numeric_limit', 'list_values'])
            ->withTimestamps();
    }

    /**
     * Scope for active features only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope by category
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
