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
    code: string;
    name: string;
    type: 'pendapatan' | 'biaya';
    balance: number;
}

const breadcrumbItems: BreadcrumbItemType[] = [
    { title: 'Laporan', href: '/reports' },
    { title: 'Laba Rugi', href: '' },
];

export default function IncomeStatement() {
    const { accounts, totals, filters } = usePage<{
        accounts: Account[];
        totals: { income: number; expense: number; net: number };
        filters: { start_date?: string; end_date?: string };
    }>().props;

    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const applyFilter = () => {
        router.get(route('reports.income-statement'), { start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    const incomeAccounts = accounts.filter((a) => a.type === 'pendapatan');
    const expenseAccounts = accounts.filter((a) => a.type === 'biaya');

    return (
        <AppLayout>
            <Head title="Laporan Laba Rugi" />

            <div className="flex flex-col gap-6 p-4">
                {/* Breadcrumbs */}
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                {/* Heading */}
                <div>
                    <HeadingSmall title="Laporan Laba Rugi" description="Ringkasan pendapatan dan biaya untuk menghitung laba/rugi bersih." />
                    <div className="mt-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Filter */}
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

                {/* Laporan Laba Rugi */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Akun</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Akun</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* Pendapatan */}
                                    <TableRow className="font-semibold">
                                        <TableCell colSpan={3}>Pendapatan</TableCell>
                                    </TableRow>
                                    {incomeAccounts.map((acc, i) => (
                                        <TableRow key={`inc-${i}`}>
                                            <TableCell>{acc.code}</TableCell>
                                            <TableCell>{acc.name}</TableCell>
                                            <TableCell className="text-right">{acc.balance.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="font-bold">
                                        <TableCell colSpan={2}>Total Pendapatan</TableCell>
                                        <TableCell className="text-right">{totals.income.toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* Biaya */}
                                    <TableRow className="font-semibold">
                                        <TableCell colSpan={3}>Biaya</TableCell>
                                    </TableRow>
                                    {expenseAccounts.map((acc, i) => (
                                        <TableRow key={`exp-${i}`}>
                                            <TableCell>{acc.code}</TableCell>
                                            <TableCell>{acc.name}</TableCell>
                                            <TableCell className="text-right">{acc.balance.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="font-bold">
                                        <TableCell colSpan={2}>Total Biaya</TableCell>
                                        <TableCell className="text-right">{totals.expense.toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* Laba Bersih */}
                                    <TableRow className="text-lg font-bold">
                                        <TableCell colSpan={2}>Laba Bersih</TableCell>
                                        <TableCell className="text-right">{totals.net.toLocaleString()}</TableCell>
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
