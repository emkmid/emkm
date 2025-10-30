<?php

use App\Http\Controllers\AccountingReportController;
use App\Http\Controllers\AdminNotificationController;
use App\Http\Controllers\AdminPackageController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\Dashboard\AdminDashboardController;
use App\Http\Controllers\Dashboard\UserDashboardController;
use App\Http\Controllers\Education\ArticleController;
use App\Http\Controllers\Education\EducationController;
use App\Http\Controllers\Product\ProductCategoryController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\AdminSubscriptionController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\Report\JournalController;
use App\Http\Controllers\Transaction\Category\ExpenseCategoryController;
use App\Http\Controllers\Transaction\Category\IncomeCategoryController;
use App\Http\Controllers\Transaction\DebtController;
use App\Http\Controllers\Transaction\ExpenseController;
use App\Http\Controllers\Transaction\IncomeController;
use App\Http\Controllers\Transaction\ReceivableController;
use App\Services\AccountingService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::get('/', function () {
            return Auth::user()->role === 'admin'
                ? redirect()->route('admin.dashboard')
                : redirect()->route('user.dashboard');
        })->name('dashboard');

        Route::get('user', [UserDashboardController::class, 'index'])->name('user.dashboard');

        // Packages page for users
        Route::get('packages', [\App\Http\Controllers\SubscriptionController::class, 'page'])->name('dashboard.packages');

        Route::get('hpp', fn () => Inertia::render('dashboard/user/hpp/index'))->name('hpp.index')->middleware('subscribed');
        Route::get('hpp/hasil', fn () => Inertia::render('dashboard/user/hpp/result'))->name('hpp.hasil')->middleware('subscribed');

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
            Route::get('/', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
            Route::resource('articles', ArticleController::class);
            Route::post('uploads/article-media', [ArticleController::class, 'upload'])->name('articles.upload')->middleware('throttle:20,1');
            Route::resource('users', AdminUserController::class)->except(['show']);
            Route::post('users/{user}/subscribe', [AdminSubscriptionController::class, 'store'])->name('admin.users.subscribe');
            Route::resource('packages', AdminPackageController::class)->except(['show'])->names('admin.packages');
            Route::get('payments', [\App\Http\Controllers\AdminPaymentController::class, 'index'])->name('admin.payments.index');
            Route::get('payments/list', [\App\Http\Controllers\AdminPaymentController::class, 'list'])->name('admin.payments.list');
            Route::get('payments/{id}', [\App\Http\Controllers\AdminPaymentController::class, 'showNotification'])->name('admin.payments.show');
            Route::post('payments/{id}/replay', [\App\Http\Controllers\AdminPaymentController::class, 'replay'])->name('admin.payments.replay');
            Route::get('payments/export', [\App\Http\Controllers\AdminPaymentController::class, 'exportNotifications'])->name('admin.payments.export');
            Route::get('subscriptions/list', [\App\Http\Controllers\AdminPaymentController::class, 'subscriptionsList'])->name('admin.subscriptions.list');
            Route::resource('notifications', AdminNotificationController::class)->except(['show']);
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

// Test route for Midtrans configuration
Route::get('/test-midtrans', function () {
    return response()->json([
        'server_key_configured' => !empty(env('MIDTRANS_SERVER_KEY')),
        'client_key_configured' => !empty(env('MIDTRANS_CLIENT_KEY')),
        'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
        'merchant_id' => 'G150957554', // From user input
        'config' => config('midtrans'),
        'env_test' => [
            'server_key' => env('MIDTRANS_SERVER_KEY'),
            'client_key' => env('MIDTRANS_CLIENT_KEY'),
            'is_production' => env('MIDTRANS_IS_PRODUCTION'),
        ],
    ]);
});
Route::get('packages', [SubscriptionController::class, 'index'])->name('packages.index');
Route::post('subscriptions/checkout', [SubscriptionController::class, 'createCheckout'])->middleware('auth')->name('subscriptions.checkout');
Route::post('webhooks/stripe', [SubscriptionController::class, 'webhook'])->name('webhooks.stripe');
Route::post('webhooks/midtrans', [SubscriptionController::class, 'midtransWebhook'])->name('webhooks.midtrans');
