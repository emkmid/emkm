import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    CreditCard, 
    DollarSign, 
    FileText, 
    Package, 
    TrendingUp,
    ArrowUpRight,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard/admin',
    },
];

interface DashboardProps {
    stats: {
        users: {
            total: number;
            newThisMonth: number;
            activeSubscribers: number;
        };
        subscriptions: {
            total: number;
            active: number;
            pending: number;
            expired: number;
        };
        revenue: {
            total: number;
            thisMonth: number;
        };
        articles: {
            total: number;
            published: number;
            thisMonth: number;
        };
        packages: {
            total: number;
            active: number;
        };
    };
    recentActivities: {
        users: Array<{
            id: number;
            name: string;
            email: string;
            role: string;
            created_at: string;
        }>;
        subscriptions: Array<{
            id: number;
            user: { id: number; name: string; email: string };
            package: { id: number; name: string };
            status: string;
            created_at: string;
        }>;
        articles: Array<{
            id: number;
            title: string;
            slug: string;
            published_at: string;
        }>;
    };
    charts: {
        revenue: Record<string, number>;
        subscriptionsByStatus: Record<string, number>;
    };
    topPackages: Array<{
        id: number;
        name: string;
        price: number;
        subscriptions_count: number;
    }>;
}

export default function Dashboard({ stats, recentActivities, charts, topPackages }: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Selamat datang di dashboard admin. Berikut adalah ringkasan sistem.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users.total}</div>
                            <p className="text-xs text-muted-foreground">
                                +{stats.users.newThisMonth} bulan ini
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                {stats.users.activeSubscribers} subscribers aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.subscriptions.active}</div>
                            <p className="text-xs text-muted-foreground">
                                Aktif dari {stats.subscriptions.total} total
                            </p>
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                {stats.subscriptions.pending} pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats.revenue.thisMonth)}
                            </div>
                            <p className="text-xs text-muted-foreground">Bulan ini</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Total: {formatCurrency(stats.revenue.total)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Articles</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.articles.published}</div>
                            <p className="text-xs text-muted-foreground">
                                Published dari {stats.articles.total} total
                            </p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                +{stats.articles.thisMonth} bulan ini
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Users */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>User Terbaru</CardTitle>
                            <CardDescription>
                                5 user yang baru mendaftar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                <Users className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(user.created_at)}
                                            </p>
                                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/dashboard/admin/users"
                                className="mt-4 flex items-center text-sm text-primary hover:underline"
                            >
                                Lihat semua users
                                <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Top Packages */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Top Packages</CardTitle>
                            <CardDescription>
                                Package dengan subscriber terbanyak
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topPackages.map((pkg) => (
                                    <div key={pkg.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Package className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">{pkg.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatCurrency(pkg.price)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-bold">
                                                {pkg.subscriptions_count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/dashboard/admin/packages"
                                className="mt-4 flex items-center text-sm text-primary hover:underline"
                            >
                                Kelola packages
                                <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Subscriptions and Articles */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Subscriptions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Terbaru</CardTitle>
                            <CardDescription>
                                Aktivitas subscription terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.subscriptions.map((sub) => (
                                    <div key={sub.id} className="flex items-start justify-between space-x-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{sub.user.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {sub.package.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    sub.status === 'active'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : sub.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                }`}
                                            >
                                                {sub.status}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDate(sub.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Articles */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Artikel Terbaru</CardTitle>
                            <CardDescription>
                                Artikel yang baru dipublish
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.articles.map((article) => (
                                    <div key={article.id} className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium line-clamp-1">
                                                {article.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(article.published_at)}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/education/articles/${article.slug}`}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Lihat
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/dashboard/admin/articles"
                                className="mt-4 flex items-center text-sm text-primary hover:underline"
                            >
                                Kelola artikel
                                <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscription Status Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Status Overview</CardTitle>
                        <CardDescription>
                            Distribusi status subscription
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 flex-wrap">
                            {Object.entries(charts.subscriptionsByStatus).map(([status, count]) => (
                                <div
                                    key={status}
                                    className="flex-1 min-w-[150px] rounded-lg border p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <Activity className="h-5 w-5 text-muted-foreground" />
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                status === 'active'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : status === 'expired'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-2xl font-bold">{count}</div>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {status} subscriptions
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
