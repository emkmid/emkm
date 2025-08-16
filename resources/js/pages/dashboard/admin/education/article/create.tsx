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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Artikel',
        href: '/dashboard/articles',
    },
];

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Artikel',
        href: route('articles.index'),
    },
    {
        title: 'Tambah Artikel',
        href: '',
    },
];

export default function Create() {
    // Memperbaiki deklarasi tipe data agar thumbnail bisa menerima `File` atau `null`.
    const { post, processing, errors, setData, data } = useForm<{
        title: string;
        excerpt: string;
        content_html: string;
        published_at: string;
        thumbnail_path: File | null;
    }>({
        title: '',
        excerpt: '',
        content_html: '',
        published_at: '',
        thumbnail_path: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('articles.store'));
    };

    const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(null);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail_path', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setData('thumbnail_path', null);
            setThumbnailPreview(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Artikel" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                <HeadingSmall title="Tambah Artikel" description="Tambah artikel edukatif agar umkm berkembang!" />

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

                            {/* Bagian Thumbnail */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <div className="flex w-full items-center justify-center">
                                    <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:bg-gray-800">
                                        {/* Menampilkan preview jika ada, jika tidak, tampilkan placeholder SVG */}
                                        {thumbnailPreview ? (
                                            <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-full w-full rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg
                                                    className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. 2MB)</p>
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
