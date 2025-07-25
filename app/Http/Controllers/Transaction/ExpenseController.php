<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expenses = Auth::user()->expenses()->with('expenseCategory')->get();
        return Inertia::render('dashboard/user/expense/index', compact('expenses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = ExpenseCategory::whereNull('user_id')
            ->orWhere('user_id', auth()->id())
            ->get();

        return Inertia::render('dashboard/user/expense/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'description' => 'nullable|string|max:255',
            'amount' => 'required|integer|min:0',
            'date' => 'required|date',
        ]);

        Auth::user()->expenses()->create($validated);

        return redirect()->route('expenses.index')->with('success', 'Pengeluaran berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        Gate::authorize('update', $expense);

        $categories = ExpenseCategory::whereNull('user_id')
            ->orWhere('user_id', auth()->id())
            ->get();

        return Inertia::render('dashboard/user/expense/edit', [
            'categories' => $categories,
            'expense' => $expense
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        Gate::authorize('update', $expense);

        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'description' => 'nullable|string|max:255',
            'amount' => 'required|integer|min:0',
            'date' => 'required|date',
        ]);

        $expense->update($validated);

        return redirect()
            ->route('expenses.index')
            ->with('success', 'Data pengeluaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        Gate::authorize('destroy', $expense);

        $expense->delete();
        return redirect()
            ->route('expenses.index')
            ->with('success', 'Pengeluaran berhasil dihapus.');
    }
}
