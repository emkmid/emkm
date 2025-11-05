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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building, Mail, MapPin, Phone, Plus, Search, UserSquare } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    company_name: string | null;
    city: string | null;
    invoices_count?: number;
    display_name: string;
}

interface Props {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function CustomersIndex({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('customers.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get(route('customers.index'));
    };

    return (
        <AppLayout>
            <Head title="Kelola Customer" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Kelola Customer</h1>
                        <p className="text-muted-foreground mt-1">
                            Manajemen data customer untuk invoice
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('customers.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Customer
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Customer</CardTitle>
                            <UserSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{customers.total}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cari Customer</CardTitle>
                        <CardDescription>
                            Cari berdasarkan nama, email, perusahaan, atau telepon
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari customer..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit">Cari</Button>
                            {filters.search && (
                                <Button type="button" variant="outline" onClick={handleClearSearch}>
                                    Clear
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Customer List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Customer</CardTitle>
                        <CardDescription>
                            {customers.total} customer terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {customers.data.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Kontak</TableHead>
                                            <TableHead>Lokasi</TableHead>
                                            <TableHead className="text-center">Invoice</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customers.data.map((customer) => (
                                            <TableRow key={customer.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{customer.name}</div>
                                                        {customer.company_name && (
                                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                <Building className="h-3 w-3" />
                                                                {customer.company_name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1 text-sm">
                                                        {customer.email && (
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                                <span className="text-xs">{customer.email}</span>
                                                            </div>
                                                        )}
                                                        {customer.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                                <span className="text-xs">{customer.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {customer.city && (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                                            {customer.city}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary">
                                                        {customer.invoices_count || 0}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href={route('customers.show', customer.id)}>
                                                            Lihat Detail
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {customers.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Halaman {customers.current_page} dari {customers.last_page}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={customers.current_page === 1}
                                                onClick={() => router.get(route('customers.index', { page: customers.current_page - 1, search }))}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={customers.current_page === customers.last_page}
                                                onClick={() => router.get(route('customers.index', { page: customers.current_page + 1, search }))}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <UserSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Belum Ada Customer</h3>
                                <p className="text-muted-foreground mt-2">
                                    {filters.search
                                        ? 'Tidak ada customer yang sesuai dengan pencarian.'
                                        : 'Mulai tambahkan customer pertama Anda.'}
                                </p>
                                {!filters.search && (
                                    <Button asChild className="mt-4">
                                        <Link href={route('customers.create')}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Customer
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
