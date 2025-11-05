<?php

namespace App\Http\Middleware;

use App\Services\FeatureService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Get user with current subscription
        $user = $request->user();
        $featureAccess = [];
        
        if ($user) {
            // Load current active subscription with package
            $currentSubscription = $user->subscriptions()
                ->where('status', 'active')
                ->where(function($query) {
                    $query->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                })
                ->with('package')
                ->latest('created_at')
                ->first();
            
            // Set current subscription as an appended attribute
            $user->setAttribute('current_subscription', $currentSubscription);
            
            // Get unread notification count
            $unreadNotificationCount = $user->unreadNotifications()->count();
            
            // Get feature access
            $featureService = app(FeatureService::class);
            $featureAccess = [
                // Accounting features
                'accounting.transactions' => $featureService->hasAccess($user, 'accounting.transactions'),
                'accounting.reports' => $featureService->hasAccess($user, 'accounting.reports'),
                'accounting.journal' => $featureService->hasAccess($user, 'accounting.journal'),
                
                // Articles features
                'articles.create' => $featureService->hasAccess($user, 'articles.create'),
                
                // Branding features
                'business_profile' => $featureService->hasAccess($user, 'business_profile'),
                
                // Customer features
                'customers.create' => $featureService->hasAccess($user, 'customers.create'),
                
                // Invoice features
                'invoices.create' => $featureService->hasAccess($user, 'invoices.create'),
                'invoices.pdf_export' => $featureService->hasAccess($user, 'invoices.pdf_export'),
                'invoices.email_send' => $featureService->hasAccess($user, 'invoices.email_send'),
                
                // Advanced features
                'backup' => $featureService->hasAccess($user, 'backup'),
            ];
        } else {
            $unreadNotificationCount = 0;
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
                'unreadNotificationCount' => $unreadNotificationCount,
                'features' => $featureAccess,
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error')
            ]
        ];
    }
}
