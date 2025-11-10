import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Artikel',
        href: route('articles.index'),
    },
];

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Artikel Edukatif',
        href: '',
    },
];

export default function ArticlePage() {
    const { articles } = usePage<{
        articles: {
            data: {
                id: number;
                title: string;
                slug: string;
                excerpt: string;
                published_at: string;
            }[];
            links: { url: string | null; label: string; active: boolean }[];
        };
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edukasi Artikel" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
                <div className="mb-3 flex items-center justify-between">
                    <HeadingSmall title="Artikel" description="Daftar Artikel yangb telah dibuat." />
                    <Button asChild>
                        <Link href={route('articles.create')}>Tambah Artikel</Link>
                    </Button>
                </div>

                {articles.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {articles.data.map((article) => (
                            <Card key={article.id}>
                                <CardHeader>
                                    <CardTitle>{article.title}</CardTitle>
                                    <CardDescription>{article.published_at}</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <p className="line-clamp-3 text-sm text-muted-foreground">{article.excerpt}</p>
                                </CardContent>

                                <CardFooter>
                                    <Button asChild>
                                        <Link href={route('articles.show', { article: article.slug })}>Lihat Detail</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <>Belum Ada Artikel :(</>
                )}
            </div>
        </AppLayout>
    );
}
