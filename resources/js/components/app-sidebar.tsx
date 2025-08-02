import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type MainNavItem, NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Calculator, Folder, LayoutGrid, NotebookText, Package } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: MainNavItem[] = [
    {
        title: 'Dashboard',
        icon: LayoutGrid,
        href: '/dashboard',
    },
    {
        title: 'Product',
        icon: Package,
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
        title: 'Hitung HPP',
        icon: Calculator,
        href: '/dashboard/hpp',
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
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
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
