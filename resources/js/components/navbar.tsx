import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import AppLogo from './app-logo';

interface NavbarProps {
    auth?: any;
    className?: string;
    children?: ReactNode;
}

export function Navbar({ auth, className, children }: NavbarProps) {
    return (
        <header className={cn('w-full border-b border-border text-foreground', className)}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-primary">
                    <img src="/images/emkm.png" className="h-7 w-auto" alt="E-MKM" />
                </Link>

                {/* Menu + Actions */}
                <div className="flex items-center gap-4">
                    {/* Menu */}
                    <NavigationMenu>
                        <NavigationMenuList className="gap-4">
                            {children && (
                                <>
                                    {/** Mapping children jadi NavigationMenuItem */}
                                    {Array.isArray(children) ? (
                                        children.map((child, idx) => (
                                            <NavigationMenuItem key={idx}>
                                                <NavigationMenuLink asChild>{child}</NavigationMenuLink>
                                            </NavigationMenuItem>
                                        ))
                                    ) : (
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>{children}</NavigationMenuLink>
                                        </NavigationMenuItem>
                                    )}
                                </>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Theme Toggle */}
                    {/* <ThemeToggle /> */}

                    {/* CTA Button */}
                    <Button asChild variant="blue">
                        <Link href={route(auth?.user ? 'dashboard' : 'register')}>{auth?.user ? 'Dashboard' : 'Get Started'}</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
