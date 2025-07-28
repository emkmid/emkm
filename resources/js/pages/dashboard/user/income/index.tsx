import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircleIcon } from 'lucide-react';
import React from 'react';

interface Income {
    id: number;
    description: string;
    amount: number;
    date: string;
    income_category: {
        name: string;
    };
}

interface PageProps {
    incomes: Income[];
    flash?: {
        success?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pemasukan',
        href: '/dashboard/incomes',
    },
];

const MyIncomes: React.FC = () => {
    const { incomes, flash } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemasukan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {flash?.success && (
                    <Alert
                        variant="default"
                        className="border-green-300 bg-green-100 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-200"
                    >
                        <CheckCircleIcon className="h-4 w-4" />
                        <AlertTitle>Berhasil</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Data Pemasukan</h3>
                    <Button asChild>
                        <Link href={route('incomes.create')}>Tambah Pemasukan</Link>
                    </Button>
                </div>

                <Card>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead style={{ width: '1%' }}>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incomes.length > 0 ? (
                                    incomes.map((income) => (
                                        <TableRow key={income.id}>
                                            <TableCell>{new Date(income.date).toLocaleDateString('id-ID')}</TableCell>
                                            <TableCell>{income.income_category.name}</TableCell>
                                            <TableCell>{income.description}</TableCell>
                                            <TableCell>Rp{Number(income.amount).toLocaleString('id-ID')}</TableCell>
                                            <TableCell>
                                                <Button asChild className="me-2 w-fit">
                                                    <Link href={route('incomes.edit', { income: income.id })}>Edit</Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" className="w-fit">
                                                            Hapus
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Data akan dihapus secara permanen.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction asChild>
                                                                <Button
                                                                    disabled={processing}
                                                                    onClick={() => destroy(route('incomes.destroy', { income: income.id }))}
                                                                >
                                                                    {processing ? 'Menghapus...' : 'Ya, hapus'}
                                                                </Button>
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500">
                                            Belum ada data pemasukan
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default MyIncomes;
