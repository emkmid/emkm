// import { Breadcrumbs } from '@/components/breadcrumbs';
// import HeadingSmall from '@/components/heading-small';
// import AppLayout from '@/layouts/app-layout';
// import { BreadcrumbItemType } from '@/types';
// import { Head, usePage } from '@inertiajs/react';

// interface Account {
//     id: number;
//     code: string;
//     name: string;
//     type: string;
//     debit: number;
//     credit: number;
//     balance: number;
// }

// const breadcrumbItems: BreadcrumbItemType[] = [{ title: 'Neraca Saldo', href: '' }];

// export default function TrialBalance() {
//     const { accounts, filters } = usePage<{ accounts: Account; filters: any }>().props;

//     return (
//         <AppLayout>
//             <Head title="Neraca Saldo" />

//             <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
//                 <Breadcrumbs breadcrumbs={breadcrumbItems} />

//                 <div>
//                     <HeadingSmall title="Neraca Saldo" description="Laporan Neraca Saldo" />
//                     <div className="mt-1 h-px bg-gray-200 dark:bg-gray-700"></div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }

import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItemType } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Account {
    id: number;
    code: string;
    name: string;
    type: string;
    debit: number;
    credit: number;
    balance: number;
}

const breadcrumbItems: BreadcrumbItemType[] = [
    { title: 'Laporan', href: '/reports' },
    { title: 'Neraca Saldo', href: '' },
];

export default function TrialBalance() {
    const { accounts, filters } = usePage<{
        accounts: Account[];
        filters: { start_date?: string; end_date?: string };
    }>().props;

    // local state filter
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const applyFilter = () => {
        router.get(
            route('reports.trial-balance'), // pastikan route ini sesuai
            { start_date: startDate, end_date: endDate },
            { preserveState: true },
        );
    };

    const totalDebit = accounts.reduce((sum, a) => sum + a.debit, 0);
    const totalCredit = accounts.reduce((sum, a) => sum + a.credit, 0);

    return (
        <AppLayout>
            <Head title="Neraca Saldo" />

            <div className="flex flex-col gap-6 p-4">
                {/* Breadcrumbs */}
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                {/* Heading */}
                <div>
                    <HeadingSmall title="Neraca Saldo" description="Ringkasan saldo per akun (total debit dan kredit)." />
                    <div className="mt-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Filter Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Periode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3 md:flex-row md:items-end">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium">Dari Tanggal</label>
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium">Sampai Tanggal</label>
                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <Button onClick={applyFilter} className="md:ml-2">
                                Terapkan
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Trial Balance Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Akun</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Kode</TableHead>
                                        <TableHead>Nama Akun</TableHead>
                                        <TableHead className="text-right">Debit</TableHead>
                                        <TableHead className="text-right">Kredit</TableHead>
                                        <TableHead className="text-right">Saldo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {accounts.map((acc) => (
                                        <TableRow key={acc.id}>
                                            <TableCell>{acc.code}</TableCell>
                                            <TableCell>{acc.name}</TableCell>
                                            <TableCell className="text-right">{acc.debit.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">{acc.credit.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">{acc.balance.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="font-semibold">
                                        <TableCell colSpan={2} className="text-right">
                                            Total
                                        </TableCell>
                                        <TableCell className="text-right">{totalDebit.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{totalCredit.toLocaleString()}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
