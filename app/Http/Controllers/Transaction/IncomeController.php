<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\IncomeCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $incomes = Income::with('income_category')
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('dashboard/user/income/index', [
            'incomes' => $incomes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categories = IncomeCategory::where('user_id', Auth::id())->get();

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
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        // PERBAIKAN: Tambahkan ID pengguna ke data yang divalidasi sebelum disimpan.
        $validated['user_id'] = Auth::id();

        // Buat data pemasukan baru menggunakan data yang sudah lengkap.
        Income::create($validated);

        return redirect(route('incomes.index'));
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
        $this->authorize('update', $income);

        $categories = IncomeCategory::where('user_id', Auth::id())->get();

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
        $this->authorize('update', $income);

        $validated = $request->validate([
            'date' => 'required|date',
            'income_category_id' => 'required|exists:income_categories,id',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $income->update($validated);

        return redirect(route('incomes.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Income $income): RedirectResponse
    {
        $this->authorize('delete', $income);

        $income->delete();

        return redirect(route('incomes.index'));
    }
}
