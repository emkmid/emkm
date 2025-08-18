import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
    auth?: any;
    className?: string;
    children?: React.ReactNode;
}

export function Navbar({ auth, className, children }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className={cn('w-full bg-sky-100 text-foreground', className)}>
            <div className="container mx-auto flex h-16 items-center justify-between px-5">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                    <img src="/images/emkm.png" className="h-7 w-auto" alt="E-MKM" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-4 md:flex">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList>{children}</NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Hamburger */}
                <button className="rounded-md p-2 text-gray-600 hover:bg-gray-200 md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {/* Mobile Menu */}
            {isOpen && (
                <div className="w-full bg-sky-100 px-5 py-2 md:hidden">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList className="flex flex-col items-start gap-2 text-left">{children}</NavigationMenuList>
                    </NavigationMenu>
                </div>
            )}
        </header>
    );
}
