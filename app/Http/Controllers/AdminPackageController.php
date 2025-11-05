<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Models\Package;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminPackageController extends Controller
{
    public function index()
    {
        $packages = Package::paginate(10);

        return Inertia::render('dashboard/admin/packages/index', [
            'packages' => $packages,
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/admin/packages/create');
    }

    public function store(StorePackageRequest $request)
    {
        // Convert features array to object format
        $features = [];
        if ($request->has('features') && is_array($request->features)) {
            foreach ($request->features as $feature) {
                $features[$feature] = true;
            }
        }
        
        Package::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'features' => $features,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.packages.index')->with('success', 'Package created successfully.');
    }

    public function edit(Package $package)
    {
        // Convert features object to array of enabled feature keys for easier handling in frontend
        $features = $package->features;
        $featureKeys = [];
        
        if (is_array($features)) {
            foreach ($features as $key => $value) {
                if ($value === true) {
                    $featureKeys[] = $key;
                }
            }
        }
        
        return Inertia::render('dashboard/admin/packages/edit', [
            'pkg' => [
                'id' => $package->id,
                'name' => $package->name,
                'description' => $package->description,
                'price' => $package->price,
                'features' => $featureKeys,
                'is_active' => $package->is_active,
            ],
        ]);
    }

    public function update(UpdatePackageRequest $request, Package $package)
    {
        // Convert features array back to object format
        $features = [];
        if ($request->has('features') && is_array($request->features)) {
            foreach ($request->features as $feature) {
                $features[$feature] = true;
            }
        }
        
        $package->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'features' => $features,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('admin.packages.index')->with('success', 'Package updated successfully.');
    }

    public function destroy(Package $package)
    {
        $package->delete();

        return redirect()->route('admin.packages.index')->with('success', 'Package deleted successfully.');
    }
}
