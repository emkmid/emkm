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

interface Expense {
    id: number;
    description: string;
    amount: number;
    date: string;
    expense_category: {
        name: string;
    };
}

interface PageProps {
    expenses: Expense[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengeluaran',
        href: '/dashboard/expenses',
    },
];

const MyExpenses: React.FC = () => {
    const { expenses, flash } = usePage<PageProps>().props;
    const [localFlash, setLocalFlash] = React.useState(flash);

    const { processing, delete: destroy } = useForm();

    React.useEffect(() => {
        if (flash?.success || flash?.error) {
            const timeout = setTimeout(() => {
                setLocalFlash({});
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengeluaran" />

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

                {flash?.error && (
                    <Alert
                        variant="destructive"
                        className="border-red-300 bg-red-100 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200"
                    >
                        <CheckCircleIcon className="h-4 w-4" />
                        <AlertTitle>Gagal</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Pengeluaran Saya</h3>
                    <Button asChild>
                        <Link href={route('expenses.create')}>Tambah Pengeluaran</Link>
                    </Button>
                </div>

                <Card>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead style={{ width: '1%' }}>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.length > 0 ? (
                                    expenses.map((expense) => (
                                        <TableRow>
                                            <TableCell>{expense.expense_category.name}</TableCell>
                                            <TableCell>{expense.description}</TableCell>
                                            <TableCell>Rp{Number(expense.amount).toLocaleString('id-ID')}</TableCell>
                                            <TableCell>{expense.date}</TableCell>
                                            <TableCell>
                                                <Button asChild className="me-2 w-fit">
                                                    <Link href={route('expenses.edit', { expense: expense.id })}>Edit</Link>
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
                                                                Data akan dihapus secara permanen dan tidak bisa dikembalikan.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction asChild>
                                                                <Button
                                                                    disabled={processing}
                                                                    onClick={() => destroy(route('expenses.destroy', { expense: expense.id }))}
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
                                            Belum ada pengeluaran
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

export default MyExpenses;
