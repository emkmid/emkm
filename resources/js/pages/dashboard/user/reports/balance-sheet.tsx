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
    type: 'aset' | 'liabilitas' | 'ekuitas';
    balance: number;
}

const breadcrumbItems: BreadcrumbItemType[] = [
    { title: 'Laporan', href: '/reports' },
    { title: 'Neraca', href: '' },
];

export default function BalanceSheet() {
    const { accounts, totals, filters } = usePage<{
        accounts: Account[];
        totals: { assets: number; liabilities: number; equity: number };
        filters: { start_date?: string; end_date?: string };
    }>().props;

    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const applyFilter = () => {
        router.get(route('reports.balance-sheet'), { start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    const assetAccounts = accounts.filter((a) => a.type === 'aset');
    const liabilityAccounts = accounts.filter((a) => a.type === 'liabilitas');
    const equityAccounts = accounts.filter((a) => a.type === 'ekuitas');

    return (
        <AppLayout>
            <Head title="Laporan Neraca" />

            <div className="flex flex-col gap-6 p-4">
                {/* Breadcrumbs */}
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                {/* Heading */}
                <div>
                    <HeadingSmall title="Laporan Neraca" description="Ringkasan posisi keuangan: aset, liabilitas, dan ekuitas." />
                    <div className="mt-1 h-px"></div>
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

                {/* Neraca */}
                <Card>
                    <CardHeader>
                        <CardTitle>Posisi Keuangan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Akun</TableHead>
                                        <TableHead className="text-right">Saldo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* Aset */}
                                    <TableRow className="font-semibold">
                                        <TableCell colSpan={3}>Aset</TableCell>
                                    </TableRow>
                                    {assetAccounts.map((acc, i) => (
                                        <TableRow key={`ast-${i}`}>
                                            <TableCell>{acc.code}</TableCell>
                                            <TableCell>{acc.name}</TableCell>
                                            <TableCell className="text-right">{acc.balance.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="font-bold">
                                        <TableCell colSpan={2}>Total Aset</TableCell>
                                        <TableCell className="text-right">{totals.assets.toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* Liabilitas */}
                                    <TableRow className="font-semibold">
                                        <TableCell colSpan={3}>Liabilitas</TableCell>
                                    </TableRow>
                                    {liabilityAccounts.map((acc, i) => (
                                        <TableRow key={`lia-${i}`}>
                                            <TableCell>{acc.code}</TableCell>
                                            <TableCell>{acc.name}</TableCell>
                                            <TableCell className="text-right">{acc.balance.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="font-bold">
                                        <TableCell colSpan={2}>Total Liabilitas</TableCell>
                                        <TableCell className="text-right">{totals.liabilities.toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* Ekuitas */}
                                    <TableRow className="font-semibold">
                                        <TableCell colSpan={3}>Ekuitas</TableCell>
                                    </TableRow>
                                    {equityAccounts.map((acc, i) => (
                                        <TableRow key={`eq-${i}`}>
                                            <TableCell>{acc.code}</TableCell>
                                            <TableCell>{acc.name}</TableCell>
                                            <TableCell className="text-right">{acc.balance.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="font-bold">
                                        <TableCell colSpan={2}>Total Ekuitas</TableCell>
                                        <TableCell className="text-right">{totals.equity.toLocaleString()}</TableCell>
                                    </TableRow>

                                    {/* Total Liabilitas + Ekuitas */}
                                    <TableRow className="text-lg font-bold">
                                        <TableCell colSpan={2}>Total Liabilitas + Ekuitas</TableCell>
                                        <TableCell className="text-right">{(totals.liabilities + totals.equity).toLocaleString()}</TableCell>
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
