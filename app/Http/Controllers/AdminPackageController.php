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
        Package::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'features' => $request->features,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('packages.index')->with('success', 'Package created successfully.');
    }

    public function edit(Package $package)
    {
        return Inertia::render('dashboard/admin/packages/edit', [
            'pkg' => $package,
        ]);
    }

    public function update(UpdatePackageRequest $request, Package $package)
    {
        $package->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'features' => $request->features,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('packages.index')->with('success', 'Package updated successfully.');
    }

    public function destroy(Package $package)
    {
        $package->delete();

        return redirect()->route('packages.index')->with('success', 'Package deleted successfully.');
    }
}
