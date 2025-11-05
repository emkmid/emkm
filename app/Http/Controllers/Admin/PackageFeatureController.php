<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\PackageFeature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PackageFeatureController extends Controller
{
    /**
     * Display a listing of features with their limits per package.
     */
    public function index()
    {
        $packages = Package::with(['featureLimits' => function ($query) {
            $query->orderBy('sort_order');
        }])->get();

        $features = PackageFeature::orderBy('category')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('category');

        // Build feature matrix: [feature_id => [package_id => limit_data]]
        $featureMatrix = [];
        
        foreach (PackageFeature::all() as $feature) {
            $featureMatrix[$feature->id] = [
                'feature' => $feature,
                'limits' => [],
            ];
            
            foreach ($packages as $package) {
                $limit = DB::table('package_feature_limits')
                    ->where('package_id', $package->id)
                    ->where('package_feature_id', $feature->id)
                    ->first();
                
                $featureMatrix[$feature->id]['limits'][$package->id] = $limit ? [
                    'is_enabled' => $limit->is_enabled,
                    'numeric_limit' => $limit->numeric_limit,
                    'list_values' => $limit->list_values,
                ] : null;
            }
        }

        return Inertia::render('admin/features/index', [
            'packages' => $packages,
            'features' => $features,
            'featureMatrix' => $featureMatrix,
        ]);
    }

    /**
     * Show the form for creating a new feature.
     */
    public function create()
    {
        $packages = Package::all();
        
        $categories = PackageFeature::select('category')
            ->distinct()
            ->pluck('category')
            ->toArray();

        return Inertia::render('admin/features/create', [
            'packages' => $packages,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created feature.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'feature_key' => 'required|string|unique:package_features,feature_key',
            'feature_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'limit_type' => 'required|in:boolean,numeric,list',
            'sort_order' => 'nullable|integer',
            'limits' => 'required|array',
            'limits.*.package_id' => 'required|exists:packages,id',
            'limits.*.is_enabled' => 'required|boolean',
            'limits.*.numeric_limit' => 'nullable|integer',
            'limits.*.list_values' => 'nullable|string',
        ]);

        DB::beginTransaction();
        
        try {
            $feature = PackageFeature::create([
                'feature_key' => $validated['feature_key'],
                'feature_name' => $validated['feature_name'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'limit_type' => $validated['limit_type'],
                'sort_order' => $validated['sort_order'] ?? 999,
            ]);

            foreach ($validated['limits'] as $limit) {
                DB::table('package_feature_limits')->insert([
                    'package_id' => $limit['package_id'],
                    'package_feature_id' => $feature->id,
                    'is_enabled' => $limit['is_enabled'],
                    'numeric_limit' => $limit['numeric_limit'],
                    'list_values' => $limit['list_values'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            return redirect()
                ->route('admin.features.index')
                ->with('success', 'Feature berhasil ditambahkan.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Gagal menambahkan feature: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing a feature.
     */
    public function edit(PackageFeature $feature)
    {
        $packages = Package::all();
        
        $limits = [];
        foreach ($packages as $package) {
            $limit = DB::table('package_feature_limits')
                ->where('package_id', $package->id)
                ->where('package_feature_id', $feature->id)
                ->first();
            
            $limits[] = [
                'package_id' => $package->id,
                'package_name' => $package->name,
                'is_enabled' => $limit ? $limit->is_enabled : false,
                'numeric_limit' => $limit ? $limit->numeric_limit : null,
                'list_values' => $limit ? $limit->list_values : null,
            ];
        }

        $categories = PackageFeature::select('category')
            ->distinct()
            ->pluck('category')
            ->toArray();

        return Inertia::render('admin/features/edit', [
            'feature' => $feature,
            'packages' => $packages,
            'limits' => $limits,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified feature.
     */
    public function update(Request $request, PackageFeature $feature)
    {
        $validated = $request->validate([
            'feature_key' => 'required|string|unique:package_features,feature_key,' . $feature->id,
            'feature_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'limit_type' => 'required|in:boolean,numeric,list',
            'sort_order' => 'nullable|integer',
            'limits' => 'required|array',
            'limits.*.package_id' => 'required|exists:packages,id',
            'limits.*.is_enabled' => 'required|boolean',
            'limits.*.numeric_limit' => 'nullable|integer',
            'limits.*.list_values' => 'nullable|string',
        ]);

        DB::beginTransaction();
        
        try {
            $feature->update([
                'feature_key' => $validated['feature_key'],
                'feature_name' => $validated['feature_name'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'limit_type' => $validated['limit_type'],
                'sort_order' => $validated['sort_order'] ?? $feature->sort_order,
            ]);

            // Delete existing limits
            DB::table('package_feature_limits')
                ->where('package_feature_id', $feature->id)
                ->delete();

            // Insert updated limits
            foreach ($validated['limits'] as $limit) {
                DB::table('package_feature_limits')->insert([
                    'package_id' => $limit['package_id'],
                    'package_feature_id' => $feature->id,
                    'is_enabled' => $limit['is_enabled'],
                    'numeric_limit' => $limit['numeric_limit'],
                    'list_values' => $limit['list_values'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            return redirect()
                ->route('admin.features.index')
                ->with('success', 'Feature berhasil diupdate.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Gagal mengupdate feature: ' . $e->getMessage());
        }
    }

    /**
     * Quick update a single limit for a package-feature pair.
     */
    public function updateLimit(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'feature_id' => 'required|exists:package_features,id',
            'is_enabled' => 'required|boolean',
            'numeric_limit' => 'nullable|integer',
            'list_values' => 'nullable|string',
        ]);

        DB::table('package_feature_limits')
            ->updateOrInsert(
                [
                    'package_id' => $validated['package_id'],
                    'package_feature_id' => $validated['feature_id'],
                ],
                [
                    'is_enabled' => $validated['is_enabled'],
                    'numeric_limit' => $validated['numeric_limit'],
                    'list_values' => $validated['list_values'],
                    'updated_at' => now(),
                ]
            );

        return response()->json([
            'success' => true,
            'message' => 'Limit berhasil diupdate.',
        ]);
    }

    /**
     * Delete a feature.
     */
    public function destroy(PackageFeature $feature)
    {
        DB::beginTransaction();
        
        try {
            // Delete all limits
            DB::table('package_feature_limits')
                ->where('package_feature_id', $feature->id)
                ->delete();
            
            // Delete feature
            $feature->delete();
            
            DB::commit();

            return redirect()
                ->route('admin.features.index')
                ->with('success', 'Feature berhasil dihapus.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()
                ->back()
                ->with('error', 'Gagal menghapus feature: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update limits from matrix view.
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.package_id' => 'required|exists:packages,id',
            'updates.*.feature_id' => 'required|exists:package_features,id',
            'updates.*.is_enabled' => 'required|boolean',
            'updates.*.numeric_limit' => 'nullable|integer',
        ]);

        DB::beginTransaction();
        
        try {
            foreach ($validated['updates'] as $update) {
                DB::table('package_feature_limits')
                    ->updateOrInsert(
                        [
                            'package_id' => $update['package_id'],
                            'package_feature_id' => $update['feature_id'],
                        ],
                        [
                            'is_enabled' => $update['is_enabled'],
                            'numeric_limit' => $update['numeric_limit'],
                            'updated_at' => now(),
                        ]
                    );
            }
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($validated['updates']) . ' limit berhasil diupdate.',
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate limits: ' . $e->getMessage(),
            ], 500);
        }
    }
}
