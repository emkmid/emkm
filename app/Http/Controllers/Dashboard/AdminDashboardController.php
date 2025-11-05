<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Article;
use App\Models\Subscription;
use App\Models\PaymentNotification;
use App\Models\Package;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // User Statistics
        $totalUsers = User::count();
        $newUsersThisMonth = User::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
        $activeSubscribers = Subscription::where('status', 'active')
            ->distinct('user_id')
            ->count('user_id');

        // Subscription Statistics
        $totalSubscriptions = Subscription::count();
        $activeSubscriptions = Subscription::where('status', 'active')->count();
        $pendingSubscriptions = Subscription::where('status', 'pending')->count();
        $expiredSubscriptions = Subscription::where('status', 'expired')->count();

        // Revenue Statistics (from payment notifications)
        $totalRevenue = PaymentNotification::whereJsonContains('payload->transaction_status', 'settlement')
            ->get()
            ->sum(function ($payment) {
                return $payment->payload['gross_amount'] ?? 0;
            });

        $revenueThisMonth = PaymentNotification::whereJsonContains('payload->transaction_status', 'settlement')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->get()
            ->sum(function ($payment) {
                return $payment->payload['gross_amount'] ?? 0;
            });

        // Article Statistics
        $totalArticles = Article::count();
        $publishedArticles = Article::whereNotNull('published_at')->count();
        $articlesThisMonth = Article::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();

        // Package Statistics
        $totalPackages = Package::count();
        $activePackages = Package::where('is_active', true)->count();

        // Recent Activities
        $recentUsers = User::latest()->take(5)->get(['id', 'name', 'email', 'role', 'created_at']);
        $recentSubscriptions = Subscription::with(['user:id,name,email', 'package:id,name'])
            ->latest()
            ->take(5)
            ->get();
        $recentArticles = Article::latest('published_at')
            ->take(5)
            ->get(['id', 'title', 'slug', 'published_at']);

        // Revenue Chart Data (last 6 months)
        $revenueChart = PaymentNotification::whereJsonContains('payload->transaction_status', 'settlement')
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->get()
            ->groupBy(function ($payment) {
                return Carbon::parse($payment->created_at)->format('Y-m');
            })
            ->map(function ($group) {
                return $group->sum(function ($payment) {
                    return $payment->payload['gross_amount'] ?? 0;
                });
            })
            ->toArray();

        // Subscription Status Distribution
        $subscriptionsByStatus = Subscription::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        // Top Packages by Subscriptions
        $topPackages = Package::withCount(['subscriptions' => function ($query) {
                $query->where('status', 'active');
            }])
            ->orderBy('subscriptions_count', 'desc')
            ->take(5)
            ->get(['id', 'name', 'price', 'subscriptions_count']);

        return Inertia::render('dashboard/admin/index', [
            'stats' => [
                'users' => [
                    'total' => $totalUsers,
                    'newThisMonth' => $newUsersThisMonth,
                    'activeSubscribers' => $activeSubscribers,
                ],
                'subscriptions' => [
                    'total' => $totalSubscriptions,
                    'active' => $activeSubscriptions,
                    'pending' => $pendingSubscriptions,
                    'expired' => $expiredSubscriptions,
                ],
                'revenue' => [
                    'total' => $totalRevenue,
                    'thisMonth' => $revenueThisMonth,
                ],
                'articles' => [
                    'total' => $totalArticles,
                    'published' => $publishedArticles,
                    'thisMonth' => $articlesThisMonth,
                ],
                'packages' => [
                    'total' => $totalPackages,
                    'active' => $activePackages,
                ],
            ],
            'recentActivities' => [
                'users' => $recentUsers,
                'subscriptions' => $recentSubscriptions,
                'articles' => $recentArticles,
            ],
            'charts' => [
                'revenue' => $revenueChart,
                'subscriptionsByStatus' => $subscriptionsByStatus,
            ],
            'topPackages' => $topPackages,
        ]);
    }
}
