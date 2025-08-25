<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\ChartOfAccount;
use App\Models\Income;
use App\Models\IncomeCategory;
use App\Services\JournalService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Gate;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $incomes = Auth::user()->incomes()->with('income_category')->latest()->paginate(5);

        return Inertia::render('dashboard/user/income/index', [
            'incomes' => $incomes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categories = IncomeCategory::whereNull('user_id')
            ->orWhere('user_id', auth()->id())
            ->get();

        return Inertia::render('dashboard/user/income/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'income_category_id' => 'required|exists:income_categories,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $income = Auth::user()->incomes()->create($validated);

        $category = IncomeCategory::with('account')->findOrFail($validated['income_category_id']);
        $pendapatanAccount = $category->account;
        $kasAccount        = ChartOfAccount::where('code', '101')->firstOrFail();

        JournalService::add(
            Auth::id(),
            $request->date,
            'Pemasukan: ' . ($request->description ?? $category->name),
            [
                ['account_id' => $kasAccount->id,        'type' => 'debit',  'amount' => $request->amount],
                ['account_id' => $pendapatanAccount->id, 'type' => 'credit', 'amount' => $request->amount],
            ],
            $income->id,
            'income'
        );

        return redirect()->route('incomes.index')->with('success', 'Pemasukan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Income $income)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Income $income): Response
    {
        Gate::authorize('update', $income);

        $categories = IncomeCategory::whereNull('user_id')
            ->orWhere('user_id', auth()->id())
            ->get();

        return Inertia::render('dashboard/user/income/edit', [
            'income' => $income,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Income $income): RedirectResponse
    {
        Gate::authorize('update', $income);

        $validated = $request->validate([
            'date'               => 'required|date',
            'income_category_id' => 'required|exists:income_categories,id',
            'amount'             => 'required|numeric|min:0',
            'description'        => 'nullable|string',
        ]);

        $oldAmount   = $income->amount;
        $oldCategory = $income->income_category;
        $oldAccount  = $oldCategory->account;

        $income->update($validated);

        $newCategory = IncomeCategory::with('account')->findOrFail($validated['income_category_id']);
        $newAccount  = $newCategory->account;
        $kasAccount  = ChartOfAccount::where('code', '101')->firstOrFail();

        // 🔄 Jurnal Pembalik
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Pembalik income lama: ' . ($income->description ?? $oldCategory->name),
            [
                ['account_id' => $oldAccount->id, 'type' => 'debit',  'amount' => $oldAmount],
                ['account_id' => $kasAccount->id, 'type' => 'credit', 'amount' => $oldAmount],
            ],
            $income->id,
            'income'
        );

        // 🆕 Jurnal Baru
        JournalService::add(
            Auth::id(),
            $request->date,
            'Perubahan income: ' . ($request->description ?? $newCategory->name),
            [
                ['account_id' => $kasAccount->id, 'type' => 'debit',  'amount' => $request->amount],
                ['account_id' => $newAccount->id, 'type' => 'credit', 'amount' => $request->amount],
            ],
            $income->id,
            'income'
        );

        return redirect()->route('incomes.index')->with('success', 'Pemasukan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Income $income): RedirectResponse
    {
        Gate::authorize('destroy', $income);

        $category          = $income->income_category;
        $pendapatanAccount = $category->account;
        $kasAccount        = ChartOfAccount::where('code', '101')->firstOrFail();

        // 🔄 Jurnal Pembalik (hapus income = reverse full)
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Hapus income: ' . ($income->description ?? $category->name),
            [
                ['account_id' => $pendapatanAccount->id, 'type' => 'debit',  'amount' => $income->amount],
                ['account_id' => $kasAccount->id,        'type' => 'credit', 'amount' => $income->amount],
            ],
            $income->id,
            'income'
        );

        $income->delete();

        return redirect()->route('incomes.index')->with('success', 'Pemasukan berhasil dihapus.');
    }
}
