import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

// Definisikan tipe untuk kategori pemasukan
interface IncomeCategory {
    id: number;
    name: string;
}

// Definisikan tipe untuk props halaman ini
interface CreateIncomePageProps extends PageProps {
    categories: IncomeCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pemasukan',
        href: '/dashboard/incomes',
    },
    {
        title: 'Tambah',
        href: '/dashboard/incomes/create',
    },
];

export default function CreateIncome({ categories }: CreateIncomePageProps) {
    // Inisialisasi form dengan useForm dari Inertia
    const { data, setData, post, processing, errors } = useForm({
        income_category_id: '',
        description: '',
        amount: '',
        date: '',
    });

    // Fungsi untuk menangani submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('incomes.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pemasukan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <HeadingSmall title="Tambah Pemasukan Baru" description="Isi form di bawah untuk mencatat pemasukan." />

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input Kategori */}
                            <div>
                                <Label htmlFor="income_category_id">Kategori Pemasukan</Label>
                                {/* PERBAIKAN DI SINI:
                                    Gunakan onValueChange untuk memanggil setData dan memperbarui state 'income_category_id'.
                                    Setiap kali user memilih opsi, 'value' yang berisi ID kategori akan disimpan ke dalam state 'data'.
                                */}
                                <Select onValueChange={(value) => setData('income_category_id', value)}>
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
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Contoh: Penjualan produk A"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>

                            {/* Input Jumlah */}
                            <div>
                                <Label htmlFor="amount">Jumlah (Rp)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="Contoh: 50000"
                                />
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
                                    {processing ? 'Menyimpan...' : 'Simpan Pemasukan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
