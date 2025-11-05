<?php

namespace App\Providers;

use App\Models\Expense;
use App\Models\Subscription;
use App\Observers\SubscriptionObserver;
use App\Services\FeatureService;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Vinkla\Hashids\Facades\Hashids;
use Illuminate\Routing\Router;

use App\Http\Middleware\EnsureActiveSubscription;
use App\Http\Middleware\CheckFeatureAccess;

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
        // Register subscription observer
        Subscription::observe(SubscriptionObserver::class);
        
        // Register middleware aliases
        $router = $this->app->make(Router::class);
        $router->aliasMiddleware('subscribed', EnsureActiveSubscription::class);
        $router->aliasMiddleware('feature', CheckFeatureAccess::class);
        
        // Register Blade directives for feature checking
        $this->registerBladeDirectives();
    }

    /**
     * Register custom Blade directives
     */
    protected function registerBladeDirectives(): void
    {
        // @canFeature('invoices.create')
        Blade::if('canFeature', function (string $featureKey) {
            if (!auth()->check()) {
                return false;
            }
            
            $featureService = app(FeatureService::class);
            return $featureService->hasAccess(auth()->user(), $featureKey);
        });

        // @featureLimit('articles.max_count')
        Blade::directive('featureLimit', function ($featureKey) {
            return "<?php 
                \$featureService = app(\App\Services\FeatureService::class);
                echo \$featureService->getLimit(auth()->user(), {$featureKey});
            ?>";
        });
    }
}
