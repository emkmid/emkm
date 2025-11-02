<?php

namespace Database\Seeders;

use App\Models\ChartOfAccount;
use App\Models\Debt;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Journal;
use App\Models\JournalEntry;
use App\Models\Receivable;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostingSeeder extends Seeder
{
    /**
     * Create simple journal postings from existing transactions for a single user.
     * - Income: Debit Kas (101) / Credit income account (income_category.account_id)
     * - Expense: Debit expense account (expense_category.account_id) / Credit Kas (101)
     * - Receivable (sales on account): Debit Piutang (103) / Credit Pendapatan Penjualan (401)
     *   If paid_amount > 0 -> create cash receipt: Debit Kas (101) / Credit Piutang (103)
     * - Debt (purchases on credit): Debit Biaya Operasional (501) / Credit Utang Usaha (201)
     *   If paid_amount > 0 -> create payment: Debit Utang Usaha (201) / Credit Kas (101)
     *
     * This is a pragmatic, simplified posting logic for analysis and demo purposes.
     */
    public function run(): void
    {
        // target only user id 3
        $user = User::find(3);
        if (!$user) {
            $this->command->info('User id 3 not found, skipping PostingSeeder.');
            return;
        }

        DB::transaction(function () use ($user) {
            $cash = ChartOfAccount::where('code', '101')->first();
            $piutang = ChartOfAccount::where('code', '103')->first();
            $utang = ChartOfAccount::where('code', '201')->first();
            $pendapatanPenjualan = ChartOfAccount::where('code', '401')->first();
            $biayaOperasional = ChartOfAccount::where('code', '501')->first();

            if (!$cash || !$piutang || !$utang || !$pendapatanPenjualan || !$biayaOperasional) {
                $this->command->warn('Salah satu akun COA (101/103/201/401/501) tidak ditemukan. Pastikan ChartOfAccount sudah di-seed.');
                return;
            }

            // -- INCOMES (assume cash receipts)
            Income::where('user_id', $user->id)->get()->each(function (Income $inc) use ($user, $cash) {
                $description = 'Pendapatan: ' . ($inc->description ?? 'Penjualan');
                $journal = Journal::create([ 'user_id' => $user->id, 'date' => $inc->date ?? Carbon::now(), 'description' => $description ]);

                // Debit Kas
                JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $cash->id, 'type' => 'debit', 'amount' => $inc->amount]);

                // Credit Pendapatan (use linked income category account)
                $incomeAccountId = optional($inc->income_category)->account_id ?? null;
                if ($incomeAccountId) {
                    JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $incomeAccountId, 'type' => 'credit', 'amount' => $inc->amount]);
                } else {
                    // fallback to Pendapatan Penjualan (401)
                    $fallback = ChartOfAccount::where('code', '401')->first();
                    JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $fallback->id, 'type' => 'credit', 'amount' => $inc->amount]);
                }
            });

            // -- EXPENSES (assume paid by cash)
            Expense::where('user_id', $user->id)->get()->each(function (Expense $exp) use ($user, $cash) {
                $description = 'Pengeluaran: ' . ($exp->description ?? 'Biaya');
                $journal = Journal::create([ 'user_id' => $user->id, 'date' => $exp->date ?? Carbon::now(), 'description' => $description ]);

                // Debit Expense account
                $expAccountId = optional($exp->expense_category)->account_id ?? null;
                if ($expAccountId) {
                    JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $expAccountId, 'type' => 'debit', 'amount' => $exp->amount]);
                } else {
                    // fallback to Biaya Operasional (501)
                    $fallback = ChartOfAccount::where('code', '501')->first();
                    JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $fallback->id, 'type' => 'debit', 'amount' => $exp->amount]);
                }

                // Credit Kas
                $cash = ChartOfAccount::where('code', '101')->first();
                JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $cash->id, 'type' => 'credit', 'amount' => $exp->amount]);
            });

            // -- RECEIVABLES (sales on account)
            Receivable::where('user_id', $user->id)->get()->each(function (Receivable $r) use ($user, $piutang, $pendapatanPenjualan, $cash) {
                $description = 'Piutang: ' . ($r->description ?? 'Penjualan kredit');
                $journal = Journal::create([ 'user_id' => $user->id, 'date' => $r->due_date ?? Carbon::now(), 'description' => $description ]);

                // Debit Piutang
                JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $piutang->id, 'type' => 'debit', 'amount' => $r->amount]);

                // Credit Pendapatan Penjualan
                JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $pendapatanPenjualan->id, 'type' => 'credit', 'amount' => $r->amount]);

                // If partial/full payment happened, create a cash receipt journal
                if ($r->paid_amount > 0) {
                    $payJournal = Journal::create([ 'user_id' => $user->id, 'date' => $r->updated_at ?? Carbon::now(), 'description' => 'Penerimaan pembayaran piutang: ' . ($r->debtor ?? '') ]);
                    // Debit Cash
                    JournalEntry::create(['journal_id' => $payJournal->id, 'account_id' => $cash->id, 'type' => 'debit', 'amount' => $r->paid_amount]);
                    // Credit Piutang
                    JournalEntry::create(['journal_id' => $payJournal->id, 'account_id' => $piutang->id, 'type' => 'credit', 'amount' => $r->paid_amount]);
                }
            });

            // -- DEBTS (purchases on credit)
            Debt::where('user_id', $user->id)->get()->each(function (Debt $d) use ($user, $utang, $biayaOperasional, $cash) {
                $description = 'Hutang: ' . ($d->description ?? 'Pembelian kredit');
                $journal = Journal::create([ 'user_id' => $user->id, 'date' => $d->due_date ?? Carbon::now(), 'description' => $description ]);

                // Debit Biaya Operasional (simplified)
                JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $biayaOperasional->id, 'type' => 'debit', 'amount' => $d->amount]);

                // Credit Utang Usaha
                JournalEntry::create(['journal_id' => $journal->id, 'account_id' => $utang->id, 'type' => 'credit', 'amount' => $d->amount]);

                // If paid_amount > 0, record payment
                if ($d->paid_amount > 0) {
                    $payJournal = Journal::create([ 'user_id' => $user->id, 'date' => $d->updated_at ?? Carbon::now(), 'description' => 'Pembayaran hutang: ' . ($d->creditor ?? '') ]);
                    // Debit Utang Usaha
                    JournalEntry::create(['journal_id' => $payJournal->id, 'account_id' => $utang->id, 'type' => 'debit', 'amount' => $d->paid_amount]);
                    // Credit Cash
                    JournalEntry::create(['journal_id' => $payJournal->id, 'account_id' => $cash->id, 'type' => 'credit', 'amount' => $d->paid_amount]);
                }
            });

        }); // end transaction

        $this->command->info('PostingSeeder: finished posting journals for user id ' . $user->id);
    }
}
