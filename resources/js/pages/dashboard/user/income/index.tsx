import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
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
    incomes: {
        data: Income[];
        [key: string]: any;
    };
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

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Pemasukan',
        href: '',
    },
];

const MyIncomes: React.FC = () => {
    const { incomes, flash } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemasukan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

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
                    <HeadingSmall title="Pemasukan" description="Daftar semua transaksi pemasukan yang telah dicatat." />
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
                                {incomes.data.length > 0 ? (
                                    incomes.data.map((income: any) => (
                                        <TableRow key={income.id}>
                                            <TableCell>
                                                {new Date(income.date).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
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
                                                            <AlertDialogDescription>Data akan dihapus secara permanen.</AlertDialogDescription>
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

                {incomes.links.length > 1 && (
                    <Pagination className="mt-2 justify-end">
                        <PaginationContent>
                            {incomes.links.map((link: any, i: number) => {
                                const isPrev = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');
                                const isActive = link.active;

                                if (isPrev) {
                                    return (
                                        <PaginationItem key={i}>
                                            <PaginationPrevious
                                                href={link.url ?? '#'}
                                                className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                    );
                                }

                                if (isNext) {
                                    return (
                                        <PaginationItem key={i}>
                                            <PaginationNext href={link.url ?? '#'} className={!link.url ? 'pointer-events-none opacity-50' : ''} />
                                        </PaginationItem>
                                    );
                                }

                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href={link.url ?? '#'}
                                            isActive={isActive}
                                            className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </AppLayout>
    );
};

export default MyIncomes;
