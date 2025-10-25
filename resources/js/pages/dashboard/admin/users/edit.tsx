import { Breadcrumbs } from '@/components/breadcrumbs';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItemType } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface EditUserPageProps {
    user: User;
}

const breadcrumbItems: BreadcrumbItemType[] = [
    {
        title: 'Kelola Pengguna',
        href: route('users.index'),
    },
    {
        title: 'Edit Pengguna',
        href: '',
    },
];

export default function EditUser({ user }: EditUserPageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Pengguna" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs breadcrumbs={breadcrumbItems} />
                <HeadingSmall title="Edit Pengguna" description="Perbarui data pengguna" />

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Nama */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masukkan nama lengkap"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Masukkan alamat email"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Role */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            {/* Tombol Submit */}
                            <div className="flex justify-end gap-2">
                                <Link href={route('users.index')}>
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
