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
        $period = $request->get('period', 'current_month');

        // Calculate date range based on period
        switch ($period) {
            case 'current_month':
                $startDate = Carbon::now()->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                $trendsMonths = 6; // last 6 months
                break;
            case 'last_month':
                $startDate = Carbon::now()->subMonth()->startOfMonth();
                $endDate = Carbon::now()->subMonth()->endOfMonth();
                $trendsMonths = 6;
                break;
            case 'last_3_months':
                $startDate = Carbon::now()->subMonths(2)->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                $trendsMonths = 3;
                break;
            case 'last_6_months':
                $startDate = Carbon::now()->subMonths(5)->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                $trendsMonths = 6;
                break;
            case 'current_year':
                $startDate = Carbon::now()->startOfYear();
                $endDate = Carbon::now()->endOfYear();
                $trendsMonths = 12; // last 12 months
                break;
            default:
                $startDate = Carbon::now()->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                $trendsMonths = 6;
        }

        $startOfPeriod = $startDate->toDateString();
        $endOfPeriod = $endDate->toDateString();

        $income = JournalEntry::whereHas('journal', fn($q) => $q->where('user_id', $userId))
            ->whereHas('account', fn($q) => $q->where('type', 'pendapatan'))
            ->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
            ->whereBetween('journals.date', [$startOfPeriod, $endOfPeriod])
            ->sum('journal_entries.amount');

        $expense = JournalEntry::whereHas('journal', fn($q) => $q->where('user_id', $userId))
            ->whereHas('account', fn($q) => $q->where('type', 'biaya'))
            ->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
            ->whereBetween('journals.date', [$startOfPeriod, $endOfPeriod])
            ->sum('journal_entries.amount');

        $profit = $income - $expense;

        // 2) Trends last N months (group by Y-m)
        $trendsStart = Carbon::now()->subMonths($trendsMonths - 1)->startOfMonth()->toDateString();
        $trendsRaw = JournalEntry::join('journals', 'journals.id', '=', 'journal_entries.journal_id')
            ->join('chart_of_accounts as coa', 'coa.id', '=', 'journal_entries.account_id')
            ->where('journals.user_id', $userId)
            ->whereBetween('journals.date', [$trendsStart, Carbon::now()->endOfMonth()->toDateString()])
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

        // ensure months with zero exist (fill last N months)
        $months = collect();
        for ($i = $trendsMonths - 1; $i >= 0; $i--) {
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
