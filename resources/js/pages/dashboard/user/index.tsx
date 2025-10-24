'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, DollarSign, Download, DownloadIcon, FileText, FileSpreadsheet, Package } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function DashboardUser() {
    const { summary, incomeExpenseTrends, expenseCategories, recentTransactions, overdueReceivables, upcomingDebts, lowStockProducts } = usePage()
        .props as any;

    const [selectedPeriod, setSelectedPeriod] = useState('current_month');
    const [isLoading, setIsLoading] = useState(false);

    const handlePeriodChange = (value: string) => {
        setSelectedPeriod(value);
        setIsLoading(true);
        router.visit(route('user.dashboard'), {
            data: { period: value },
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const barData = (incomeExpenseTrends || []).map((d: any) => ({
        month: d.month,
        income: d.income || 0,
        expense: d.expense || 0,
    }));

    const pieData = (expenseCategories || []).map((c: any) => ({
        name: c.name,
        value: c.value,
    }));

    const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    const handleBarClick = (data: any) => {
        if (data && data.activeLabel) {
            // Navigate to journal report filtered by month
            router.visit(route('journal.index'), {
                data: { month: data.activeLabel },
                preserveState: false,
            });
        }
    };

    const handlePieClick = (data: any) => {
        if (data && data.name) {
            // Navigate to journal report filtered by expense category
            router.visit(route('journal.index'), {
                data: { expense_category: data.name },
                preserveState: false,
            });
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Dashboard Report', 20, 20);
        doc.text(`Saldo Kas: Rp ${(summary.cash || 0).toLocaleString()}`, 20, 40);
        doc.text(`Pendapatan (Bulan): Rp ${(summary.income || 0).toLocaleString()}`, 20, 50);
        doc.text(`Biaya (Bulan): Rp ${(summary.expense || 0).toLocaleString()}`, 20, 60);
        doc.text(`Laba (Bulan): Rp ${(summary.profit || 0).toLocaleString()}`, 20, 70);
        doc.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const exportToExcel = () => {
        const data = [
            ['Metric', 'Value'],
            ['Saldo Kas', summary.cash || 0],
            ['Pendapatan (Bulan)', summary.income || 0],
            ['Biaya (Bulan)', summary.expense || 0],
            ['Laba (Bulan)', summary.profit || 0],
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
        XLSX.writeFile(wb, `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                <Breadcrumbs breadcrumbs={[{ title: 'Dashboard', href: '' }]} />

                {/* Period Filter */}
                <div className="flex justify-end">
                    <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Pilih Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="current_month">Bulan Ini</SelectItem>
                            <SelectItem value="last_month">Bulan Lalu</SelectItem>
                            <SelectItem value="last_3_months">3 Bulan Terakhir</SelectItem>
                            <SelectItem value="last_6_months">6 Bulan Terakhir</SelectItem>
                            <SelectItem value="current_year">Tahun Ini</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Saldo Kas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                <div className="text-xl font-bold">Rp {(summary.cash || 0).toLocaleString()}</div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Pendapatan (Bulan)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                <div className="text-xl font-bold text-green-600">Rp {(summary.income || 0).toLocaleString()}</div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Biaya (Bulan)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                <div className="text-xl font-bold text-red-600">Rp {(summary.expense || 0).toLocaleString()}</div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Laba (Bulan)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                <div className="text-xl font-bold text-blue-600">Rp {(summary.profit || 0).toLocaleString()}</div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Piutang Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                <div className="text-lg font-semibold text-amber-600">
                                    Rp{' '}
                                    {(overdueReceivables?.sum
                                        ? overdueReceivables.sum
                                        : overdueReceivables?.reduce((s: any, r: any) => s + (parseFloat(r.amount) - parseFloat(r.paid_amount)), 0) || 0
                                    ).toLocaleString()}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Hutang 30 hari</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                <div className="text-lg font-semibold text-rose-600">
                                    Rp{' '}
                                    {(upcomingDebts?.reduce
                                        ? upcomingDebts.reduce((s: any, d: any) => s + (parseFloat(d.amount) - parseFloat(d.paid_amount)), 0)
                                        : 0
                                    ).toLocaleString()}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Tren Pendapatan & Biaya</CardTitle>
                            <div className="flex gap-2">
                                <button
                                    onClick={exportToPDF}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    <FileText className="h-4 w-4" />
                                    PDF
                                </button>
                                <button
                                    onClick={exportToExcel}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Excel
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-[300px] bg-gray-200 animate-pulse rounded"></div>
                            ) : barData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={barData} onClick={handleBarClick}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="income" fill="#22c55e" name="Pendapatan" />
                                        <Bar dataKey="expense" fill="#ef4444" name="Biaya" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[300px] text-gray-500">
                                    Belum ada data tren pendapatan & biaya.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Proporsi Biaya</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-[300px] bg-gray-200 animate-pulse rounded"></div>
                            ) : pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label onClick={handlePieClick}>
                                            {pieData.map((item: { name: string; value: number }, index: number) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[300px] text-gray-500">
                                    Belum ada data proporsi biaya.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent transactions and alerts */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Recent Transactions */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Transaksi Terakhir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentTransactions && recentTransactions.length > 0 ? (
                                <div className="space-y-2">
                                    {recentTransactions.slice(0, 5).map((transaction: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                                            <div>
                                                <p className="text-sm font-medium">{transaction.journal_description}</p>
                                                <p className="text-xs text-gray-500">{transaction.account_name} - {transaction.date}</p>
                                            </div>
                                            <div className={`text-sm font-semibold ${transaction.type === 'debit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.type === 'debit' ? '+' : '-'}Rp {transaction.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Belum ada transaksi.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Alerts */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Overdue Receivables */}
                            {overdueReceivables && overdueReceivables.length > 0 && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                                    <h4 className="text-sm font-semibold text-amber-800">Piutang Overdue</h4>
                                    <p className="text-xs text-amber-700">
                                        {overdueReceivables.length} piutang belum dibayar.
                                    </p>
                                </div>
                            )}

                            {/* Upcoming Debts */}
                            {upcomingDebts && upcomingDebts.length > 0 && (
                                <div className="p-3 bg-rose-50 border border-rose-200 rounded">
                                    <h4 className="text-sm font-semibold text-rose-800">Hutang Mendatang</h4>
                                    <p className="text-xs text-rose-700">
                                        {upcomingDebts.length} hutang akan jatuh tempo dalam 30 hari.
                                    </p>
                                </div>
                            )}

                            {/* Low Stock Products */}
                            {lowStockProducts && lowStockProducts.length > 0 && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                    <h4 className="text-sm font-semibold text-blue-800">Stok Rendah</h4>
                                    <p className="text-xs text-blue-700">
                                        {lowStockProducts.length} produk stoknya rendah.
                                    </p>
                                </div>
                            )}

                            {(!overdueReceivables || overdueReceivables.length === 0) &&
                             (!upcomingDebts || upcomingDebts.length === 0) &&
                             (!lowStockProducts || lowStockProducts.length === 0) && (
                                <p className="text-gray-500 text-sm">Tidak ada alerts.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <a href={route('incomes.create')} className="flex flex-col items-center p-4 border rounded hover:bg-gray-50">
                                <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                                <span className="text-sm font-medium">Tambah Pemasukan</span>
                            </a>
                            <a href={route('expenses.create')} className="flex flex-col items-center p-4 border rounded hover:bg-gray-50">
                                <DollarSign className="h-8 w-8 text-red-600 mb-2" />
                                <span className="text-sm font-medium">Tambah Pengeluaran</span>
                            </a>
                            <a href={route('products.create')} className="flex flex-col items-center p-4 border rounded hover:bg-gray-50">
                                <Package className="h-8 w-8 text-blue-600 mb-2" />
                                <span className="text-sm font-medium">Tambah Produk</span>
                            </a>
                            <a href={route('journal.index')} className="flex flex-col items-center p-4 border rounded hover:bg-gray-50">
                                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                                <span className="text-sm font-medium">Lihat Laporan</span>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
