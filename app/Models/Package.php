<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'stripe_product_id',
        'stripe_price_id',
        'features',
        'duration_options',
        'discount_percentage',
        'is_popular',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'duration_options' => 'array',
        'is_active' => 'boolean',
        'is_popular' => 'boolean',
        'price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'stripe_product_id' => 'string',
        'stripe_price_id' => 'string',
    ];

    /**
     * Get all subscriptions for this package
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get feature limits for this package
     */
    public function featureLimits(): BelongsToMany
    {
        return $this->belongsToMany(PackageFeature::class, 'package_feature_limits')
            ->withPivot(['is_enabled', 'numeric_limit', 'list_values'])
            ->withTimestamps();
    }

    /**
     * Check if package has a specific feature enabled
     */
    public function hasFeature(string $featureKey): bool
    {
        // Use fresh query to avoid stale cache
        $feature = $this->featureLimits()
            ->where('feature_key', $featureKey)
            ->wherePivot('is_enabled', true)
            ->first();

        return $feature !== null;
    }

    /**
     * Get numeric limit for a feature
     */
    public function getFeatureLimit(string $featureKey): ?int
    {
        $feature = $this->featureLimits()
            ->where('feature_key', $featureKey)
            ->first();

        if (!$feature || !$feature->pivot->is_enabled) {
            return 0;
        }

        // -1 means unlimited
        return $feature->pivot->numeric_limit ?? null;
    }

    /**
     * Get available duration options
     */
    public function getAvailableDurations(): array
    {
        return $this->duration_options ?? ['1_month'];
    }

    /**
     * Calculate price for specific duration
     */
    public function calculatePrice(string $duration): float
    {
        try {
            if (!in_array($duration, $this->getAvailableDurations())) {
                throw new \InvalidArgumentException("Duration '{$duration}' is not available for package '{$this->name}'");
            }

            $basePrice = $this->price;
            
            if ($basePrice < 0) {
                throw new \InvalidArgumentException("Invalid base price for package '{$this->name}': {$basePrice}");
            }
            
            // Apply discount for longer durations
            // 1 month = NO DISCOUNT (full price)
            // 3+ months = GET DISCOUNT
            $discountMultipliers = [
                '1_month' => 1.0,    // NO DISCOUNT - pay full price
                '3_months' => 0.90,  // 10% discount
                '6_months' => 0.90,  // 10% discount  
                '1_year' => 0.90,    // 10% discount
            ];

            $multiplier = $discountMultipliers[$duration] ?? 1.0;
            
            // Apply custom discount ONLY for 3+ months durations
            if ($this->discount_percentage > 0 && $duration !== '1_month') {
                if ($this->discount_percentage > 100) {
                    throw new \InvalidArgumentException("Invalid discount percentage: {$this->discount_percentage}%");
                }
                $multiplier -= ($this->discount_percentage / 100);
            }

            $periodMultiplier = [
                '1_month' => 1,
                '3_months' => 3,
                '6_months' => 6,
                '1_year' => 12,
            ];

            $finalMultiplier = $periodMultiplier[$duration] ?? 1;
            $finalPrice = $basePrice * $finalMultiplier * $multiplier;

            // Ensure price is not negative after discounts
            if ($finalPrice < 0) {
                \Log::warning('Calculated negative price', [
                    'package_id' => $this->id,
                    'package_name' => $this->name,
                    'base_price' => $basePrice,
                    'duration' => $duration,
                    'calculated_price' => $finalPrice,
                ]);
                return 0;
            }

            return round($finalPrice, 2);

        } catch (\Exception $e) {
            \Log::error('Error calculating package price', [
                'package_id' => $this->id,
                'package_name' => $this->name,
                'duration' => $duration,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Get formatted duration name
     */
    public function formatDuration(string $duration): string
    {
        $durations = [
            '1_month' => '1 Bulan',
            '3_months' => '3 Bulan',
            '6_months' => '6 Bulan',
            '1_year' => '1 Tahun',
        ];

        return $durations[$duration] ?? '1 Bulan';
    }
}
