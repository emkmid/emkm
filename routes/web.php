<?php

use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Transaction\ExpenseController;
use App\Http\Controllers\Transaction\IncomeController;
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

        Route::get('/hpp', fn () => Inertia::render('dashboard/user/hpp/index'))->name('hpp.index');

        Route::resource('expenses', ExpenseController::class)->except('show');
        Route::resource('incomes', IncomeController::class)->except('show');
        Route::resource('products', ProductController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
