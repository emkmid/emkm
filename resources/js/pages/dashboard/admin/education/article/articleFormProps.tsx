import InputError from '@/components/input-error';
import TrixEditor from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router, useForm } from '@inertiajs/react';
import React from 'react';

interface ArticleFormProps {
    initialData?: {
        id?: number;
        title?: string;
        excerpt?: string;
        content_html?: string;
        published_at?: string;
        thumbnail_path?: string | null;
    };
    submitUrl: string;
    method?: 'post' | 'put' | 'patch';
}

export default function ArticleForm({ initialData = {}, submitUrl, method = 'post' }: ArticleFormProps) {
    const { data, setData, errors, processing, post, put } = useForm({
        title: initialData.title || '',
        excerpt: initialData.excerpt || '',
        content_html: initialData.content_html || '',
        published_at: initialData.published_at || '',
        thumbnail_path: null as File | null,
    });

    const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(
        initialData.thumbnail_path ? `/storage/${initialData.thumbnail_path}` : null,
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            submitUrl,
            {
                ...data,
                _method: method.toUpperCase(),
            },
            {
                forceFormData: true,
            },
        );
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail_path', file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
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
                            <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                {thumbnailPreview ? (
                                    <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-full w-full rounded-lg object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                                        <p>Click to upload or drag and drop</p>
                                    </div>
                                )}
                                <input id="thumbnail_path" name="thumbnail_path" type="file" className="hidden" onChange={handleThumbnailChange} />
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
    );
}
