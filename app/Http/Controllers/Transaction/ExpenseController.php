<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\ChartOfAccount;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Services\JournalService;
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
        $expenses = Auth::user()->expenses()->with('expense_category')->latest()->paginate(5);
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
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $expense = Auth::user()->expenses()->create($validated);

        $category = ExpenseCategory::with('account')->findOrFail($validated['expense_category_id']);
        $biayaAccount = $category->account; 
        $kasAccount   = ChartOfAccount::where('code', '101')->firstOrFail(); // Kas

        JournalService::add(
            Auth::id(),
            $request->date,
            'Pengeluaran: ' . ($request->description ?? $category->name),
            [
                ['account_id' => $biayaAccount->id, 'type' => 'debit',  'amount' => $request->amount],
                ['account_id' => $kasAccount->id,   'type' => 'credit', 'amount' => $request->amount],
            ],
            $expense->id,
            'expense'
        );

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
            'description'         => 'nullable|string|max:255',
            'amount'              => 'required|numeric|min:0',
            'date'                => 'required|date',
        ]);

        $oldAmount   = $expense->amount;
        $oldCategory = $expense->expense_category;
        $oldAccount  = $oldCategory->account;

        $expense->update($validated);

        $newCategory = ExpenseCategory::with('account')->findOrFail($validated['expense_category_id']);
        $newAccount  = $newCategory->account;
        $kasAccount  = ChartOfAccount::where('code', '101')->firstOrFail(); // Kas

        // 🔄 Jurnal Pembalik (reverse entry lama)
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Pembalik expense lama: ' . ($expense->description ?? $oldCategory->name),
            [
                ['account_id' => $kasAccount->id, 'type' => 'debit',  'amount' => $oldAmount],
                ['account_id' => $oldAccount->id, 'type' => 'credit', 'amount' => $oldAmount],
            ],
            $expense->id,
            'expense'
        );

        // 🆕 Jurnal Baru
        JournalService::add(
            Auth::id(),
            $request->date,
            'Perubahan expense: ' . ($request->description ?? $newCategory->name),
            [
                ['account_id' => $newAccount->id, 'type' => 'debit',  'amount' => $request->amount],
                ['account_id' => $kasAccount->id, 'type' => 'credit', 'amount' => $request->amount],
            ],
            $expense->id,
            'expense'
        );

        return redirect()->route('expenses.index')->with('success', 'Pengeluaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        Gate::authorize('destroy', $expense);

        $category   = $expense->category;
        $biayaAccount = $category->account;
        $kasAccount   = ChartOfAccount::where('code', '101')->firstOrFail();

        // 🔄 Jurnal Pembalik (hapus expense = reverse full)
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Hapus expense: ' . ($expense->description ?? $category->name),
            [
                ['account_id' => $kasAccount->id,   'type' => 'debit',  'amount' => $expense->amount],
                ['account_id' => $biayaAccount->id, 'type' => 'credit', 'amount' => $expense->amount],
            ],
            $expense->id,
            'expense'
        );

        $expense->delete();

        return redirect()->route('expenses.index')->with('success', 'Pengeluaran berhasil dihapus.');
    }
}
