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
import { BreadcrumbItem, IncomeCategory, type BreadcrumbItemType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create({ categories }: { categories: IncomeCategory[] }) {
    const { data, setData, post, errors, processing } = useForm({
        date: new Date().toISOString().slice(0, 10),
        income_category_id: '',
        amount: 0,
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('incomes.store'));
    };

    const breadcrumbItems: BreadcrumbItemType[] = [
        {
            title: 'Pemasukan',
            href: route('incomes.index'),
        },
        {
            title: 'Tambah Pemasukan',
            href: '',
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tambah Pemasukan',
            href: '/dashboard/expenses/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pemasukan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
                <HeadingSmall title="Tambah pemasukan" description="Form untuk mencatat pemasukan baru" />

                <Card>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="date">Tanggal</Label>
                                <Input type="date" id="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                                <InputError message={errors.date} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="income_category_id">Kategori</Label>
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
                                <InputError message={errors.income_category_id} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="amount">Jumlah</Label>
                                <InputRupiah
                                    id="amount"
                                    value={data.amount}
                                    onChange={(value: number) => {
                                        setData('amount', value);
                                    }}
                                />
                                <InputError message={errors.amount} />
                            </div>

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
