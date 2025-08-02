import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import InputRupiah from '@/components/input-rupiah';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface ProductCategory {
    id: number;
    name: string;
}

interface PageProps {
    categories: ProductCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah Produk',
        href: '/dashboard/products/create',
    },
];

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Produk',
        href: route('products.index'),
    },
    {
        title: 'Tambah Produk',
        href: '',
    },
];

export default function CreateProduct({ categories }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        product_category_id: '',
        name: '',
        price: 0,
        stock: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Produk" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                <HeadingSmall title="Tambah Produk" description="Form untuk menambah produk baru" />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="product_category_id">Kategori</Label>
                                <Select value={data.product_category_id} onValueChange={(value) => setData('product_category_id', value)}>
                                    <SelectTrigger id="product_category_id">
                                        <SelectValue placeholder="Pilih kategori produk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.product_category_id} />
                            </div>

                            <div>
                                <Label htmlFor="name">Nama Produk</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="price">Harga</Label>
                                <InputRupiah id="price" value={data.price} onChange={(val) => setData('price', val)} />
                                <InputError message={errors.price} />
                            </div>

                            <div>
                                <Label htmlFor="stock">Stok</Label>
                                <Input id="stock" type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} />
                                <InputError message={errors.stock} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Simpan Produk
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
