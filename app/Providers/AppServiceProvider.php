<?php

namespace App\Providers;

use App\Models\Expense;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Vinkla\Hashids\Facades\Hashids;
use Illuminate\Routing\Router;

use App\Http\Middleware\EnsureActiveSubscription;

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
        // Register an alias for the subscription middleware so routes can use ->middleware('subscribed')
        $router = $this->app->make(Router::class);
        $router->aliasMiddleware('subscribed', EnsureActiveSubscription::class);
    }
}
