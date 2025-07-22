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

        Route::resource('expenses', ExpenseController::class);
        Route::resource('incomes', IncomeController::class);
        Route::resource('products', ProductController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
