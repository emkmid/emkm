import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItemType } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import React, { JSX } from 'react';

type Entry = { id: number; date: string; description: string; type: 'debit' | 'credit'; amount: number };
type Account = {
    id: number;
    code: string;
    name: string;
    type: string; // bisa di-refine jadi union: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
    debit: number;
    credit: number;
    balance: number;
    entries: Entry[];
};

const breadcrumbItems: BreadcrumbItemType[] = [{ title: 'Buku Besar', href: '' }];

export default function Ledger() {
    const { accounts, filters } = usePage<{ accounts: Account[]; filters: any }>().props;
    const [sortField, setSortField] = React.useState(filters.sortField || 'date');
    const [sortOrder, setSortOrder] = React.useState(filters.sortOrder || 'asc');
    const [start, setStart] = React.useState(filters.start_date || '');
    const [end, setEnd] = React.useState(filters.end_date || '');

    function applyFilter() {
        router.get(route('reports.ledger'), { start_date: start, end_date: end, sortField, sortOrder }, { preserveState: true });
    }

    function toggleSort(field: string) {
        const next = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(next);
        router.get(route('reports.ledger'), { start_date: start, end_date: end, sortField: field, sortOrder: next }, { preserveState: true });
    }

    return (
        <AppLayout>
            <Head title="Buku Besar" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Breadcrumbs */}
                <Breadcrumbs breadcrumbs={breadcrumbItems} />

                {/* Header */}
                <div>
                    <HeadingSmall title="Buku Besar" description="Laporan Buku Besar" />
                    <div className="mt-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 dark:text-gray-400">Tanggal Awal</label>
                        <input
                            type="date"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 dark:text-gray-400">Tanggal Akhir</label>
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={applyFilter}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        Terapkan
                    </button>
                </div>

                {/* Data Kosong */}
                {accounts.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-10 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mb-2 h-10 w-10 opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h13m0 0L13 4m9 7l-9 9" />
                        </svg>
                        Tidak ada data untuk periode ini.
                    </div>
                )}

                {/* List Akun */}
                <div className="space-y-4">
                    {accounts.map((acc) => (
                        <div
                            key={acc.id}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                {/* Info Akun */}
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{acc.code}</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {acc.name} <span className="text-sm text-gray-400 dark:text-gray-500">({acc.type})</span>
                                    </div>
                                </div>

                                {/* Saldo */}
                                <div className="text-right">
                                    <div className="text-sm text-gray-700 dark:text-gray-200">
                                        Saldo: <strong>{acc.balance.toLocaleString()}</strong>{' '}
                                        {['asset', 'expense'].includes(acc.type) ? '(D)' : '(K)'}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        D: {acc.debit.toLocaleString()} / K: {acc.credit.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell onClick={() => toggleSort('date')} className="cursor-pointer">
                                                Tanggal {sortField === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                                            </TableCell>
                                            <TableCell>Keterangan</TableCell>
                                            <TableCell className="text-right">Debit</TableCell>
                                            <TableCell className="text-right">Kredit</TableCell>
                                            <TableCell className="text-right">Saldo</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            acc.entries.reduce<{ running: number; rows: JSX.Element[] }>(
                                                (state, e) => {
                                                    let newBalance = state.running;
                                                    if (e.type === 'debit') newBalance += e.amount;
                                                    if (e.type === 'credit') newBalance -= e.amount;

                                                    const row = (
                                                        <TableRow key={e.id}>
                                                            <TableCell>{e.date}</TableCell>
                                                            <TableCell>{e.description}</TableCell>
                                                            <TableCell className="text-right">
                                                                {e.type === 'debit' ? e.amount.toLocaleString() : '—'}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {e.type === 'credit' ? e.amount.toLocaleString() : '—'}
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium">
                                                                {newBalance.toLocaleString()} {['asset', 'expense'].includes(acc.type) ? 'D' : 'K'}
                                                            </TableCell>
                                                        </TableRow>
                                                    );

                                                    return { running: newBalance, rows: [...state.rows, row] };
                                                },
                                                { running: 0, rows: [] },
                                            ).rows
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
