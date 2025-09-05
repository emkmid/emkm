<?php

use App\Http\Controllers\AccountingReportController;
use App\Http\Controllers\Education\ArticleController;
use App\Http\Controllers\Education\EducationController;
use App\Http\Controllers\Product\ProductCategoryController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Report\JournalController;
use App\Http\Controllers\Transaction\Category\ExpenseCategoryController;
use App\Http\Controllers\Transaction\Category\IncomeCategoryController;
use App\Http\Controllers\Transaction\DebtController;
use App\Http\Controllers\Transaction\ExpenseController;
use App\Http\Controllers\Transaction\IncomeController;
use App\Http\Controllers\Transaction\ReceivableController;
use App\Services\AccountingService;
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
        Route::resource('debts', DebtController::class);
        Route::resource('receivables', ReceivableController::class);

        Route::resource('expense-category', ExpenseCategoryController::class);
        Route::resource('income-category', IncomeCategoryController::class);

        Route::resource('products', ProductController::class);
        Route::resource('product-category', ProductCategoryController::class);

        Route::prefix('reports')->group(function () {
            Route::get('journal', [JournalController::class, 'index'])->name('journal.index');
            Route::get('ledger',[AccountingReportController::class, 'ledger'])->name('reports.ledger');
            Route::get('trial-balance', [AccountingReportController::class, 'trialBalance'])->name('reports.trial-balance');
            Route::get('income-statement', [AccountingReportController::class, 'incomeStatement'])->name('reports.income-statement');
            Route::get('balance-sheet', [AccountingReportController::class, 'balanceSheet'])->name('reports.balance-sheet');
        });

        // Admin
        Route::prefix('admin')->middleware(['mustBeAdmin', 'web'])->group(function() {
            Route::resource('articles', ArticleController::class);
            Route::post('uploads/article-media', [ArticleController::class, 'upload'])->name('articles.upload')->middleware('throttle:20,1');
        });
    });
});

Route::prefix('education')->group(function() {
    Route::get('articles', [EducationController::class, 'articles'])->name('education.article.index');
    Route::get('articles/{article}', [EducationController::class, 'articleShow'])->name('education.article.show');

    // Toggle Like Article
    Route::post('articles/{article}/like', [EducationController::class, 'toggleLike'])->name('article.toggle')->middleware('auth');
    Route::get('articles/{article}/like/status', [EducationController::class, 'likeStatus'])->name('article.likeStatus');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
