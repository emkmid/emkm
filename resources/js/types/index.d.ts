import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    features?: Record<string, boolean>;
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
    can?: (user: User, features?: Record<string, boolean>) => boolean;
}

export interface SubItems {
    title: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    href: string;
    can?: (user: User, features?: Record<string, boolean>) => boolean;
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
    role?: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    features: Record<string, any>;
    duration_options?: string[];
    discount_percentage: number;
    is_popular: boolean;
    is_active: boolean;
    stripe_product_id?: string;
    stripe_price_id?: string;
    created_at: string;
    updated_at: string;
}

export interface Subscription {
    id: number;
    user_id: number;
    package_id: number;
    provider: string;
    provider_subscription_id?: string;
    midtrans_order_id?: string;
    midtrans_transaction_id?: string;
    midtrans_payment_type?: string;
    price_cents: number;
    currency: string;
    interval: string;
    status: 'pending' | 'active' | 'expired' | 'cancelled' | 'failed';
    starts_at: string | null;
    ends_at: string | null;
    trial_ends_at: string | null;
    cancelled_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    package?: Package;
}
