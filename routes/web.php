<?php

use App\Http\Controllers\Transaction\ExpenseController;
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

        Route::resource('expense', ExpenseController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
