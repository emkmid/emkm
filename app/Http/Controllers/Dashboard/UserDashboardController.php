<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ChartOfAccount;
use App\Models\Debt;
use App\Models\JournalEntry;
use App\Models\Product;
use App\Models\Receivable;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $today = Carbon::today();

        // 1) Summary KPI
        // cash: sum journal_entries for accounts type 'aset' (cash-like) — simple approach
        $cashAccountIds = ChartOfAccount::where('type', 'aset')
            ->whereHas('journalEntries.journal', fn($q) => $q->where('user_id', $userId))
            ->pluck('id');

        $cash = JournalEntry::whereIn('account_id', $cashAccountIds)
            ->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
            ->where('journals.user_id', $userId)
            ->selectRaw("COALESCE(SUM(CASE WHEN journal_entries.type='debit' THEN journal_entries.amount ELSE -journal_entries.amount END),0) as balance")
            ->value('balance') ?? 0;

        // income & expense for current month
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $income = JournalEntry::whereHas('journal', fn($q) => $q->where('user_id', $userId))
            ->whereHas('account', fn($q) => $q->where('type', 'pendapatan'))
            ->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
            ->whereBetween('journals.date', [$startOfMonth, $endOfMonth])
            ->sum('journal_entries.amount');

        $expense = JournalEntry::whereHas('journal', fn($q) => $q->where('user_id', $userId))
            ->whereHas('account', fn($q) => $q->where('type', 'biaya'))
            ->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
            ->whereBetween('journals.date', [$startOfMonth, $endOfMonth])
            ->sum('journal_entries.amount');

        $profit = $income - $expense;

        // 2) Trends last 6 months (group by Y-m)
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth()->toDateString();
        $trendsRaw = JournalEntry::join('journals', 'journals.id', '=', 'journal_entries.journal_id')
            ->join('chart_of_accounts as coa', 'coa.id', '=', 'journal_entries.account_id')
            ->where('journals.user_id', $userId)
            ->whereBetween('journals.date', [$sixMonthsAgo, Carbon::now()->endOfMonth()->toDateString()])
            ->whereIn('coa.type', ['pendapatan', 'biaya'])
            ->select('journals.date', 'coa.type', DB::raw('SUM(journal_entries.amount) as total'))
            ->groupBy('journals.date', 'coa.type')
            ->orderBy('journals.date')
            ->get()
            ->groupBy(function ($row) {
                return Carbon::parse($row->date)->format('Y-m');
            })
            ->map(function ($rows, $month) {
                return [
                    'month' => $month,
                    'income' => $rows->where('type', 'pendapatan')->sum('total'),
                    'expense' => $rows->where('type', 'biaya')->sum('total'),
                ];
            })
            ->values();

        // ensure months with zero exist (fill last 6 months)
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $m = Carbon::now()->subMonths($i)->format('Y-m');
            $months->push($m);
        }
        $trends = $months->map(function ($m) use ($trendsRaw) {
            $found = $trendsRaw->firstWhere('month', $m);
            return $found ?? ['month' => $m, 'income' => 0, 'expense' => 0];
        });

        // 3) Expense categories (sum)
        $expenseCategories = JournalEntry::join('journals', 'journals.id', '=', 'journal_entries.journal_id')
            ->join('chart_of_accounts as coa', 'coa.id', '=', 'journal_entries.account_id')
            ->where('journals.user_id', $userId)
            ->where('coa.type', 'biaya')
            ->select('coa.name as name', DB::raw('SUM(journal_entries.amount) as value'))
            ->groupBy('coa.name')
            ->orderByDesc('value')
            ->limit(8)
            ->get();

        // 4) Recent transactions (join to journal)
        $recentTransactions = JournalEntry::join('journals', 'journals.id', '=', 'journal_entries.journal_id')
            ->join('chart_of_accounts as coa', 'coa.id', '=', 'journal_entries.account_id')
            ->where('journals.user_id', $userId)
            ->select('journal_entries.id','journals.date','journals.description as journal_description','coa.name as account_name','journal_entries.type','journal_entries.amount')
            ->orderBy('journals.date', 'desc')
            ->limit(10)
            ->get();

        // 5) Overdue receivables (due_date < today and unpaid)
        $overdueReceivables = Receivable::where('user_id', $userId)
            ->whereColumn('paid_amount', '<', 'amount')
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', $today)
            ->orderBy('due_date')
            ->limit(5)
            ->get();

        // 6) Upcoming debts (due within 30 days)
        $upcomingDebts = Debt::where('user_id', $userId)
            ->whereColumn('paid_amount', '<', 'amount')
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [$today, $today->copy()->addDays(30)])
            ->orderBy('due_date')
            ->limit(5)
            ->get();

        // 7) Low stock products (threshold 5)
        $lowStockProducts = Product::where('user_id', $userId)
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard/user/index', [
            'summary' => [
                'cash' => (float) $cash,
                'income' => (float) $income,
                'expense' => (float) $expense,
                'profit' => (float) $profit,
            ],
            'incomeExpenseTrends' => $trends,
            'expenseCategories' => $expenseCategories,
            'recentTransactions' => $recentTransactions,
            'overdueReceivables' => $overdueReceivables,
            'upcomingDebts' => $upcomingDebts,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
