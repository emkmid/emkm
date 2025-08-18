import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import TrixEditor from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface EditProps {
    article: {
        id: number;
        title: string;
        excerpt: string;
        content_html: string;
        published_at: string;
        thumbnail_path: string | null;
        slug: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Artikel', href: '/dashboard/articles' }];

export default function Edit({ article }: EditProps) {
    const breadcrumbItems: BreadcrumbItemType[] = [
        { title: 'Artikel', href: route('articles.index') },
        { title: 'Edit Artikel', href: '' },
    ];

    const { data, setData, put, processing, errors } = useForm<{
        title: string;
        excerpt: string;
        content_html: string;
        published_at: string;
        thumbnail_path: File | null;
    }>({
        title: article.title,
        excerpt: article.excerpt,
        content_html: article.content_html,
        published_at: article.published_at,
        thumbnail_path: null,
    });

    const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(
        article.thumbnail_path ? `/storage/${article.thumbnail_path}` : null,
    );

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail_path', file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setData('thumbnail_path', null);
            setThumbnailPreview(article.thumbnail_path ? `/storage/${article.thumbnail_path}` : null);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('articles.update', article.slug));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Artikel" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                <HeadingSmall title="Edit Artikel" description="Perbarui artikel edukatif agar UMKM tetap berkembang!" />

                <Card>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 md:flex-row">
                                <div className="flex-1">
                                    <Label htmlFor="title">Judul</Label>
                                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="published_at">Publikasi</Label>
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at || ''}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                    />
                                    <InputError message={errors.published_at} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="excerpt">Ringkasan</Label>
                                <Input id="excerpt" value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} />
                                <InputError message={errors.excerpt} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Konten</Label>
                                <TrixEditor
                                    id="article-content"
                                    value={data.content_html}
                                    onChange={(html) => setData('content_html', html)}
                                    uploadUrl={route('articles.upload')}
                                />
                                <InputError message={errors.content_html} />
                            </div>

                            {/* Thumbnail */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <div className="flex w-full items-center justify-center">
                                    <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:bg-gray-800">
                                        {thumbnailPreview ? (
                                            <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-full w-full rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                                            </div>
                                        )}
                                        <input
                                            id="thumbnail_path"
                                            name="thumbnail_path"
                                            type="file"
                                            className="hidden"
                                            onChange={handleThumbnailChange}
                                        />
                                    </label>
                                </div>
                                <InputError message={errors.thumbnail_path} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
