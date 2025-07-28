<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\IncomeCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class IncomeController extends Controller
{
    /**
     * Menampilkan daftar pemasukan milik pengguna.
     */
    public function index(): Response
    {
        // Ambil data pemasukan milik pengguna yang sedang login
        // beserta relasi kategori, urutkan dari yang terbaru, dan paginasi.
        $incomes = auth()->user()->incomes()->with('income_category')->latest()->paginate(10);

        // Render halaman Inertia dengan data pemasukan
        return Inertia::render('dashboard/user/income/index', [
            'incomes' => $incomes,
        ]);
    }

    /**
     * Menampilkan form untuk membuat pemasukan baru.
     */
    public function create(): Response
    {
        // Render halaman Inertia dengan data kategori pemasukan milik pengguna
        return Inertia::render('dashboard/user/income/create', [
            'categories' => auth()->user()->incomeCategories()->get(['id', 'name']),
        ]);
    }

    /**
     * Menyimpan pemasukan baru ke dalam database.
     */
    public function store(Request $request)
    {
        // Validasi data yang diinput dari form
        $validated = $request->validate([
            'income_category_id' => 'required|exists:income_categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);

        // Buat data pemasukan baru yang berelasi dengan pengguna
        auth()->user()->incomes()->create($validated);

        // Redirect ke halaman index dengan pesan sukses
        return redirect()->route('income.index')->with('success', 'Income created successfully.');
    }

    /**
     * Menampilkan form untuk mengedit pemasukan.
     */
    public function edit(Income $income): Response
    {
        // Otorisasi: pastikan pengguna yang login berhak mengedit pemasukan ini
        Gate::authorize('update', $income);

        // Render halaman Inertia dengan data pemasukan dan kategori
        return Inertia::render('dashboard/user/income/edit', [
            'income' => $income,
            'categories' => auth()->user()->incomeCategories()->get(['id', 'name']),
        ]);
    }

    /**
     * Memperbarui data pemasukan di database.
     */
    public function update(Request $request, Income $income)
    {
        // Otorisasi: pastikan pengguna yang login berhak memperbarui pemasukan ini
        Gate::authorize('update', $income);

        // Validasi data yang diinput dari form
        $validated = $request->validate([
            'income_category_id' => 'required|exists:income_categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);

        // Perbarui data pemasukan
        $income->update($validated);

        // Redirect ke halaman index dengan pesan sukses
        return redirect()->route('income.index')->with('success', 'Income updated successfully.');
    }

    /**
     * Menghapus data pemasukan dari database.
     */
    public function destroy(Income $income)
    {
        // Otorisasi: pastikan pengguna yang login berhak menghapus pemasukan ini
        Gate::authorize('delete', $income);

        // Hapus data pemasukan
        $income->delete();

        // Redirect ke halaman index dengan pesan sukses
        return redirect()->route('income.index')->with('success', 'Income deleted successfully.');
    }
}
