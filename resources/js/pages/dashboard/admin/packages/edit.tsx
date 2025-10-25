import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItemType } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    features: string[];
    is_active: boolean;
}

interface EditPackagePageProps {
    pkg: Package;
}

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Kelola Paket Layanan',
        href: route('packages.index'),
    },
    {
        title: 'Edit Paket',
        href: '',
    },
];

export default function EditPackage({ pkg }: EditPackagePageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: pkg.name,
        description: pkg.description,
        price: pkg.price.toString(),
        features: pkg.features || [],
        is_active: pkg.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('packages.update', pkg.id));
    };

    const handleFeatureChange = (feature: string, checked: boolean) => {
        if (checked) {
            setData('features', [...data.features, feature]);
        } else {
            setData('features', data.features.filter((f: string) => f !== feature));
        }
    };

    return (
        <AppLayout>
            <Head title="Edit Paket Layanan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
                <HeadingSmall title="Edit Paket Layanan" description="Perbarui data paket layanan" />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Nama */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Nama Paket</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masukkan nama paket"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Deskripsi */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Masukkan deskripsi paket"
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Harga */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="price">Harga</Label>
                                <Input
                                    type="number"
                                    id="price"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="Masukkan harga paket"
                                />
                                <InputError message={errors.price} />
                            </div>

                            {/* Fitur */}
                            <div className="flex flex-col gap-2">
                                <Label>Fitur</Label>
                                <div className="flex flex-col gap-2">
                                    {['Dashboard Premium', 'Laporan Lanjutan', 'Dukungan Prioritas'].map((feature) => (
                                        <div key={feature} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={feature}
                                                checked={data.features.includes(feature)}
                                                onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                                            />
                                            <Label htmlFor={feature}>{feature}</Label>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.features} />
                            </div>

                            {/* Status Aktif */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="is_active">Aktif</Label>
                            </div>

                            {/* Tombol Submit */}
                            <div className="flex justify-end gap-2">
                                <Link href={route('packages.index')}>
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memperbarui...' : 'Perbarui'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}