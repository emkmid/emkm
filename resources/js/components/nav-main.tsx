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
import { Link, usePage } from '@inertiajs/react'; // Pastikan Link sudah diimpor
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: MainNavItem[] }) {
    const page = usePage();
    const currentUrl = page.url;

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isParentActive = item.href
                        ? currentUrl.startsWith(item.href)
                        : item.subItems?.some((sub) => currentUrl.startsWith(sub.href));

                    return item.subItems && item.subItems.length > 0 ? (
                        <Collapsible key={item.title} asChild defaultOpen={isParentActive} className="group/collapsible">
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
                                        {item.subItems.map((subItem) => {
                                            const isSubActive = currentUrl === subItem.href;
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild className={clsx({ 'bg-muted font-semibold': isSubActive })}>
                                                        {/* Menggunakan Link dari Inertia */}
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
