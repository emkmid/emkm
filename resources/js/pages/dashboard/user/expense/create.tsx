import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import InputRupiah from '@/components/input-rupiah';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface ExpenseCategory {
    id: number;
    name: string;
}

interface PageProps {
    categories: ExpenseCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah Pengeluaran',
        href: '/dashboard/expenses/create',
    },
];

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Pengeluaran',
        href: route('expenses.index'),
    },
    {
        title: 'Tambah Pengeluaran',
        href: '',
    },
];

export default function CreateExpense({ categories }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        expense_category_id: '',
        description: '',
        amount: 0,
        date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('expenses.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengeluaran" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
                <HeadingSmall title="Tambah Pengeluaran" description="Form untuk mencatat pengeluaran baru" />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Tanggal */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="date">Tanggal</Label>
                                <Input type="date" id="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                                <InputError message={errors.date} />
                            </div>

                            {/* Kategori */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="expense_category_id">Kategori</Label>
                                <Select value={data.expense_category_id} onValueChange={(value) => setData('expense_category_id', value)}>
                                    <SelectTrigger id="expense_category_id">
                                        <SelectValue placeholder="Pilih kategori pengeluaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.expense_category_id} />
                            </div>

                            {/* Jumlah */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="amount">Jumlah</Label>
                                <InputRupiah id="amount" value={data.amount} onChange={(value: number) => setData('amount', value)} />
                                <InputError message={errors.amount} />
                            </div>

                            {/* Deskripsi */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Tulis deskripsi pengeluaran..."
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Tombol Submit */}
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
