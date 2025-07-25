import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
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

export default function CreateExpense({ categories }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        expense_category_id: '',
        description: '',
        amount: '',
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
                <HeadingSmall title="Tambah Pengeluaran" description="Form untuk mencatat pengeluaran baru" />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Kategori */}
                            <div>
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
                                {errors.expense_category_id && <p className="text-sm text-red-500">{errors.expense_category_id}</p>}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            {/* Jumlah */}
                            <div>
                                <Label htmlFor="amount">Jumlah</Label>
                                <Input id="amount" type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} />
                                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                            </div>

                            {/* Tanggal */}
                            <div>
                                <Label htmlFor="date">Tanggal</Label>
                                <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                            </div>

                            {/* Tombol Submit */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Simpan Pengeluaran
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
