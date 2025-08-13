<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Receivable;
use App\Services\JournalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'debtor' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        Auth::user()->receivables()->create($validated);

        // Jurnal: Piutang Usaha (Debit) & Pendapatan (Credit)
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Piutang dari ' . $request->debtor,
            [
                ['account_id' => 4, 'type' => 'debit',  'amount' => $request->amount], // Piutang Usaha
                ['account_id' => 5, 'type' => 'credit', 'amount' => $request->amount], // Pendapatan
            ]
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
            'debtor' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        // Reverse jurnal lama
        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Pembatalan Piutang #' . $receivable->id,
            [
                ['account_id' => 3, 'type' => 'credit', 'amount' => $receivable->amount], // Piutang
                ['account_id' => 1, 'type' => 'debit',  'amount' => $receivable->amount], // Kas
            ]
        );

        $receivable->update($validated);

        JournalService::add(
            Auth::id(),
            now()->toDateString(),
            'Piutang (Update): ' . $request->debtor,
            [
                ['account_id' => 3, 'type' => 'debit',  'amount' => $request->amount], // Piutang bertambah
                ['account_id' => 1, 'type' => 'credit', 'amount' => $request->amount], // Kas keluar
            ]
        );

        return redirect()->route('receivables.index')->with('success', 'Piutang berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Receivable $receivable)
    {
        $receivable->delete();

        return redirect()->route('receivables.index')->with('success', 'Piutang berhasil dihapus!');
    }
}
