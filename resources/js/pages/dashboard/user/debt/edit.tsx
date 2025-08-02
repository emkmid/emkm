import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import InputRupiah from '@/components/input-rupiah';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface Debt {
    id: number;
    creditor: string;
    amount: number;
    paid_amount: number;
    due_date: string | null;
    description: string | null;
}

interface EditDebtPageProps extends PageProps {
    debt: Debt;
}

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Hutang',
        href: route('debts.index'),
    },
    {
        title: 'Edit Hutang',
        href: '',
    },
];

export default function EditDebt({ debt }: EditDebtPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Edit Hutang', href: `/dashboard/debts/${debt.id}/edit` }];

    const { data, setData, put, processing, errors } = useForm({
        creditor: debt.creditor,
        amount: debt.amount,
        paid_amount: debt.paid_amount,
        due_date: debt.due_date ?? '',
        description: debt.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('debts.update', debt.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Hutang" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                <HeadingSmall title="Edit Hutang" description="Perbarui data hutang yang sudah ada." />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama Pemberi Hutang */}
                            <div>
                                <Label htmlFor="creditor">Nama Pemberi Hutang</Label>
                                <Input id="creditor" value={data.creditor} onChange={(e) => setData('creditor', e.target.value)} />
                                {errors.creditor && <p className="mt-1 text-sm text-red-500">{errors.creditor}</p>}
                            </div>

                            {/* Jumlah Hutang */}
                            <div>
                                <Label htmlFor="amount">Jumlah Hutang (Rp)</Label>
                                <InputRupiah id="amount" value={data.amount} onChange={(val) => setData('amount', val)} />
                                {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                            </div>

                            {/* Jumlah yang Sudah Dibayar */}
                            <div>
                                <Label htmlFor="paid_amount">Jumlah Dibayar (Rp)</Label>
                                <InputRupiah id="paid_amount" value={data.paid_amount} onChange={(val) => setData('paid_amount', val)} />
                                {errors.paid_amount && <p className="mt-1 text-sm text-red-500">{errors.paid_amount}</p>}
                            </div>

                            {/* Tanggal Jatuh Tempo */}
                            <div>
                                <Label htmlFor="due_date">Tanggal Jatuh Tempo</Label>
                                <Input id="due_date" type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                                {errors.due_date && <p className="mt-1 text-sm text-red-500">{errors.due_date}</p>}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>

                            {/* Tombol Simpan */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memperbarui...' : 'Perbarui Hutang'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
