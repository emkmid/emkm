import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItemType } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'system' | 'reminder' | 'alert' | 'broadcast';
    target_users: number[] | null;
    scheduled_at: string | null;
}

interface Props {
    notification: Notification;
    users: User[];
}

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Kelola Notifikasi',
        href: route('notifications.index'),
    },
    {
        title: 'Edit Notifikasi',
        href: '',
    },
];

export default function EditNotification({ notification, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        target_users: notification.target_users || [],
        scheduled_at: notification.scheduled_at ? new Date(notification.scheduled_at).toISOString().slice(0, 16) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('notifications.update', notification.id));
    };

    const handleUserToggle = (userId: number, checked: boolean) => {
        if (checked) {
            setData('target_users', [...data.target_users, userId]);
        } else {
            setData(
                'target_users',
                data.target_users.filter((id: number) => id !== userId),
            );
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setData(
                'target_users',
                users.map((user) => user.id),
            );
        } else {
            setData('target_users', []);
        }
    };

    return (
        <AppLayout>
            <Head title="Edit Notifikasi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
                <HeadingSmall title="Edit Notifikasi" description="Perbarui data notifikasi" />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Judul */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="title">Judul Notifikasi</Label>
                                <Input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Masukkan judul notifikasi"
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* Pesan */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="message">Pesan</Label>
                                <Textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Masukkan pesan notifikasi"
                                    rows={4}
                                />
                                <InputError message={errors.message} />
                            </div>

                            {/* Tipe */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="type">Tipe Notifikasi</Label>
                                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Pilih tipe notifikasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">Sistem</SelectItem>
                                        <SelectItem value="reminder">Pengingat</SelectItem>
                                        <SelectItem value="alert">Alert</SelectItem>
                                        <SelectItem value="broadcast">Broadcast</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </div>

                            {/* Target Users */}
                            <div className="flex flex-col gap-2">
                                <Label>Target Pengguna</Label>
                                <div className="mb-2 flex items-center space-x-2">
                                    <Checkbox id="select-all" checked={data.target_users.length === users.length} onCheckedChange={handleSelectAll} />
                                    <Label htmlFor="select-all">Pilih Semua User</Label>
                                </div>
                                <div className="max-h-48 overflow-y-auto rounded border p-2">
                                    {users.map((user) => (
                                        <div key={user.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`user-${user.id}`}
                                                checked={data.target_users.includes(user.id)}
                                                onCheckedChange={(checked) => handleUserToggle(user.id, checked as boolean)}
                                            />
                                            <Label htmlFor={`user-${user.id}`}>
                                                {user.name} ({user.email})
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">Jika tidak ada yang dipilih, notifikasi akan dikirim ke semua user.</p>
                                <InputError message={errors.target_users} />
                            </div>

                            {/* Jadwal */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="scheduled_at">Jadwal Kirim (Opsional)</Label>
                                <Input
                                    type="datetime-local"
                                    id="scheduled_at"
                                    value={data.scheduled_at}
                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                />
                                <p className="text-sm text-gray-500">Jika kosong, notifikasi akan dikirim segera.</p>
                                <InputError message={errors.scheduled_at} />
                            </div>

                            {/* Tombol Submit */}
                            <div className="flex justify-end gap-2">
                                <Link href={route('notifications.index')}>
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memperbarui...' : 'Perbarui'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
