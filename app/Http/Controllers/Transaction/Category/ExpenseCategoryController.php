<?php

namespace App\Http\Controllers\Transaction\Category;

use App\Http\Controllers\Controller;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExpenseCategoryController extends Controller
{
    public function index()
    {
        $categories = auth()->user()->expenseCategories()->latest()->paginate(10);
        return Inertia::render('Dashboard/User/ExpenseCategory/Index', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        auth()->user()->expenseCategories()->create($validated);
        return redirect()->route('expense-category.index')->with('success', 'Category created.');
    }

    public function update(Request $request, ExpenseCategory $expenseCategory)
    {
        Gate::authorize('update', $expenseCategory);
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $expenseCategory->update($validated);
        return redirect()->route('expense-category.index')->with('success', 'Category updated.');
    }

    public function destroy(ExpenseCategory $expenseCategory)
    {
        Gate::authorize('delete', $expenseCategory);
        $expenseCategory->delete();
        return redirect()->route('expense-category.index')->with('success', 'Category deleted.');
    }
}
