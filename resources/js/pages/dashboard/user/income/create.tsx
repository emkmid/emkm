    import AppLayout from '@/layouts/app-layout';
    import { Breadcrumbs, BreadcrumbItemType } from '@/components/breadcrumbs';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Head, useForm } from '@inertiajs/react';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';
    import InputError from '@/components/input-error';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Button } from '@/components/ui/button';
    import { FormEventHandler } from 'react';
    import { IncomeCategory } from '@/types';
    import InputRupiah from '@/components/input-rupiah';

    export default function Create({ categories }: { categories: IncomeCategory[] }) {
        const { data, setData, post, errors, processing } = useForm({
            date: new Date().toISOString().slice(0, 10),
            income_category_id: '',
            amount: 0,
            description: '',
        });

        const submit: FormEventHandler = (e) => {
            e.preventDefault();
            // PERBAIKAN: Gunakan nama rute yang benar 'incomes.store' (tanpa 'user.')
            post(route('incomes.store'));
        };

        const breadcrumbItems: BreadcrumbItemType[] = [
            {
                label: 'Dashboard',
                url: route('dashboard'),
            },
            {
                label: 'Pemasukan',
                // PERBAIKAN: Gunakan nama rute yang benar 'incomes.index' (tanpa 'user.')
                url: route('incomes.index'),
            },
            {
                label: 'Tambah Pemasukan',
            },
        ];

        return (
            <>
                <Head title='Tambah Pemasukan' />
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Pemasukan</CardTitle>
                        <CardDescription>Tambah data pemasukan anda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='date'>Tanggal</Label>
                                <Input
                                    type='date'
                                    id='date'
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                                <InputError message={errors.date} />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='income_category_id'>Kategori</Label>
                                <Select
                                    value={data.income_category_id}
                                    onValueChange={(value) => setData('income_category_id', value)}
                                >
                                    <SelectTrigger id='income_category_id'>
                                        <SelectValue placeholder='Pilih kategori' />
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

                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='amount'>Jumlah</Label>
                                <InputRupiah
                                    id='amount'
                                    value={data.amount}
                                    onChange={(value: number) => {
                                        setData('amount', value);
                                    }}
                                />
                                <InputError message={errors.amount} />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='description'>Deskripsi</Label>
                                <Input
                                    id='description'
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <Button type='submit' disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </>
        );
    }

    Create.layout = (page: any) => <AppLayout children={page} />;
    