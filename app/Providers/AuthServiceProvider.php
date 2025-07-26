<?php

namespace App\Providers;

use App\Models\Debt;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Income;
use App\Models\IncomeCategory;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Policies\DebtPolicy;
use App\Policies\ExpenseCategoryPolicy;
use App\Policies\ExpensePolicy;
use App\Policies\IncomeCategoryPolicy;
use App\Policies\IncomePolicy;
use App\Policies\ProductCategoryPolicy;
use App\Policies\ProductPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Expense::class => ExpensePolicy::class,
        Income::class => IncomePolicy::class,
        Debt::class => DebtPolicy::class,
        Product::class => ProductPolicy::class,
        IncomeCategory::class => IncomeCategoryPolicy::class,
        ExpenseCategory::class => ExpenseCategoryPolicy::class,
        ProductCategory::class => ProductCategoryPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
