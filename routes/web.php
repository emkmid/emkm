<?php

use App\Http\Controllers\AccountingReportController;
use App\Http\Controllers\AdminNotificationController;
use App\Http\Controllers\AdminPackageController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\PackageFeatureController;
use App\Http\Controllers\BusinessProfileController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\Dashboard\AdminDashboardController;
use App\Http\Controllers\Dashboard\UserDashboardController;
use App\Http\Controllers\Education\ArticleController;
use App\Http\Controllers\Education\EducationController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\NotificationController;
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
use Illuminate\Http\Request;

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

        // User Notifications
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::get('notifications/unread', [NotificationController::class, 'getUnread'])->name('notifications.unread');
        Route::post('notifications/{notification}/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
        Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

        // Business Profile
        Route::middleware(['feature:business_profile'])->group(function () {
            Route::get('business-profile', [BusinessProfileController::class, 'index'])->name('business-profile.index');
            Route::get('business-profile/create', [BusinessProfileController::class, 'create'])->name('business-profile.create');
            Route::post('business-profile', [BusinessProfileController::class, 'store'])->name('business-profile.store');
            Route::get('business-profile/edit', [BusinessProfileController::class, 'edit'])->name('business-profile.edit');
            Route::post('business-profile/update', [BusinessProfileController::class, 'update'])->name('business-profile.update');
            Route::delete('business-profile', [BusinessProfileController::class, 'destroy'])->name('business-profile.destroy');
        });

        // Customers
        Route::middleware(['feature:customers.create'])->group(function () {
            Route::resource('customers', CustomerController::class);
            Route::get('customers-list', [CustomerController::class, 'list'])->name('customers.list');
        });

        // Invoices
        Route::middleware(['feature:invoices.create'])->group(function () {
            Route::resource('invoices', InvoiceController::class);
            Route::post('invoices/{invoice}/mark-sent', [InvoiceController::class, 'markAsSent'])->name('invoices.mark-sent');
            Route::post('invoices/{invoice}/mark-paid', [InvoiceController::class, 'markAsPaid'])->name('invoices.mark-paid');
        });
        
        // Invoice PDF Export (separate feature)
        Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'pdf'])
            ->name('invoices.pdf')
            ->middleware(['feature:invoices.pdf_export']);

        // Packages page for users
        Route::get('packages', [\App\Http\Controllers\SubscriptionController::class, 'page'])->name('dashboard.packages');

        Route::get('hpp', fn () => Inertia::render('dashboard/user/hpp/index'))->name('hpp.index')->middleware('subscribed');
        Route::get('hpp/hasil', fn () => Inertia::render('dashboard/user/hpp/result'))->name('hpp.hasil')->middleware('subscribed');

        // Transaction routes - protected by accounting.transactions feature
        Route::middleware(['feature:accounting.transactions'])->group(function () {
            Route::resource('expenses', ExpenseController::class);
            Route::resource('incomes', IncomeController::class);
            Route::resource('debts', DebtController::class);
            Route::resource('receivables', ReceivableController::class);
        });

        // Category routes - available to all authenticated users
        Route::resource('expense-category', ExpenseCategoryController::class);
        Route::resource('income-category', IncomeCategoryController::class);
        Route::resource('product-category', ProductCategoryController::class);

        // Product routes - available to all authenticated users
        Route::resource('products', ProductController::class);

        // Reports routes - protected by accounting.reports feature
        Route::prefix('reports')->middleware(['feature:accounting.reports'])->group(function () {
            Route::get('journal', [JournalController::class, 'index'])->name('journal.index');
            Route::get('ledger',[AccountingReportController::class, 'ledger'])->name('reports.ledger');
            Route::get('trial-balance', [AccountingReportController::class, 'trialBalance'])->name('reports.trial-balance');
            Route::get('income-statement', [AccountingReportController::class, 'incomeStatement'])->name('reports.income-statement');
            Route::get('balance-sheet', [AccountingReportController::class, 'balanceSheet'])->name('reports.balance-sheet');
        });

        // Admin
        Route::prefix('admin')->middleware(['mustBeAdmin', 'web'])->group(function() {
            Route::get('/', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
            
            // Article management (admin only)
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
            
            // Package Features Management
            Route::get('features', [PackageFeatureController::class, 'index'])->name('admin.features.index');
            Route::get('features/create', [PackageFeatureController::class, 'create'])->name('admin.features.create');
            Route::post('features', [PackageFeatureController::class, 'store'])->name('admin.features.store');
            Route::get('features/{feature}/edit', [PackageFeatureController::class, 'edit'])->name('admin.features.edit');
            Route::put('features/{feature}', [PackageFeatureController::class, 'update'])->name('admin.features.update');
            Route::delete('features/{feature}', [PackageFeatureController::class, 'destroy'])->name('admin.features.destroy');
            Route::post('features/update-limit', [PackageFeatureController::class, 'updateLimit'])->name('admin.features.update-limit');
            Route::post('features/bulk-update', [PackageFeatureController::class, 'bulkUpdate'])->name('admin.features.bulk-update');
            
            // Backup routes (admin only, no user package restrictions)
            Route::get('backups', [BackupController::class, 'index'])->name('admin.backups.index');
            Route::post('backups', [BackupController::class, 'create'])->name('admin.backups.create');
            Route::get('backups/{backup}/download', [BackupController::class, 'download'])->name('admin.backups.download');
            Route::post('backups/{backup}/restore', [BackupController::class, 'restore'])->name('admin.backups.restore');
            Route::delete('backups/{backup}', [BackupController::class, 'destroy'])->name('admin.backups.destroy');
            
            // Audit Log routes (admin only, no user package restrictions)
            Route::get('audit-logs', [AuditLogController::class, 'index'])->name('admin.audit-logs.index');
            Route::get('audit-logs/{auditLog}', [AuditLogController::class, 'show'])->name('admin.audit-logs.show');
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
// Subscription routes
Route::get('packages', [SubscriptionController::class, 'index'])->name('packages.index');
Route::middleware('auth')->group(function () {
    Route::get('subscriptions', [SubscriptionController::class, 'page'])->name('subscriptions.index');
    Route::post('subscriptions/checkout', [SubscriptionController::class, 'createCheckout'])->name('subscriptions.checkout');
    Route::get('subscriptions/success', [SubscriptionController::class, 'success'])->name('subscription.success');
    Route::get('subscriptions/error', [SubscriptionController::class, 'error'])->name('subscription.error');
    Route::get('subscriptions/pending', [SubscriptionController::class, 'pending'])->name('subscription.pending');
    Route::get('subscriptions/history', [SubscriptionController::class, 'history'])->name('subscription.history');
    Route::post('subscriptions/cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');
    Route::post('subscriptions/cancel-pending', [SubscriptionController::class, 'cancelPending'])->name('subscription.cancel-pending');
    Route::post('subscriptions/activate-free', [SubscriptionController::class, 'activateFree'])->name('subscription.activate-free');
});

// Webhook routes (no auth middleware needed for webhooks)
Route::post('webhooks/midtrans', [\App\Http\Controllers\MidtransWebhookController::class, 'handle'])
    ->name('webhooks.midtrans')
    ->middleware('throttle:100,1'); // Rate limit: 100 requests per minute

// Test API route for debugging
Route::post('api/test-checkout', function(Request $request) {
    try {
        $user = \App\Models\User::first();
        $package = \App\Models\Package::find($request->package_id);
        
        if (!$package) {
            return response()->json(['error' => 'Package not found'], 404);
        }
        
        $midtransService = app(\App\Services\MidtransService::class);
        $result = $midtransService->createSubscriptionPayment($user, $package, $request->duration);
        
        return response()->json($result);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
});

// Direct flash test route
Route::get('test-flash', function() {
    return redirect()->to('/test-payment.html')->with('checkoutData', [
        'snap_token' => '5ca548da-e103-4868-90b2-738225ef31b9',
        'order_id' => 'TEST-ORDER-123',
        'client_key' => config('midtrans.client_key'),
        'is_production' => config('midtrans.is_production'),
        'subscription_id' => 999,
    ]);
});

// Public test subscription page (no auth required)
Route::get('test-subscriptions', function() {
    $packages = \App\Models\Package::where('is_active', true)->get();
    
    // Mock user data for testing
    $mockUser = (object) [
        'id' => 999,
        'name' => 'Test User',
        'email' => 'test@example.com',
        'avatar' => null,
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ];
    
    return \Inertia\Inertia::render('Subscription/Index', [
        'packages' => $packages,
        'userSubscription' => null,
        'pendingPayment' => null,
        'auth' => [
            'user' => $mockUser
        ]
    ]);
});

require_once __DIR__.'/auth.php';

// Load test routes for development
if (app()->environment(['local', 'staging'])) {
    require_once __DIR__.'/test.php';
}
