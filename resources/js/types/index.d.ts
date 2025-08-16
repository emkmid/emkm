import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface BreadcrumbItemType {
    title: string;
    href: string;
}

export interface PageProps {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

export type IncomeCategory = {
    id: number;
    name: string;
};

export type ExpenseCategory = {
    id: number;
    name: string;
};

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface MainNavItem {
    title: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    href?: string;
    subItems?: SubItems[];
    can?: (user: User) => boolean;
}

export interface SubItems {
    title: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    href: string;
    can?: (user: User) => boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
