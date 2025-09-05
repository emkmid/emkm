<?php

namespace App\Http\Controllers;

use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
use App\Services\AccountingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AccountingReportController extends Controller
{
    public function ledger(Request $request)
    {
        $start = $request->query('start_date');
        $end = $request->query('end_date');
        $sortField = $request->query('sortField', 'date');
        $sortOrder = $request->query('sortOrder', 'asc');

        $accounts = ChartOfAccount::whereHas('journalEntries.journal', function ($q) {
            $q->where('user_id', Auth::user()->id);
        })
            ->with([
                'journalEntries' => function ($q) use ($start, $end) {
                    $q
                        ->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
                        ->select('journal_entries.*', 'journals.date', 'journals.description as journal_description')
                        ->when($start && $end, fn($q) => $q->whereBetween('journals.date', [$start, $end]))
                        ->where('journals.user_id', Auth::user()->id);
                },
            ])
            ->when($request->filled('account_id'), fn($q) => $q->where('id', $request->account_id)) // filter account_id
            ->orderBy('code') // taruh di sini
            ->get()
            ->map(function ($account) use ($sortField, $sortOrder) {
                $entries = $account->journalEntries->map(function ($e) {
                    return [
                        'id' => $e->id,
                        'date' => $e->date ?? $e->created_at->toDateString(),
                        'description' => $e->journal_description ?? ($e->journal->description ?? ''),
                        'type' => $e->type,
                        'amount' => (float) $e->amount,
                    ];
                });

                // sort entries
                $entries = $entries
                    ->sortBy(
                        function ($it) use ($sortField) {
                            return $it[$sortField] ?? $it['date'];
                        },
                        SORT_REGULAR,
                        $sortOrder === 'desc'
                    )
                    ->values();

                $debit = $account->journalEntries->where('type', 'debit')->sum('amount');
                $credit = $account->journalEntries->where('type', 'credit')->sum('amount');
                $balance = AccountingService::endingBalance($account->type, (float) $debit, (float) $credit);

                return [
                    'id' => $account->id,
                    'code' => $account->code,
                    'name' => $account->name,
                    'type' => $account->type,
                    'debit' => (float) $debit,
                    'credit' => (float) $credit,
                    'balance' => (float) $balance,
                    'entries' => $entries,
                ];
            });

        return Inertia::render('dashboard/user/reports/ledger', [
            'accounts' => $accounts,
            'filters' => [
                'start_date' => $start,
                'end_date' => $end,
                'sortField' => $sortField,
                'sortOrder' => $sortOrder,
            ],
        ]);
    }

    public function trialBalance(Request $request)
    {
        $start = $request->query('start_date');
        $end   = $request->query('end_date');

        $accounts = ChartOfAccount::whereHas('journalEntries.journal', function ($q) {
                $q->where('user_id', Auth::id());
            })
            ->with(['journalEntries' => function ($q) use ($start, $end) {
                $q->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
                  ->select('journal_entries.*', 'journals.date')
                  ->when($start && $end, fn($q) => $q->whereBetween('journals.date', [$start, $end]))
                  ->where('journals.user_id', Auth::id());
            }])
            ->orderBy('code')
            ->get()
            ->map(function ($account) {
                $debit  = $account->journalEntries->where('type', 'debit')->sum('amount');
                $credit = $account->journalEntries->where('type', 'credit')->sum('amount');
                $balance = AccountingService::endingBalance($account->type, (float) $debit, (float) $credit);

                return [
                    'id' => $account->id,
                    'code' => $account->code,
                    'name' => $account->name,
                    'type' => $account->type,
                    'debit' => (float) $debit,
                    'credit' => (float) $credit,
                    'balance' => (float) $balance,
                ];
            });

        return Inertia::render('dashboard/user/reports/trial-balance', [
            'accounts' => $accounts,
            'filters' => [
                'start_date' => $start,
                'end_date'   => $end,
            ],
        ]);
    }

    public function incomeStatement(Request $request)
    {
        $start = $request->query('start_date');
        $end   = $request->query('end_date');

        $accounts = ChartOfAccount::whereIn('type', ['pendapatan', 'biaya'])
            ->whereHas('journalEntries.journal', fn($q) => $q->where('user_id', Auth::id()))
            ->with(['journalEntries' => function ($q) use ($start, $end) {
                $q->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
                ->select('journal_entries.*', 'journals.date')
                ->when($start && $end, fn($q) => $q->whereBetween('journals.date', [$start, $end]))
                ->where('journals.user_id', Auth::id());
            }])
            ->orderBy('code')
            ->get()
            ->map(function ($account) {
                $debit  = $account->journalEntries->where('type', 'debit')->sum('amount');
                $credit = $account->journalEntries->where('type', 'credit')->sum('amount');
                $balance = AccountingService::endingBalance($account->type, $debit, $credit);

                return [
                    'code' => $account->code,
                    'name' => $account->name,
                    'type' => $account->type,
                    'balance' => $balance,
                ];
            });

        $income = $accounts->where('type', 'pendapatan')->sum('balance');
        $expense = $accounts->where('type', 'biaya')->sum('balance');
        $net = $income - $expense;

        return Inertia::render('dashboard/user/reports/income-statement', [
            'accounts' => $accounts,
            'totals' => [
                'income' => $income,
                'expense' => $expense,
                'net' => $net,
            ],
            'filters' => [
                'start_date' => $start,
                'end_date' => $end,
            ],
        ]);
    }

    public function balanceSheet(Request $request)
    {
        $start = $request->query('start_date');
        $end   = $request->query('end_date');

        $accounts = ChartOfAccount::whereIn('type', ['aset', 'liabilitas', 'ekuitas'])
            ->whereHas('journalEntries.journal', fn($q) => $q->where('user_id', Auth::id()))
            ->with(['journalEntries' => function ($q) use ($start, $end) {
                $q->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
                ->select('journal_entries.*', 'journals.date')
                ->when($start && $end, fn($q) => $q->whereBetween('journals.date', [$start, $end]))
                ->where('journals.user_id', Auth::id());
            }])
            ->orderBy('code')
            ->get()
            ->map(function ($account) {
                $debit  = $account->journalEntries->where('type', 'debit')->sum('amount');
                $credit = $account->journalEntries->where('type', 'credit')->sum('amount');
                $balance = AccountingService::endingBalance($account->type, (float) $debit, (float) $credit);

                return [
                    'code'    => $account->code,
                    'name'    => $account->name,
                    'type'    => $account->type,
                    'balance' => $balance,
                ];
            });

        // Hitung total per kelompok
        $totals = [
            'assets'      => $accounts->where('type', 'aset')->sum('balance'),
            'liabilities' => $accounts->where('type', 'liabilitas')->sum('balance'),
            'equity'      => $accounts->where('type', 'ekuitas')->sum('balance'),
        ];

        return Inertia::render('dashboard/user/reports/balance-sheet', [
            'accounts' => $accounts,
            'totals'   => $totals,
            'filters'  => [
                'start_date' => $start,
                'end_date'   => $end,
            ],
        ]);
    }


    // public function balanceSheet(Request $request)
    // {
    //     $to = $request->query('to');

    //     $query = JournalEntry::query()
    //         ->join('journals', 'journals.id', '=', 'journal_entries.journal_id')
    //         ->join('chart_of_accounts as coa', 'coa.id', '=', 'journal_entries.account_id')
    //         ->when($to, fn($q) => $q->whereDate('journals.date', '<=', $to))
    //         ->select([
    //             'coa.type',
    //             'coa.code',
    //             'coa.name',
    //             DB::raw("SUM(CASE WHEN journal_entries.type='debit'  THEN journal_entries.amount ELSE 0 END) AS sum_debit"),
    //             DB::raw("SUM(CASE WHEN journal_entries.type='credit' THEN journal_entries.amount ELSE 0 END) AS sum_credit"),
    //         ])
    //         ->groupBy('coa.type', 'coa.code', 'coa.name')
    //         ->orderBy('coa.code');

    //     $rows = $query->get()->map(function ($r) {
    //         $r->balance = AccountingService::endingBalance($r->type, (float) $r->sum_debit, (float) $r->sum_credit);
    //         return $r;
    //     });

    //     $assets = $rows->where('type', 'aset')->values();
    //     $liabs = $rows->where('type', 'liabilitas')->values();
    //     $equity = $rows->where('type', 'ekuitas')->values();

    //     $totalAssets = $assets->sum('balance');
    //     $totalLiabs = $liabs->sum('balance');
    //     $totalEquity = $equity->sum('balance');
    //     $check = $totalAssets - ($totalLiabs + $totalEquity);

    //     return Inertia::render('Reports/BalanceSheet', [
    //         'to' => $to,
    //         'assets' => $assets,
    //         'liabilities' => $liabs,
    //         'equity' => $equity,
    //         'totals' => [
    //             'assets' => (float) $totalAssets,
    //             'liabilities' => (float) $totalLiabs,
    //             'equity' => (float) $totalEquity,
    //             'balanceCheck' => (float) $check,
    //         ],
    //     ]);
    // }
}
