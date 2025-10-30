import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type MainNavItem, NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Book, BookOpen, Calculator, CreditCard, LayoutGrid, NotebookText, Package, Users } from 'lucide-react';

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
    // current_subscription comes from backend (appended attribute). Cast to any for flexible access in TSX.
    const planName = ((auth?.user as any)?.current_subscription?.package?.name as string) ?? 'Free';
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
                    <div className="mt-1 inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">{planName}</div>
                </div>
                <NavFooter items={footerNavItems} className="mt-2" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
