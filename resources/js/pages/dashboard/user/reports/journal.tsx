import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BreadcrumbItemType } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircleIcon } from 'lucide-react';

interface JournalEntry {
    id: number;
    type: 'debit' | 'credit';
    amount: number;
    account: {
        id: number;
        code: string;
        name: string;
        type: string;
    };
}

interface Journal {
    id: number;
    date: string;
    description: string;
    user: { id: number; name: string };
    entries: JournalEntry[];
}

interface PageProps {
    journals: {
        data: Journal[];
        links: { url: string | null; label: string; active: boolean }[];
        [key: string]: any;
    };
    flash?: {
        success?: string;
    };
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Jurnal Umum', href: '/dashboard/reports/journal' }];

const breadcrumbItems: BreadcrumbItemType[] = [{ title: 'Jurnal Umum', href: '' }];

export default function JournalPage() {
    const { journals, flash } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jurnal Umum" />
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

                <HeadingSmall title="Jurnal Umum" description="Laporan jurnal umum" />

                <Card>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Akun</TableHead>
                                    <TableHead>Debit</TableHead>
                                    <TableHead>Kredit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {journals.data.length > 0 ? (
                                    journals.data.map((journal) =>
                                        journal.entries.map((entry, idx) => (
                                            <TableRow key={`${journal.id}-${idx}`}>
                                                {idx === 0 && (
                                                    <>
                                                        <TableCell rowSpan={journal.entries.length}>
                                                            {new Date(journal.date).toLocaleDateString('id-ID', {
                                                                day: '2-digit',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </TableCell>
                                                        <TableCell rowSpan={journal.entries.length}>{journal.description}</TableCell>
                                                    </>
                                                )}
                                                <TableCell>
                                                    {entry.account.code} - {entry.account.name}
                                                </TableCell>
                                                <TableCell>
                                                    {entry.type === 'debit' ? `Rp${Number(entry.amount).toLocaleString('id-ID')}` : ''}
                                                </TableCell>
                                                <TableCell>
                                                    {entry.type === 'credit' ? `Rp${Number(entry.amount).toLocaleString('id-ID')}` : ''}
                                                </TableCell>
                                            </TableRow>
                                        )),
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500">
                                            Belum ada data jurnal
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {journals.links.length > 1 && (
                    <Pagination className="mt-2 justify-end">
                        <PaginationContent>
                            {journals.links.map((link, i) => {
                                const isPrev = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');

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
                                            isActive={link.active}
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
}
