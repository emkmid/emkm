import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    is_active: boolean;
    created_at: string;
}

interface Props {
    packages: {
        data: Package[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links?: any[];
    };
}

export default function Index({ packages }: Props) {
    const { flash } = usePage().props as any;

    return (
        <AppLayout>
            <Head title="Kelola Paket Layanan" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kelola Paket Layanan</h1>
                    <Link href={route('admin.packages.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Paket
                        </Button>
                    </Link>
                </div>

                {flash?.success && <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">{flash.success}</div>}

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Paket</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.data.map((pkg) => (
                                    <TableRow key={pkg.id}>
                                        <TableCell>{pkg.name}</TableCell>
                                        <TableCell>{pkg.description}</TableCell>
                                        <TableCell>Rp {pkg.price.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-medium ${
                                                    pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {pkg.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link href={route('admin.packages.edit', pkg.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <form
                                                    method="POST"
                                                    action={route('admin.packages.destroy', pkg.id)}
                                                    onSubmit={(e) => {
                                                        if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <input type="hidden" name="_method" value="DELETE" />
                                                    <input
                                                        type="hidden"
                                                        name="_token"
                                                        value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')}
                                                    />
                                                    <Button type="submit" variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {packages.data.length === 0 && <div className="py-8 text-center text-gray-500">Belum ada paket.</div>}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
