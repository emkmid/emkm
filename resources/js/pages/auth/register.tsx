import { useEffect, type FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, AtSign, Lock, User } from 'lucide-react';

// Import komponen UI yang sudah ada
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="flex min-h-screen w-full flex-wrap bg-gray-100 dark:bg-gray-900">
            <Head title="Daftar Akun Baru" />

            {/* Panel Kiri - Branding */}
            <div className="relative hidden w-1/2 flex-col items-center justify-center bg-primary/90 text-white lg:flex">
                <div className="absolute inset-0 bg-primary opacity-50"></div>
                <div className="z-10 text-center">
                    <h1 className="text-4xl font-bold">Mulai Transformasi Bisnis Anda</h1>
                    <p className="mt-4 max-w-md text-lg opacity-90">
                        Bergabunglah dengan EMKM dan ambil langkah pertama menuju manajemen keuangan yang lebih baik dan
                        terorganisir.
                    </p>
                </div>
            </div>

            {/* Panel Kanan - Form Pendaftaran */}
            <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
                <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg transition-opacity duration-700 ease-in animate-fade-in dark:bg-gray-800">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Buat Akun Baru</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Isi data di bawah untuk memulai.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Nama */}
                        <div>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <div className="relative mt-2">
                                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="pl-10"
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Alamat Email</Label>
                            <div className="relative mt-2">
                                <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-10"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative mt-2">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="pl-10"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <div className="relative mt-2">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="pl-10"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                            <Button className="w-full" disabled={processing}>
                                {processing ? 'Memproses...' : 'Daftar'}
                            </Button>

                            <Link
                                href={route('login')}
                                className="group inline-flex items-center text-sm font-medium text-primary hover:underline"
                            >
                                Sudah punya akun? Masuk
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
