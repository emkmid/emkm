import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
    current_subscription?: {
        package?: {
            id?: number;
            name?: string;
            price?: number;
        };
        ends_at?: string | null;
        status?: string;
    } | null;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links?: any[];
    };
    packages: {
        id: number;
        name: string;
        price: number;
    }[];
}

export default function Index({ users }: Props) {
    const { flash } = usePage().props as any;
    const packages = (usePage().props as any).packages as Props['packages'];

    return (
        <AppLayout>
            <Head title="Kelola Pengguna" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kelola Pengguna</h1>
                    <Link href={route('users.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Pengguna
                        </Button>
                    </Link>
                </div>

                {flash?.success && <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">{flash.success}</div>}

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengguna</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Paket</TableHead>
                                    <TableHead>Dibuat</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-medium ${
                                                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {user.role === 'admin' ? 'Admin' : 'User'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {user.current_subscription?.package?.name ?? <span className="text-xs text-muted-foreground">Free</span>}
                                            {user.current_subscription?.ends_at && (
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    Sampai: {new Date(user.current_subscription.ends_at).toLocaleDateString('id-ID')}
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell>{new Date(user.created_at).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link href={route('users.edit', user.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <form
                                                    method="POST"
                                                    action={route('admin.users.subscribe', user.id)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="_token"
                                                        value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''}
                                                    />
                                                    <select name="package_id" className="rounded border px-2 py-1 text-sm">
                                                        {packages.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name} - ${p.price}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            if (!confirm('Assign selected package to user?')) e.preventDefault();
                                                        }}
                                                    >
                                                        Assign
                                                    </Button>
                                                </form>
                                                <form
                                                    method="POST"
                                                    action={route('users.destroy', user.id)}
                                                    onSubmit={(e) => {
                                                        if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <input type="hidden" name="_method" value="DELETE" />
                                                    <input
                                                        type="hidden"
                                                        name="_token"
                                                        value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''}
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

                        {users.data.length === 0 && <div className="py-8 text-center text-gray-500">Belum ada pengguna.</div>}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
