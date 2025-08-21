import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
import { Head } from '@inertiajs/react';
import ArticleForm from './articleFormProps';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Artikel', href: '/dashboard/articles' }];

const breadcrumbItems: BreadcrumbItemType[] = [
    { title: 'Artikel', href: route('articles.index') },
    { title: 'Tambah Artikel', href: '' },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Artikel" />
            <div className="flex flex-col gap-4 p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
                <HeadingSmall title="Tambah Artikel" description="Tambah artikel edukatif agar UMKM berkembang!" />
                <ArticleForm submitUrl={route('articles.store')} method="post" />
            </div>
        </AppLayout>
    );
}
