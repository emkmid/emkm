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

interface Receivable {
    id: number;
    debtor: string;
    amount: number;
    paid_amount: number;
    due_date: string | null;
    description: string | null;
}

interface EditreceivablePageProps extends PageProps {
    receivable: Receivable;
}

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Piutang',
        href: route('receivables.index'),
    },
    {
        title: 'Edit Piutang',
        href: '',
    },
];

export default function Editreceivable({ receivable }: EditreceivablePageProps) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Edit Piutang', href: `/dashboard/receivables/${receivable.id}/edit` }];

    const { data, setData, put, processing, errors } = useForm({
        debtor: receivable.debtor,
        amount: receivable.amount,
        paid_amount: receivable.paid_amount,
        due_date: receivable.due_date ?? '',
        description: receivable.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('receivables.update', receivable.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Piutang" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                <HeadingSmall title="Edit Piutang" description="Perbarui data Piutang yang sudah ada." />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama Pemberi Piutang */}
                            <div>
                                <Label htmlFor="debtor">Nama Pemberi Piutang</Label>
                                <Input id="debtor" value={data.debtor} onChange={(e) => setData('debtor', e.target.value)} />
                                {errors.debtor && <p className="mt-1 text-sm text-red-500">{errors.debtor}</p>}
                            </div>

                            {/* Jumlah Piutang */}
                            <div>
                                <Label htmlFor="amount">Jumlah Piutang (Rp)</Label>
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
                                    {processing ? 'Memperbarui...' : 'Perbarui Piutang'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
