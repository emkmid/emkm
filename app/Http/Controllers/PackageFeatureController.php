<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\PackageFeature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageFeatureController extends Controller
{
    /**
     * Display package features management
     */
    public function index()
    {
        $packages = Package::with(['featureLimits' => function ($query) {
            $query->where('is_active', true)->orderBy('category')->orderBy('sort_order');
        }])->get();

        $features = PackageFeature::active()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('category');

        return Inertia::render('admin/package-features/index', [
            'packages' => $packages,
            'features' => $features,
        ]);
    }

    /**
     * Update feature limits for a package
     */
    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'features' => 'required|array',
            'features.*.feature_id' => 'required|exists:package_features,id',
            'features.*.is_enabled' => 'required|boolean',
            'features.*.numeric_limit' => 'nullable|integer|min:-1',
        ]);

        foreach ($validated['features'] as $featureData) {
            $package->featureLimits()->syncWithoutDetaching([
                $featureData['feature_id'] => [
                    'is_enabled' => $featureData['is_enabled'],
                    'numeric_limit' => $featureData['numeric_limit'],
                ]
            ]);
        }

        return redirect()->back()->with('success', 'Fitur paket berhasil diperbarui');
    }

    /**
     * Toggle feature for package
     */
    public function toggleFeature(Request $request, Package $package, PackageFeature $feature)
    {
        $validated = $request->validate([
            'is_enabled' => 'required|boolean',
            'numeric_limit' => 'nullable|integer|min:-1',
        ]);

        $package->featureLimits()->syncWithoutDetaching([
            $feature->id => [
                'is_enabled' => $validated['is_enabled'],
                'numeric_limit' => $validated['numeric_limit'] ?? null,
            ]
        ]);

        return redirect()->back()->with('success', 
            $validated['is_enabled'] 
                ? "Fitur {$feature->feature_name} diaktifkan" 
                : "Fitur {$feature->feature_name} dinonaktifkan"
        );
    }

    /**
     * Create new feature (for admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'feature_key' => 'required|string|unique:package_features',
            'feature_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'limit_type' => 'required|in:boolean,numeric,list',
            'sort_order' => 'nullable|integer',
        ]);

        $feature = PackageFeature::create($validated);

        return redirect()->back()->with('success', 'Fitur baru berhasil ditambahkan');
    }

    /**
     * Update feature definition
     */
    public function updateFeature(Request $request, PackageFeature $feature)
    {
        $validated = $request->validate([
            'feature_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'limit_type' => 'required|in:boolean,numeric,list',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $feature->update($validated);

        return redirect()->back()->with('success', 'Fitur berhasil diperbarui');
    }
}
