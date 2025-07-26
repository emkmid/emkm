<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar produk milik pengguna.
     */
    public function index(): Response
    {
        $products = auth()->user()->products()->with('product_category')->latest()->paginate(10);

        return Inertia::render('Dashboard/User/Product/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Menampilkan form untuk membuat produk baru.
     */
    public function create(): Response
    {
        return Inertia::render('Dashboard/User/Product/Create', [
            'categories' => auth()->user()->productCategories()->get(['id', 'name']),
        ]);
    }

    /**
     * Menyimpan produk baru ke dalam database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        auth()->user()->products()->create($validated);

        return redirect()->route('product.index')->with('success', 'Product created successfully.');
    }

    /**
     * Menampilkan form untuk mengedit produk.
     */
    public function edit(Product $product): Response
    {
        Gate::authorize('update', $product);

        return Inertia::render('Dashboard/User/Product/Edit', [
            'product' => $product,
            'categories' => auth()->user()->productCategories()->get(['id', 'name']),
        ]);
    }

    /**
     * Memperbarui data produk di database.
     */
    public function update(Request $request, Product $product)
    {
        Gate::authorize('update', $product);

        $validated = $request->validate([
            'product_category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product->update($validated);

        return redirect()->route('product.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Menghapus produk dari database.
     */
    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);

        $product->delete();

        return redirect()->route('product.index')->with('success', 'Product deleted successfully.');
    }
}
