import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type MainNavItem, NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Book, BookOpen, Building2, Calculator, CreditCard, FileText, LayoutGrid, NotebookText, Package, Users, UserSquare, Settings } from 'lucide-react';

const mainNavItems: MainNavItem[] = [
    {
        title: 'Dashboard',
        icon: LayoutGrid,
        href: '/dashboard',
    },
    {
        title: 'Product',
        icon: Package,
        can: (user) => user?.role === 'user',
        subItems: [
            {
                title: 'Lihat Produk',
                href: '/dashboard/products',
            },
            {
                title: 'Tambah Produk',
                href: '/dashboard/products/create',
            },
        ],
    },
    {
        title: 'Transaction',
        icon: NotebookText,
        can: (user) => user?.role === 'user',
        subItems: [
            {
                title: 'Pengeluaran',
                href: '/dashboard/expenses',
            },
            {
                title: 'Pemasukan',
                href: '/dashboard/incomes',
            },
            {
                title: 'Hutang',
                href: '/dashboard/debts',
            },
            {
                title: 'Piutang',
                href: '/dashboard/receivables',
            },
        ],
    },
    {
        title: 'Report',
        icon: BookOpen,
        can: (user) => user?.role === 'user',
        subItems: [
            { title: 'Jurnal Umum', href: '/dashboard/reports/journal' },
            { title: 'Buku Besar', href: '/dashboard/reports/ledger' },
            { title: 'Laba Rugi', href: '/dashboard/reports/income-statement' },
            { title: 'Neraca Saldo', href: '/dashboard/reports/trial-balance' },
            { title: 'Neraca', href: '/dashboard/reports/balance-sheet' },
        ],
    },
    {
        title: 'Hitung HPP',
        icon: Calculator,
        can: (user) => user?.role === 'user',
        href: '/dashboard/hpp',
    },
    {
        title: 'Invoices',
        icon: FileText,
        can: (user) => user?.role === 'user',
        subItems: [
            {
                title: 'Kelola Invoice',
                href: '/dashboard/invoices',
            },
            {
                title: 'Kelola Customer',
                href: '/dashboard/customers',
            },
        ],
    },
    {
        title: 'Profil Bisnis',
        icon: Building2,
        can: (user) => user?.role === 'user',
        href: '/dashboard/business-profile',
    },
    {
        title: 'Paket',
        icon: Package,
        can: (user) => user?.role === 'user',
        href: '/dashboard/packages',
    },
    {
        title: 'Edukasi',
        icon: Book,
        can: (user) => user?.role === 'admin',
        subItems: [{ title: 'Article', href: '/dashboard/admin/articles' }],
    },
    {
        title: 'Kelola Pengguna',
        icon: Users,
        can: (user) => user?.role === 'admin',
        href: '/dashboard/admin/users',
    },
    {
        title: 'Kelola Paket Layanan',
        icon: Package,
        can: (user) => user?.role === 'admin',
        href: '/dashboard/admin/packages',
    },
    {
        title: 'Kelola Features',
        icon: Settings,
        can: (user) => user?.role === 'admin',
        href: '/dashboard/admin/features',
    },
    {
        title: 'Kelola Notifikasi',
        icon: Bell,
        can: (user) => user?.role === 'admin',
        href: '/dashboard/admin/notifications',
    },
    {
        title: 'Payments',
        icon: CreditCard,
        can: (user) => user?.role === 'admin',
        href: '/dashboard/admin/payments',
    },
    {
        title: 'Kategori',
        icon: BookOpen,
        can: (user) => user?.role === 'admin',
        subItems: [{ title: 'Kategori', href: '/dashboard/reports/journal' }],
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    // Get current subscription info from backend
    const userSubscription = ((auth?.user as any)?.current_subscription as any);
    
    // Determine plan status
    const getPlanStatus = () => {
        if (!userSubscription) {
            return { name: 'Free', status: 'active', color: 'bg-gray-100 text-gray-700' };
        }
        
        const packageName = userSubscription.package?.name || 'Free';
        const status = userSubscription.status || 'inactive';
        
        // Color coding based on plan and status
        let color = 'bg-gray-100 text-gray-700'; // Default for Free
        
        if (status === 'active') {
            switch (packageName.toLowerCase()) {
                case 'basic':
                    color = 'bg-blue-100 text-blue-700';
                    break;
                case 'pro':
                    color = 'bg-purple-100 text-purple-700';
                    break;
                case 'enterprise':
                    color = 'bg-orange-100 text-orange-700';
                    break;
                default:
                    color = 'bg-gray-100 text-gray-700';
            }
        } else if (status === 'expired') {
            color = 'bg-red-100 text-red-700';
        } else if (status === 'pending') {
            color = 'bg-yellow-100 text-yellow-700';
        }
        
        return { 
            name: packageName, 
            status, 
            color,
            expiresAt: userSubscription.expires_at
        };
    };
    
    const planInfo = getPlanStatus();
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch className="flex items-center justify-center">
                                <img src="/images/emkm.png" className="h-7 w-auto" alt="E-MKM" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="px-4 pt-2">
                    <div className="text-xs text-muted-foreground">Plan</div>
                    <div className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${planInfo.color}`}>
                        {planInfo.name}
                        {planInfo.status === 'expired' && (
                            <span className="ml-1 text-xs">(Expired)</span>
                        )}
                        {planInfo.status === 'pending' && (
                            <span className="ml-1 text-xs">(Pending)</span>
                        )}
                    </div>
                    {planInfo.status === 'active' && planInfo.name !== 'Free' && planInfo.expiresAt && (
                        <div className="text-xs text-muted-foreground mt-1">
                            Berakhir: {new Date(planInfo.expiresAt).toLocaleDateString('id-ID')}
                        </div>
                    )}
                    {(planInfo.status === 'expired' || planInfo.name === 'Free') && (
                        <Link 
                            href="/dashboard/packages" 
                            className="text-xs text-[#23BBB7] hover:underline mt-1 block"
                        >
                            Upgrade Plan
                        </Link>
                    )}
                </div>
                <NavFooter items={footerNavItems} className="mt-2" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
