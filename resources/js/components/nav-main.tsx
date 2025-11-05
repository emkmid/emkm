import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type MainNavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: MainNavItem[] }) {
    const page = usePage();
    const currentPath = page.url;
    const { auth } = page.props as any;
    const user = auth.user;
    const features = auth.features || {};

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarMenu>
                {items
                    // filter parent berdasarkan can
                    .filter((item) => !item.can || item.can(user, features))
                    .map((item) => {
                        const hasSubItems = item.subItems?.length && item.subItems.length > 0;

                        const isParentActive = hasSubItems
                            ? item.subItems?.some((sub) => currentPath.startsWith(sub.href))
                            : currentPath === item.href;

                        return hasSubItems ? (
                            <Collapsible key={item.title} asChild defaultOpen={!!isParentActive} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title} className={clsx({ 'bg-muted font-semibold': isParentActive })}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.subItems
                                                ?.filter((sub) => !sub.can || sub.can(user, features))
                                                .map((subItem) => {
                                                    const isSubActive = currentPath.startsWith(subItem.href);
                                                    return (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild className={clsx({ 'bg-muted font-semibold': isSubActive })}>
                                                                <Link href={subItem.href}>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    );
                                                })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title} className={clsx({ 'bg-muted font-semibold': isParentActive })}>
                                    <Link href={item.href || ''}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
