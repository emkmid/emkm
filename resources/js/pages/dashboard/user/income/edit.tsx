import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import InputRupiah from '@/components/input-rupiah';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

// Definisikan tipe untuk kategori dan pemasukan
interface IncomeCategory {
    id: number;
    name: string;
}

interface Income {
    id: number;
    income_category_id: number;
    description: string;
    amount: number;
    date: string;
}

// Definisikan tipe untuk props halaman ini
interface EditIncomePageProps extends PageProps {
    categories: IncomeCategory[];
    income: Income;
}

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Pemasukan',
        href: route('incomes.index'),
    },
    {
        title: 'Edit Pemasukan',
        href: '',
    },
];

export default function EditIncome({ categories, income }: EditIncomePageProps) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Edit Pemasukan', href: `/dashboard/incomes/${income.id}/edit` }];

    const { data, setData, put, processing, errors } = useForm({
        income_category_id: String(income.income_category_id),
        description: income.description,
        amount: income.amount,
        date: income.date,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('incomes.update', income.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Pemasukan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                <HeadingSmall title="Edit Pemasukan" description="Perbarui data pemasukan yang sudah ada." />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input Kategori */}
                            <div>
                                <Label htmlFor="income_category_id">Kategori Pemasukan</Label>
                                <Select value={data.income_category_id} onValueChange={(value) => setData('income_category_id', value)}>
                                    <SelectTrigger id="income_category_id">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.income_category_id && <p className="mt-1 text-sm text-red-500">{errors.income_category_id}</p>}
                            </div>

                            {/* Input Deskripsi */}
                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>

                            {/* Input Jumlah */}
                            <div>
                                <Label htmlFor="amount">Jumlah (Rp)</Label>
                                <InputRupiah id="amount" value={data.amount} onChange={(val) => setData('amount', val)} />
                                {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                            </div>

                            {/* Input Tanggal */}
                            <div>
                                <Label htmlFor="date">Tanggal</Label>
                                <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                            </div>

                            {/* Tombol Simpan */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memperbarui...' : 'Perbarui Pemasukan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
