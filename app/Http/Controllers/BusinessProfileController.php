<?php

namespace App\Http\Controllers;

use App\Models\BusinessProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BusinessProfileController extends Controller
{
    public function index()
    {
        $profile = Auth::user()->businessProfile;

        return Inertia::render('business-profile/index', [
            'profile' => $profile,
        ]);
    }

    public function create()
    {
        // Redirect if profile already exists
        if (Auth::user()->businessProfile) {
            return redirect()->route('business-profile.edit');
        }

        return Inertia::render('business-profile/create');
    }

    public function store(Request $request)
    {
        // Check if profile already exists
        if (Auth::user()->businessProfile) {
            return redirect()->route('business-profile.edit')
                ->with('error', 'Business profile already exists. Please edit instead.');
        }

        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'owner_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'tax_number' => 'nullable|string|max:100',
            'business_type' => 'nullable|string|max:100',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('business-logos', 'public');
            $validated['logo_path'] = $logoPath;
        }

        $validated['user_id'] = Auth::id();

        BusinessProfile::create($validated);

        return redirect()->route('business-profile.index')
            ->with('success', 'Business profile created successfully!');
    }

    public function edit()
    {
        $profile = Auth::user()->businessProfile;

        if (!$profile) {
            return redirect()->route('business-profile.create')
                ->with('error', 'Please create a business profile first.');
        }

        return Inertia::render('business-profile/edit', [
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $profile = Auth::user()->businessProfile;

        if (!$profile) {
            return redirect()->route('business-profile.create')
                ->with('error', 'Please create a business profile first.');
        }

        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'owner_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'tax_number' => 'nullable|string|max:100',
            'business_type' => 'nullable|string|max:100',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($profile->logo_path) {
                Storage::disk('public')->delete($profile->logo_path);
            }

            $logoPath = $request->file('logo')->store('business-logos', 'public');
            $validated['logo_path'] = $logoPath;
        }

        $profile->update($validated);

        return redirect()->route('business-profile.index')
            ->with('success', 'Business profile updated successfully!');
    }

    public function destroy()
    {
        $profile = Auth::user()->businessProfile;

        if (!$profile) {
            return redirect()->route('business-profile.index')
                ->with('error', 'No business profile found.');
        }

        // Delete logo if exists
        if ($profile->logo_path) {
            Storage::disk('public')->delete($profile->logo_path);
        }

        $profile->delete();

        return redirect()->route('business-profile.create')
            ->with('success', 'Business profile deleted successfully.');
    }
}
