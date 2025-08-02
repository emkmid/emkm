import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import InputRupiah from '@/components/input-rupiah';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface ExpenseCategory {
    id: number;
    name: string;
}

interface Expense {
    id: number;
    expense_category_id: number;
    description: string;
    amount: number;
    date: string;
}

interface EditExpensePageProps extends PageProps {
    categories: ExpenseCategory[];
    expense: Expense;
}

export default function EditExpense({ categories, expense }: EditExpensePageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pengeluaran', href: '/dashboard/expenses' },
        { title: 'Edit', href: `/dashboard/expenses/${expense.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        expense_category_id: String(expense.expense_category_id),
        description: expense.description,
        amount: expense.amount,
        date: new Date(expense.date).toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('expenses.update', expense.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Pengeluaran" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <HeadingSmall title="Edit Pengeluaran" description="Perbarui data pengeluaran yang sudah ada." />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Kategori Pengeluaran */}
                            <div>
                                <Label htmlFor="expense_category_id">Kategori Pengeluaran</Label>
                                <Select value={data.expense_category_id} onValueChange={(value) => setData('expense_category_id', value)}>
                                    <SelectTrigger id="expense_category_id">
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
                                <InputError message={errors.expense_category_id} />
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
                            </div>

                            {/* Jumlah */}
                            <div>
                                <Label htmlFor="amount">Jumlah (Rp)</Label>
                                <InputRupiah id="amount" value={data.amount} onChange={(val) => setData('amount', val)} />
                                <InputError message={errors.amount} />
                            </div>

                            {/* Tanggal */}
                            <div>
                                <Label htmlFor="date">Tanggal</Label>
                                <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                                <InputError message={errors.date} />
                            </div>

                            {/* Tombol Submit */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memperbarui...' : 'Perbarui Pengeluaran'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
