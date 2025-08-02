<?php

use App\Http\Controllers\Product\ProductCategoryController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Transaction\Category\ExpenseCategoryController;
use App\Http\Controllers\Transaction\Category\IncomeCategoryController;
use App\Http\Controllers\Transaction\DebtController;
use App\Http\Controllers\Transaction\ExpenseController;
use App\Http\Controllers\Transaction\IncomeController;
use App\Http\Controllers\Transaction\ReceivableController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::get('/', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::get('hpp', fn () => Inertia::render('dashboard/user/hpp/index'))->name('hpp.index');
        Route::get('hpp/hasil', fn () => Inertia::render('dashboard/user/hpp/result'))->name('hpp.hasil');

        Route::resource('expenses', ExpenseController::class);
        Route::resource('incomes', IncomeController::class);
        Route::resource('debt', DebtController::class);

        Route::resource('expense-category', ExpenseCategoryController::class);
        Route::resource('income-category', IncomeCategoryController::class);

        // Route::resource('receivables', ReceivableController::class);

        Route::resource('products', ProductController::class);
        Route::resource('product-category', ProductCategoryController::class);

        // Route::get('/product', fn () => Inertia::render('dashboard/user/product/Index'))->name('product.index');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
