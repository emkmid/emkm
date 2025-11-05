import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    Download,
    Eye,
    FileText,
    Plus,
    Search,
    Send,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Invoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    total: string;
    customer: {
        name: string;
        display_name: string;
        company_name: string | null;
    };
    is_overdue: boolean;
    days_until_due: number;
}

interface Stats {
    total: number;
    draft: number;
    sent: number;
    paid: number;
    overdue: number;
    total_amount: string;
    paid_amount: string;
    unpaid_amount: string;
}

interface Props {
    invoices: {
        data: Invoice[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
    stats: Stats;
}

const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileText },
    sent: { label: 'Terkirim', color: 'bg-blue-100 text-blue-700', icon: Send },
    paid: { label: 'Dibayar', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    overdue: { label: 'Terlambat', color: 'bg-red-100 text-red-700', icon: AlertCircle },
    cancelled: { label: 'Dibatalkan', color: 'bg-gray-100 text-gray-600', icon: XCircle },
};

export default function InvoicesIndex({ invoices, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get(route('invoices.index'), {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(amount));
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Kelola Invoice" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Kelola Invoice</h1>
                        <p className="text-muted-foreground mt-1">
                            Manajemen invoice dan pembayaran
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('invoices.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Invoice
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Invoice</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(stats.total_amount)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Dibayar</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(stats.paid_amount)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Belum Dibayar</CardTitle>
                            <Clock className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.draft + stats.sent}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(stats.unpaid_amount)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                            <p className="text-xs text-muted-foreground">
                                Perlu ditindaklanjuti
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Invoice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari nomor invoice atau customer..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="sent">Terkirim</SelectItem>
                                    <SelectItem value="paid">Dibayar</SelectItem>
                                    <SelectItem value="overdue">Terlambat</SelectItem>
                                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter}>Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Invoice List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Invoice</CardTitle>
                        <CardDescription>
                            {invoices.total} invoice
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {invoices.data.length > 0 ? (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Invoice</TableHead>
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Jatuh Tempo</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {invoices.data.map((invoice) => {
                                                const config = statusConfig[invoice.status];
                                                const Icon = config.icon;
                                                
                                                return (
                                                    <TableRow key={invoice.id}>
                                                        <TableCell className="font-medium">
                                                            {invoice.invoice_number}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">
                                                                    {invoice.customer.display_name}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatDate(invoice.invoice_date)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <div>{formatDate(invoice.due_date)}</div>
                                                                {invoice.is_overdue && invoice.status !== 'paid' && (
                                                                    <div className="text-xs text-red-600">
                                                                        Terlambat {Math.abs(invoice.days_until_due)} hari
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={config.color}>
                                                                <Icon className="mr-1 h-3 w-3" />
                                                                {config.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {formatCurrency(invoice.total)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    asChild
                                                                >
                                                                    <Link href={route('invoices.show', invoice.id)}>
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    asChild
                                                                >
                                                                    <Link href={route('invoices.pdf', invoice.id)}>
                                                                        <Download className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {invoices.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Halaman {invoices.current_page} dari {invoices.last_page}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={invoices.current_page === 1}
                                                onClick={() => router.get(route('invoices.index', {
                                                    page: invoices.current_page - 1,
                                                    search,
                                                    status: status !== 'all' ? status : undefined
                                                }))}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={invoices.current_page === invoices.last_page}
                                                onClick={() => router.get(route('invoices.index', {
                                                    page: invoices.current_page + 1,
                                                    search,
                                                    status: status !== 'all' ? status : undefined
                                                }))}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Belum Ada Invoice</h3>
                                <p className="text-muted-foreground mt-2">
                                    Mulai buat invoice pertama Anda.
                                </p>
                                <Button asChild className="mt-4">
                                    <Link href={route('invoices.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Invoice
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
