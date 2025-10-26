import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'system' | 'reminder' | 'alert' | 'broadcast';
    target_users: number[] | null;
    scheduled_at: string | null;
    sent_at: string | null;
    is_sent: boolean;
    created_at: string;
    creator: {
        name: string;
    };
}

interface Props {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links?: any[];
    };
}

export default function Index({ notifications }: Props) {
    const { flash } = usePage().props as any;

    const getTypeLabel = (type: string) => {
        const labels = {
            system: 'Sistem',
            reminder: 'Pengingat',
            alert: 'Alert',
            broadcast: 'Broadcast',
        };
        return labels[type as keyof typeof labels] || type;
    };

    const getTypeColor = (type: string) => {
        const colors = {
            system: 'bg-blue-100 text-blue-800',
            reminder: 'bg-yellow-100 text-yellow-800',
            alert: 'bg-red-100 text-red-800',
            broadcast: 'bg-purple-100 text-purple-800',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout>
            <Head title="Kelola Notifikasi" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kelola Notifikasi</h1>
                    <Link href={route('notifications.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Notifikasi
                        </Button>
                    </Link>
                </div>

                {flash?.success && <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">{flash.success}</div>}

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Notifikasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Jadwal</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notifications.data.map((notification) => (
                                    <TableRow key={notification.id}>
                                        <TableCell className="max-w-xs">
                                            <div className="truncate" title={notification.title}>
                                                {notification.title}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`rounded px-2 py-1 text-xs font-medium ${getTypeColor(notification.type)}`}>
                                                {getTypeLabel(notification.type)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{notification.target_users ? `${notification.target_users.length} user` : 'Semua user'}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-medium ${
                                                    notification.is_sent ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                                }`}
                                            >
                                                {notification.is_sent ? 'Terkirim' : 'Belum Terkirim'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {notification.scheduled_at ? new Date(notification.scheduled_at).toLocaleString('id-ID') : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link href={route('notifications.edit', notification.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <form
                                                    method="POST"
                                                    action={route('notifications.destroy', notification.id)}
                                                    onSubmit={(e) => {
                                                        if (!confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) {
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

                        {notifications.data.length === 0 && <div className="py-8 text-center text-gray-500">Belum ada notifikasi.</div>}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
