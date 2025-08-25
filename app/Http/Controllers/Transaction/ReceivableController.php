<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\ChartOfAccount;
use App\Models\Receivable;
use App\Services\JournalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ReceivableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $receivables = Auth::user()->receivables()->latest()->paginate(10);
        return Inertia::render('dashboard/user/receivable/index', compact('receivables'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dashboard/user/receivable/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'debtor'     => 'required|string|max:255',
            'amount'     => 'required|numeric|min:0',
            'paid_amount'=> 'nullable|numeric|min:0',
            'due_date'   => 'nullable|date',
            'description'=> 'nullable|string',
        ]);

        $receivable = Auth::user()->receivables()->create($validated);

        $piutangAccount   = ChartOfAccount::where('code', '103')->firstOrFail(); // Piutang Usaha
        $pendapatanAccount = ChartOfAccount::where('code', '401')->firstOrFail(); // Pendapatan Penjualan

        JournalService::add(
            Auth::id(),
            $request->date ?? now()->toDateString(),
            'Piutang dari ' . $request->debtor,
            [
                ['account_id' => $piutangAccount->id,   'type' => 'debit',  'amount' => $request->amount],
                ['account_id' => $pendapatanAccount->id,'type' => 'credit', 'amount' => $request->amount],
            ],
            $receivable->id,
            'receivable'
        );

        return redirect()->route('receivables.index')->with('success', 'Piutang berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Receivable $receivable)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Receivable $receivable)
    {
        return Inertia::render('dashboard/user/receivable/edit', compact('receivable'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Receivable $receivable)
    {
        $validated = $request->validate([
            'debtor'     => 'required|string|max:255',
            'amount'     => 'required|numeric|min:0',
            'paid_amount'=> 'nullable|numeric|min:0',
            'due_date'   => 'nullable|date',
            'description'=> 'nullable|string',
        ]);

        $oldAmount = $receivable->amount;
        $receivable->update($validated);

        $piutangAccount    = ChartOfAccount::where('code', '103')->firstOrFail();
        $pendapatanAccount = ChartOfAccount::where('code', '401')->firstOrFail();

        // 🔄 Jurnal Pembalik
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Pembalik piutang lama: ' . ($receivable->description ?? 'Tanpa deskripsi'),
            [
                ['account_id' => $pendapatanAccount->id, 'type' => 'debit',  'amount' => $oldAmount], // pendapatan dibalik
                ['account_id' => $piutangAccount->id,    'type' => 'credit', 'amount' => $oldAmount], // piutang dikurangi
            ],
            $receivable->id,
            'receivable'
        );

        // 🆕 Jurnal Baru
        JournalService::add(
            Auth::id(),
            $request->date ?? now()->toDateString(),
            'Perubahan piutang: ' . ($receivable->description ?? 'Tanpa deskripsi'),
            [
                ['account_id' => $piutangAccount->id,    'type' => 'debit',  'amount' => $request->amount],
                ['account_id' => $pendapatanAccount->id, 'type' => 'credit', 'amount' => $request->amount],
            ],
            $receivable->id,
            'receivable'
        );

        return redirect()->route('receivables.index')->with('success', 'Piutang berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Receivable $receivable)
    {
        $piutangAccount    = ChartOfAccount::where('code', '103')->firstOrFail();
        $pendapatanAccount = ChartOfAccount::where('code', '401')->firstOrFail();

        // 🔄 Jurnal Pembalik
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Hapus piutang: ' . ($receivable->description ?? 'Tanpa deskripsi'),
            [
                ['account_id' => $pendapatanAccount->id, 'type' => 'debit',  'amount' => $receivable->amount],
                ['account_id' => $piutangAccount->id,    'type' => 'credit', 'amount' => $receivable->amount],
            ],
            $receivable->id,
            'receivable'
        );

        $receivable->delete();

        return redirect()->route('receivables.index')->with('success', 'Piutang berhasil dihapus!');
    }
}
