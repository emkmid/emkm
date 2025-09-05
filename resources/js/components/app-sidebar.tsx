import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type MainNavItem, NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Book, BookOpen, Calculator, Folder, LayoutGrid, NotebookText, Package } from 'lucide-react';

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
        title: 'Edukasi',
        icon: Book,
        can: (user) => user?.role === 'admin',
        subItems: [{ title: 'Article', href: '/dashboard/admin/articles' }],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
