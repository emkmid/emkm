import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import InputRupiah from '@/components/input-rupiah';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah Hutang',
        href: '/dashboard/debts/create',
    },
];

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Hutang',
        href: route('debts.index'),
    },
    {
        title: 'Tambah Hutang',
        href: '',
    },
];

export default function CreateDebt() {
    const { data, setData, post, processing, errors } = useForm({
        creditor: '',
        amount: 0,
        paid_amount: 0,
        due_date: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('debts.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Hutang" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
                <HeadingSmall title="Tambah Hutang" description="Form untuk mencatat hutang baru" />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Nama Pemberi Hutang */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="creditor">Nama Pemberi Hutang</Label>
                                <Input id="creditor" value={data.creditor} onChange={(e) => setData('creditor', e.target.value)} />
                                <InputError message={errors.creditor} />
                            </div>

                            {/* Total Hutang */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="amount">Jumlah Hutang</Label>
                                <InputRupiah id="amount" value={data.amount} onChange={(val) => setData('amount', val)} />
                                <InputError message={errors.amount} />
                            </div>

                            {/* Jumlah yang Sudah Dibayar */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="paid_amount">Sudah Dibayar</Label>
                                <InputRupiah id="paid_amount" value={data.paid_amount} onChange={(val) => setData('paid_amount', val)} />
                                <InputError message={errors.paid_amount} />
                            </div>

                            {/* Tanggal Jatuh Tempo */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="due_date">Tanggal Jatuh Tempo</Label>
                                <Input type="date" id="due_date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                                <InputError message={errors.due_date} />
                            </div>

                            {/* Deskripsi */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Tulis keterangan hutang..."
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
