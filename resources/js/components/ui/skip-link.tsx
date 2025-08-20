import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
    href,
    className,
    children
}) => {
    return (
        <a
            href={href}
            className={cn(
                'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
                'bg-[#23BBB7] text-white px-4 py-2 rounded-md text-sm font-medium',
                'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#23BBB7]',
                'transform transition-transform focus:translate-y-0 -translate-y-2',
                className
            )}
        >
            {children}
        </a>
    );
};
