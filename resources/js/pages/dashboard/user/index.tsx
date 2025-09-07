'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function DashboardUser() {
    const { summary, incomeExpenseTrends, expenseCategories, recentTransactions, overdueReceivables, upcomingDebts, lowStockProducts } = usePage()
        .props as any;

    const barData = (incomeExpenseTrends || []).map((d: any) => ({
        month: d.month,
        income: d.income || 0,
        expense: d.expense || 0,
    }));

    const pieData = (expenseCategories || []).map((c: any) => ({
        name: c.name,
        value: c.value,
    }));

    const pieColors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#60a5fa'];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                <Breadcrumbs breadcrumbs={[{ title: 'Dashboard', href: '' }]} />

                {/* KPI cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Saldo Kas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">Rp {(summary.cash || 0).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Pendapatan (Bulan)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-green-600">Rp {(summary.income || 0).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Biaya (Bulan)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-red-600">Rp {(summary.expense || 0).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Laba (Bulan)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-blue-600">Rp {(summary.profit || 0).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Piutang Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold text-amber-600">
                                Rp{' '}
                                {(overdueReceivables?.sum
                                    ? overdueReceivables.sum
                                    : overdueReceivables?.reduce((s: any, r: any) => s + (parseFloat(r.amount) - parseFloat(r.paid_amount)), 0) || 0
                                ).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Hutang 30 hari</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold text-rose-600">
                                Rp{' '}
                                {(upcomingDebts?.reduce
                                    ? upcomingDebts.reduce((s: any, d: any) => s + (parseFloat(d.amount) - parseFloat(d.paid_amount)), 0)
                                    : 0
                                ).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Tren Pendapatan & Biaya</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="income" fill="#22c55e" name="Pendapatan" />
                                    <Bar dataKey="expense" fill="#ef4444" name="Biaya" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Proporsi Biaya</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {pieData.map((item: { name: string; value: number }, index: number) => (
                                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent transactions and alerts */}
                {/* ... (bagian transaksi terakhir, piutang, hutang, stok rendah, dan quick actions tetap sama dengan kode kamu) ... */}
            </div>
        </AppLayout>
    );
}
