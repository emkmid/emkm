<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\ChartOfAccount;
use App\Models\Debt;
use App\Services\JournalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class DebtController extends Controller
{
    /**
     * Menampilkan daftar hutang/piutang milik pengguna.
     */
    public function index(): Response
    {
        $debts = Auth::user()->debts()->latest()->paginate(10);
        return Inertia::render('dashboard/user/debt/index', compact('debts'));
    }

    /**
     * Menampilkan form untuk membuat data hutang/piutang baru.
     */
    public function create(): Response
    {
        return Inertia::render('dashboard/user/debt/create');
    }

    /**
     * Menyimpan data hutang/piutang baru ke dalam database. 
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'creditor'   => 'required|string|max:255',
            'amount'     => 'required|numeric|min:0',
            'paid_amount'=> 'nullable|numeric|min:0',
            'due_date'   => 'nullable|date',
            'description'=> 'nullable|string',
        ]);

        $debt = Auth::user()->debts()->create($validated);

        $kasAccount   = ChartOfAccount::where('code', '101')->firstOrFail(); // Kas
        $utangAccount = ChartOfAccount::where('code', '201')->firstOrFail(); // Utang Usaha

        JournalService::add(
            Auth::id(),
            $request->date ?? now()->toDateString(),
            'Hutang dari ' . $request->creditor,
            [
                ['account_id' => $kasAccount->id,   'type' => 'debit',  'amount' => $request->amount],
                ['account_id' => $utangAccount->id, 'type' => 'credit', 'amount' => $request->amount],
            ],
            $debt->id,
            'debt'
        );

        return redirect()->route('debts.index')->with('success', 'Hutang berhasil ditambahkan!');
    }

    /**
     * Menampilkan form untuk mengedit data hutang/piutang.
     */
    public function edit(Debt $debt): Response
    {
        Gate::authorize('update', $debt);

        return Inertia::render('dashboard/user/debt/edit', compact('debt'));
    }

    /**
     * Memperbarui data hutang/piutang di database.
     */
    public function update(Request $request, Debt $debt)
    {
        Gate::authorize('update', $debt);

        $validated = $request->validate([
            'creditor'   => 'required|string|max:255',
            'amount'     => 'required|numeric|min:0',
            'paid_amount'=> 'nullable|numeric|min:0',
            'due_date'   => 'nullable|date',
            'description'=> 'nullable|string',
        ]);

        $oldAmount = $debt->amount;
        $debt->update($validated);

        $kasAccount   = ChartOfAccount::where('code', '101')->firstOrFail();
        $utangAccount = ChartOfAccount::where('code', '201')->firstOrFail();

        // 🔄 Jurnal Pembalik
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Pembalik hutang lama: ' . ($debt->description ?? 'Tanpa deskripsi'),
            [
                ['account_id' => $utangAccount->id, 'type' => 'debit',  'amount' => $oldAmount], // Utang berkurang
                ['account_id' => $kasAccount->id,   'type' => 'credit', 'amount' => $oldAmount], // Kas kembali
            ],
            $debt->id,
            'debt'
        );

        // 🆕 Jurnal Baru
        JournalService::add(
            Auth::id(),
            $request->date ?? now()->toDateString(),
            'Perubahan hutang: ' . ($debt->description ?? 'Tanpa deskripsi'),
            [
                ['account_id' => $kasAccount->id,   'type' => 'debit',  'amount' => $request->amount],
                ['account_id' => $utangAccount->id, 'type' => 'credit', 'amount' => $request->amount],
            ],
            $debt->id,
            'debt'
        );

        return redirect()->route('debts.index')->with('success', 'Hutang berhasil diperbarui!');
    }

    /**
     * Menghapus data hutang/piutang dari database.
     */
    public function destroy(Debt $debt)
    {
        Gate::authorize('delete', $debt);

        $kasAccount   = ChartOfAccount::where('code', '101')->firstOrFail();
        $utangAccount = ChartOfAccount::where('code', '201')->firstOrFail();

        // 🔄 Jurnal Pembalik (hapus hutang = hapus efek jurnal awal)
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Hapus hutang: ' . ($debt->description ?? 'Tanpa deskripsi'),
            [
                ['account_id' => $utangAccount->id, 'type' => 'debit',  'amount' => $debt->amount],
                ['account_id' => $kasAccount->id,   'type' => 'credit', 'amount' => $debt->amount],
            ],
            $debt->id,
            'debt'
        );

        $debt->delete();

        return redirect()->route('debts.index')->with('success', 'Hutang berhasil dihapus!');
    }
}
