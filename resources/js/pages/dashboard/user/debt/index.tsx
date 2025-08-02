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

interface Debt {
    id: number;
    creditor: string;
    amount: number;
    paid_amount: number;
    due_date: string | null;
    description: string;
}

interface PageProps {
    debts: {
        data: Debt[];
        links: any[];
        [key: string]: any;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hutang',
        href: '/dashboard/debts',
    },
];

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Hutang',
        href: '',
    },
];

const MyDebts: React.FC = () => {
    const { debts, flash } = usePage<PageProps>().props;
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
            <Head title="Hutang" />
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
                    <HeadingSmall title="Hutang" description="Daftar semua hutang yang telah dicatat." />
                    <Button asChild>
                        <Link href={route('debts.create')}>Tambah Hutang</Link>
                    </Button>
                </div>

                <Card>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Jatuh Tempo</TableHead>
                                    <TableHead>Pemberi Hutang</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Dibayar</TableHead>
                                    <TableHead style={{ width: '1%' }}>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {debts.data.length > 0 ? (
                                    debts.data.map((debt) => (
                                        <TableRow key={debt.id}>
                                            <TableCell>
                                                {debt.due_date
                                                    ? new Date(debt.due_date).toLocaleDateString('id-ID', {
                                                          day: '2-digit',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      })
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>{debt.creditor}</TableCell>
                                            <TableCell>{debt.description}</TableCell>
                                            <TableCell>Rp{Number(debt.amount).toLocaleString('id-ID')}</TableCell>
                                            <TableCell>Rp{Number(debt.paid_amount).toLocaleString('id-ID')}</TableCell>
                                            <TableCell>
                                                <Button asChild className="me-2 w-fit">
                                                    <Link href={route('debts.edit', { debt: debt.id })}>Edit</Link>
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
                                                                    onClick={() => destroy(route('debts.destroy', { debt: debt.id }))}
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
                                        <TableCell colSpan={6} className="text-center text-gray-500">
                                            Belum ada hutang
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {debts.links.length > 1 && (
                    <Pagination className="mt-2 justify-end">
                        <PaginationContent>
                            {debts.links.map((link: any, i: number) => {
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
            asdsd
        </AppLayout>
    );
};

export default MyDebts;
