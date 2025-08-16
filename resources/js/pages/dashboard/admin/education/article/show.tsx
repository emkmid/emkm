import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface ArticleProps {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content_html: string;
    published_at: string;
    thumbnail_path: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Artikel',
        href: route('articles.index'),
    },
];

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Artikel Edukatif',
        href: route('articles.index'),
    },
    {
        title: 'Detail Artikel',
        href: '',
    },
];

export default function ArticleShowPage() {
    const { article } = usePage<{ article: ArticleProps }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={article.title} />

            <div className="p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <HeadingSmall title={article.title} description={`Diterbitkan pada: ${article.published_at}`} />
                    <Button asChild className="mt-4 md:mt-0">
                        <Link href={route('articles.index')}>Kembali ke Daftar</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        {/* Tampilkan gambar thumbnail jika ada */}
                        {article.thumbnail_path && (
                            <img
                                src={`/storage/${article.thumbnail_path}`}
                                alt={article.title}
                                className="mb-4 h-auto w-full rounded-md object-cover"
                            />
                        )}
                        <CardTitle>{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Tampilkan konten artikel */}
                        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content_html }} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
