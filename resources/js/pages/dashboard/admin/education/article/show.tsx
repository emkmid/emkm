import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
    thumbnail_url: string | null;
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
                    <div className="flex gap-2">
                        <Button asChild className="mt-4 md:mt-0">
                            <Link href={route('articles.edit', { article: article.slug })}>Edit Artikel</Link>
                        </Button>

                        <Button asChild className="mt-4 md:mt-0">
                            <Link href={route('articles.index')}>Kembali ke Daftar</Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <h1 className="mb-2 text-3xl">{article.title}</h1>
                        {/* Tampilkan gambar thumbnail jika ada */}
                        {article.thumbnail_url && (
                            <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                className="mb-4 h-auto w-full rounded-md object-cover"
                            />
                        )}
                    </CardHeader>
                    <CardContent>
                        {/* Tampilkan konten artikel */}
                        <div
                            className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: article.content_html }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
