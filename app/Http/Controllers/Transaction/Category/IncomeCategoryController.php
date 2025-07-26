<?php

namespace App\Http\Controllers\Transaction\Category;

use App\Http\Controllers\Controller;
use App\Models\IncomeCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class IncomeCategoryController extends Controller
{
    public function index()
    {
        $categories = auth()->user()->incomeCategories()->latest()->paginate(10);
        return Inertia::render('Dashboard/User/IncomeCategory/Index', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        auth()->user()->incomeCategories()->create($validated);
        return redirect()->route('income-category.index')->with('success', 'Category created.');
    }

    public function update(Request $request, IncomeCategory $incomeCategory)
    {
        Gate::authorize('update', $incomeCategory);
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $incomeCategory->update($validated);
        return redirect()->route('income-category.index')->with('success', 'Category updated.');
    }

    public function destroy(IncomeCategory $incomeCategory)
    {
        Gate::authorize('delete', $incomeCategory);
        $incomeCategory->delete();
        return redirect()->route('income-category.index')->with('success', 'Category deleted.');
    }
}
