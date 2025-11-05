import { FormEventHandler, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface Package {
    id: number;
    name: string;
    price: number;
}

interface Props {
    packages: Package[];
    categories: string[];
}

export default function Create({ packages, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        feature_key: string;
        feature_name: string;
        description: string;
        category: string;
        limit_type: 'boolean' | 'numeric' | 'list';
        sort_order: number;
        limits: Array<{
            package_id: number;
            is_enabled: boolean;
            numeric_limit: number | null;
            list_values: string | null;
        }>;
    }>({
        feature_key: '',
        feature_name: '',
        description: '',
        category: categories[0] || 'others',
        limit_type: 'boolean',
        sort_order: 999,
        limits: packages.map(pkg => ({
            package_id: pkg.id,
            is_enabled: false,
            numeric_limit: null,
            list_values: null,
        })),
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.features.store'));
    };

    const updateLimit = (packageId: number, field: string, value: any) => {
        setData('limits', data.limits.map(limit =>
            limit.package_id === packageId
                ? { ...limit, [field]: value }
                : limit
        ));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: route('admin.dashboard') },
                { title: 'Features', href: route('admin.features.index') },
                { title: 'Create', href: route('admin.features.create') },
            ]}
        >
            <Head title="Create Feature" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Create New Feature</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Tambahkan fitur baru ke sistem paket berlangganan
                        </p>
                    </div>
                    <Link href={route('admin.features.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <Card>
                <CardHeader>
                    <CardTitle>Create New Feature</CardTitle>
                    <CardDescription>
                        Add a new feature to the package system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="feature_key">Feature Key *</Label>
                                <Input
                                    id="feature_key"
                                    value={data.feature_key}
                                    onChange={e => setData('feature_key', e.target.value)}
                                    placeholder="e.g., invoices.create"
                                    required
                                />
                                {errors.feature_key && (
                                    <p className="text-sm text-red-600">{errors.feature_key}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="feature_name">Feature Name *</Label>
                                <Input
                                    id="feature_name"
                                    value={data.feature_name}
                                    onChange={e => setData('feature_name', e.target.value)}
                                    placeholder="e.g., Create Invoices"
                                    required
                                />
                                {errors.feature_name && (
                                    <p className="text-sm text-red-600">{errors.feature_name}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Feature description..."
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={data.category}
                                    onValueChange={value => setData('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="limit_type">Limit Type *</Label>
                                <Select
                                    value={data.limit_type}
                                    onValueChange={value => setData('limit_type', value as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="boolean">Boolean (On/Off)</SelectItem>
                                        <SelectItem value="numeric">Numeric (Count)</SelectItem>
                                        <SelectItem value="list">List (Values)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.limit_type && (
                                    <p className="text-sm text-red-600">{errors.limit_type}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sort_order">Sort Order</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order}
                                    onChange={e => setData('sort_order', parseInt(e.target.value))}
                                />
                                {errors.sort_order && (
                                    <p className="text-sm text-red-600">{errors.sort_order}</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-2">Limits per Package</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Atur batasan untuk setiap paket berlangganan
                            </p>
                            <div className="space-y-4">
                                {packages.map((pkg, index) => {
                                    const limit = data.limits.find(l => l.package_id === pkg.id);
                                    if (!limit) return null;

                                    return (
                                        <div key={pkg.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {pkg.price === 0 ? 'Gratis' : `Rp ${pkg.price.toLocaleString('id-ID')}/bulan`}
                                                    </p>
                                                </div>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={limit.is_enabled}
                                                        onChange={e => updateLimit(pkg.id, 'is_enabled', e.target.checked)}
                                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm font-medium">Aktifkan</span>
                                                </label>
                                            </div>

                                            {limit.is_enabled && data.limit_type === 'numeric' && (
                                                <div className="space-y-2">
                                                    <Label>Numeric Limit (-1 for unlimited)</Label>
                                                    <Input
                                                        type="number"
                                                        value={limit.numeric_limit ?? ''}
                                                        onChange={e => updateLimit(
                                                            pkg.id,
                                                            'numeric_limit',
                                                            e.target.value ? parseInt(e.target.value) : null
                                                        )}
                                                        placeholder="Enter limit or -1 for unlimited"
                                                    />
                                                </div>
                                            )}

                                            {limit.is_enabled && data.limit_type === 'list' && (
                                                <div className="space-y-2">
                                                    <Label>List Values (comma-separated)</Label>
                                                    <Input
                                                        type="text"
                                                        value={limit.list_values ?? ''}
                                                        onChange={e => updateLimit(
                                                            pkg.id,
                                                            'list_values',
                                                            e.target.value
                                                        )}
                                                        placeholder="value1,value2,value3"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Link href={route('admin.features.index')}>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Feature'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            </div>
        </AppLayout>
    );
}
