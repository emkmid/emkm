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

            <div className="container max-w-7xl mx-auto py-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Kelola Invoice</h1>
                        <p className="text-muted-foreground mt-1">
                            Manajemen invoice dan pembayaran
                        </p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href={route('invoices.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Invoice
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Invoice</CardTitle>
                            <div className="rounded-full bg-blue-100 p-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatCurrency(stats.total_amount)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Dibayar</CardTitle>
                            <div className="rounded-full bg-green-100 p-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatCurrency(stats.paid_amount)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Belum Dibayar</CardTitle>
                            <div className="rounded-full bg-amber-100 p-2">
                                <Clock className="h-4 w-4 text-amber-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">
                                {stats.draft + stats.sent}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatCurrency(stats.unpaid_amount)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
                            <div className="rounded-full bg-red-100 p-2">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Perlu ditindaklanjuti
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Invoice</CardTitle>
                        <CardDescription>
                            Cari dan filter invoice berdasarkan kriteria
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
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
                                    <SelectTrigger className="w-full sm:w-[200px]">
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
                                <Button onClick={handleFilter} className="w-full sm:w-auto">
                                    <Search className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Invoice List */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <CardTitle>Daftar Invoice</CardTitle>
                                <CardDescription className="mt-1">
                                    Total {invoices.total} invoice
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {invoices.data.length > 0 ? (
                            <div className="space-y-4">
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="min-w-[140px]">Invoice</TableHead>
                                                <TableHead className="min-w-[180px]">Customer</TableHead>
                                                <TableHead className="min-w-[110px]">Tanggal</TableHead>
                                                <TableHead className="min-w-[140px]">Jatuh Tempo</TableHead>
                                                <TableHead className="min-w-[120px]">Status</TableHead>
                                                <TableHead className="text-right min-w-[130px]">Total</TableHead>
                                                <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {invoices.data.map((invoice) => {
                                                const config = statusConfig[invoice.status];
                                                const Icon = config.icon;
                                                
                                                return (
                                                    <TableRow key={invoice.id} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium font-mono text-sm">
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
                                                                    <div className="text-xs text-red-600 font-medium">
                                                                        Terlambat {Math.abs(invoice.days_until_due)} hari
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={config.color} variant="secondary">
                                                                <Icon className="mr-1 h-3 w-3" />
                                                                {config.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {formatCurrency(invoice.total)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    asChild
                                                                    title="Lihat Detail"
                                                                >
                                                                    <Link href={route('invoices.show', invoice.id)}>
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    asChild
                                                                    title="Download PDF"
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
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
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
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-6">
                                    <FileText className="h-16 w-16 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Belum Ada Invoice</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                    Mulai buat invoice pertama Anda untuk melacak pembayaran.
                                </p>
                                <Button asChild size="lg" className="w-full sm:w-auto">
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
