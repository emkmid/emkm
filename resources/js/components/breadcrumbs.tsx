import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from '@inertiajs/react';
import React from 'react'; // Impor React

export type BreadcrumbItemType = {
    label: string;
    url?: string;
};

type BreadcrumbsProps = {
    breadcrumbs: BreadcrumbItemType[];
};

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
    return (
        <Breadcrumb className='mb-4'>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    // PERBAIKAN: Tambahkan 'key' unik ke elemen terluar di dalam map.
                    <React.Fragment key={breadcrumb.label}>
                        <BreadcrumbItem>
                            {breadcrumb.url ? (
                                <BreadcrumbLink asChild>
                                    <Link href={breadcrumb.url}>{breadcrumb.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                breadcrumb.label
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
