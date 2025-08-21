import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ArticleForm from './articleFormProps';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Artikel', href: '/dashboard/articles' }];

export default function Edit() {
    const { props } = usePage<{ article: any }>();
    const { article } = props;

    const breadcrumbItems: BreadcrumbItemType[] = [
        { title: 'Artikel', href: route('articles.index') },
        { title: 'Edit Artikel', href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Artikel" />
            <div className="flex flex-col gap-4 p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
                <HeadingSmall title="Edit Artikel" description="Perbarui artikel edukatif agar UMKM berkembang!" />
                <ArticleForm initialData={article} submitUrl={route('articles.update', article.id)} method="put" />
            </div>
        </AppLayout>
    );
}
