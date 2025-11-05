<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Services\FeatureService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }

    /**
     * Menampilkan daftar produk milik pengguna.
     */
    public function index(): Response
    {
        $products = auth()->user()->products()->with('product_category')->latest()->paginate(5);

        return Inertia::render('dashboard/user/product/index', [
            'products' => $products,
        ]);
    }

    /**
     * Menampilkan form untuk membuat produk baru.
     */
    public function create(): Response
    {
        $user = auth()->user();

        // Products tidak punya limit, tapi bisa ditambahkan kalau perlu
        // Untuk saat ini, semua user bisa create unlimited products
        
        return Inertia::render('dashboard/user/product/create', [
            'categories' => ProductCategory::whereNull('user_id')->orWhere('user_id', auth()->id())->get(['id', 'name']),
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
        ]);

        auth()->user()->products()->create($validated);

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit produk.
     */
    public function edit(Product $product): Response
    {
        Gate::authorize('update', $product);

        return Inertia::render('dashboard/user/product/edit', [
            'product' => $product,
            'categories' => ProductCategory::whereNull('user_id')->orWhere('user_id', auth()->id())->get(['id', 'name']),
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
        ]);

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Menghapus produk dari database.
     */
    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus.');
    }
}
