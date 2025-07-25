<?php

namespace App\Providers;

use App\Models\Expense;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Vinkla\Hashids\Facades\Hashids;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        
    }
}
