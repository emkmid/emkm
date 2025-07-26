<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Debt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DebtController extends Controller
{
    /**
     * Menampilkan daftar hutang/piutang milik pengguna.
     */
    public function index(): Response
    {
        $debts = auth()->user()->debts()->latest()->paginate(10);

        return Inertia::render('Dashboard/User/Debt/Index', [
            'debts' => $debts,
        ]);
    }

    /**
     * Menampilkan form untuk membuat data hutang/piutang baru.
     */
    public function create(): Response
    {
        return Inertia::render('Dashboard/User/Debt/Create');
    }

    /**
     * Menyimpan data hutang/piutang baru ke dalam database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:receivable,payable', // receivable = piutang, payable = hutang
            'amount' => 'required|numeric|min:0',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
            'is_paid' => 'sometimes|boolean',
        ]);

        auth()->user()->debts()->create($validated);

        return redirect()->route('debt.index')->with('success', 'Debt record created successfully.');
    }

    /**
     * Menampilkan form untuk mengedit data hutang/piutang.
     */
    public function edit(Debt $debt): Response
    {
        Gate::authorize('update', $debt);

        return Inertia::render('Dashboard/User/Debt/Edit', [
            'debt' => $debt,
        ]);
    }

    /**
     * Memperbarui data hutang/piutang di database.
     */
    public function update(Request $request, Debt $debt)
    {
        Gate::authorize('update', $debt);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:receivable,payable',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
            'is_paid' => 'sometimes|boolean',
        ]);

        $debt->update($validated);

        return redirect()->route('debt.index')->with('success', 'Debt record updated successfully.');
    }

    /**
     * Menghapus data hutang/piutang dari database.
     */
    public function destroy(Debt $debt)
    {
        Gate::authorize('delete', $debt);

        $debt->delete();

        return redirect()->route('debt.index')->with('success', 'Debt record deleted successfully.');
    }
}
