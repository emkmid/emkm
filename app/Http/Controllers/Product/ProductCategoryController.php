<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    public function index()
    {
        $categories = auth()->user()->productCategories()->latest()->paginate(10);
        return Inertia::render('dashboard/user/product/category/index', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        auth()->user()->productCategories()->create($validated);
        return redirect()->route('product-category.index')->with('success', 'Category created.');
    }

    public function update(Request $request, ProductCategory $productCategory)
    {
        Gate::authorize('update', $productCategory);
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $productCategory->update($validated);
        return redirect()->route('product-category.index')->with('success', 'Category updated.');
    }

    public function destroy(ProductCategory $productCategory)
    {
        Gate::authorize('delete', $productCategory);
        $productCategory->delete();
        return redirect()->route('product-category.index')->with('success', 'Category deleted.');
    }
}
