import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
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
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const MyExpenses: React.FC = () => {
    const { expenses } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                                    <TableHead>Aksi</TableHead>
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
                                                <Button asChild>
                                                    <Link href={route('expenses.create')}>Tambah Pengeluaran</Link>
                                                </Button>
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
