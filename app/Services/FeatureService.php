<?php

namespace App\Services;

use App\Models\User;
use App\Models\Package;
use Illuminate\Support\Facades\Cache;

class FeatureService
{
    /**
     * Check if user has access to a specific feature
     */
    public function hasAccess(User $user, string $featureKey): bool
    {
        $package = $this->getUserPackage($user);
        
        if (!$package) {
            // No package = free tier with limited access
            $package = Package::where('name', 'Free')->first();
        }

        return $package->hasFeature($featureKey);
    }

    /**
     * Get numeric limit for a feature
     * Returns -1 for unlimited, 0 for not allowed, or specific number
     */
    public function getLimit(User $user, string $featureKey): int
    {
        $package = $this->getUserPackage($user);
        
        if (!$package) {
            $package = Package::where('name', 'Free')->first();
        }

        return $package->getFeatureLimit($featureKey) ?? 0;
    }

    /**
     * Check if user has reached their limit for a countable feature
     */
    public function hasReachedLimit(User $user, string $featureKey, int $currentCount): bool
    {
        $limit = $this->getLimit($user, $featureKey);
        
        // -1 means unlimited
        if ($limit === -1) {
            return false;
        }

        // 0 means not allowed
        if ($limit === 0) {
            return true;
        }

        return $currentCount >= $limit;
    }

    /**
     * Get remaining quota for a feature
     */
    public function getRemainingQuota(User $user, string $featureKey, int $currentCount): int
    {
        $limit = $this->getLimit($user, $featureKey);
        
        // Unlimited
        if ($limit === -1) {
            return PHP_INT_MAX;
        }

        // Not allowed
        if ($limit === 0) {
            return 0;
        }

        $remaining = $limit - $currentCount;
        return max(0, $remaining);
    }

    /**
     * Get user's current package from active subscription
     */
    private function getUserPackage(User $user): ?Package
    {
        return Cache::remember(
            "user_package_{$user->id}",
            now()->addMinutes(10),
            function () use ($user) {
                $subscription = $user->subscriptions()
                    ->where('status', 'active')
                    ->where('ends_at', '>', now())
                    ->with('package.featureLimits')
                    ->first();

                return $subscription?->package;
            }
        );
    }

    /**
     * Get all features for user's package grouped by category
     */
    public function getUserFeatures(User $user): array
    {
        $package = $this->getUserPackage($user);
        
        if (!$package) {
            $package = Package::where('name', 'Free')->first();
        }

        $features = $package->featureLimits()
            ->where('is_active', true)
            ->wherePivot('is_enabled', true)
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();

        return $features->groupBy('category')->map(function ($categoryFeatures) {
            return $categoryFeatures->map(function ($feature) {
                return [
                    'key' => $feature->feature_key,
                    'name' => $feature->feature_name,
                    'description' => $feature->description,
                    'limit_type' => $feature->limit_type,
                    'is_enabled' => $feature->pivot->is_enabled,
                    'numeric_limit' => $feature->pivot->numeric_limit,
                    'is_unlimited' => $feature->pivot->numeric_limit === -1,
                ];
            });
        })->toArray();
    }

    /**
     * Clear user's package cache
     */
    public function clearCache(User $user): void
    {
        Cache::forget("user_package_{$user->id}");
    }
}
