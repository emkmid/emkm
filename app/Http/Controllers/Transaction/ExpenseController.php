<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\ChartOfAccount;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Services\FeatureService;
use App\Services\JournalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Check if user has access to transaction feature
        if (!$this->featureService->hasAccess($user, 'accounting.transactions')) {
            return redirect()->route('dashboard')->with('error', 'Upgrade untuk mengakses fitur transaksi.');
        }

        // Eager load relationships to prevent N+1 queries
        $expenses = Auth::user()->expenses()
            ->with(['expense_category:id,name,user_id'])
            ->select(['id', 'user_id', 'expense_category_id', 'description', 'amount', 'date', 'created_at'])
            ->latest()
            ->paginate(5);

        return Inertia::render('dashboard/user/expense/index', compact('expenses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();

        // Check transaction limit for current month
        $currentMonth = now()->startOfMonth();
        $transactionCount = $user->expenses()
            ->where('date', '>=', $currentMonth)
            ->count() + $user->incomes()
            ->where('date', '>=', $currentMonth)
            ->count();

        if ($this->featureService->hasReachedLimit($user, 'accounting.max_transactions', $transactionCount)) {
            $limit = $this->featureService->getLimit($user, 'accounting.max_transactions');
            
            return redirect()
                ->route('expenses.index')
                ->with('error', "Anda telah mencapai batas {$limit} transaksi bulan ini. Upgrade ke Pro untuk unlimited transaksi.");
        }

        $categories = ExpenseCategory::whereNull('user_id')
            ->orWhere('user_id', auth()->id())
            ->get();

        $limit = $this->featureService->getLimit($user, 'accounting.max_transactions');

        return Inertia::render('dashboard/user/expense/create', [
            'categories' => $categories,
            'quota' => [
                'current' => $transactionCount,
                'limit' => $limit,
                'remaining' => $this->featureService->getRemainingQuota($user, 'accounting.max_transactions', $transactionCount),
                'is_unlimited' => $limit === -1,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check transaction limit again
        $currentMonth = now()->startOfMonth();
        $transactionCount = $user->expenses()
            ->where('date', '>=', $currentMonth)
            ->count() + $user->incomes()
            ->where('date', '>=', $currentMonth)
            ->count();

        if ($this->featureService->hasReachedLimit($user, 'accounting.max_transactions', $transactionCount)) {
            return redirect()
                ->back()
                ->with('error', 'Limit transaksi tercapai. Upgrade untuk membuat lebih banyak transaksi.');
        }

        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'description' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $expense = $user->expenses()->create($validated);

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
