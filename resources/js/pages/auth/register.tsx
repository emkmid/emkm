import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, AtSign, Lock, User } from 'lucide-react';
import { useEffect, type FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLogo from '@/components/app-logo';

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
        <div className="grid min-h-screen w-full lg:grid-cols-2">
            <Head title="Daftar Akun Baru" />

            <div className="relative hidden flex-col items-center justify-center p-10 text-white lg:flex" style={{ backgroundColor: '#23627C' }}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="z-10 text-center">
                    <div className="mb-6 flex justify-center">
                        <AppLogo />
                    </div>
                    <h1 className="text-4xl font-bold">Mulai Transformasi Bisnis Anda</h1>
                    <p className="mt-4 max-w-md text-lg text-white/80">
                        Bergabunglah dengan EMKM dan ambil langkah pertama menuju manajemen keuangan yang lebih baik dan terorganisir.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-6" style={{ backgroundColor: '#D3EDFF' }}>
                <Card className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-8 duration-700">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight text-[#23627C]">Buat Akun Baru</CardTitle>
                        <CardDescription>Isi data di bawah ini untuk memulai perjalanan Anda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <div className="relative mt-2">
                                    <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
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

                            <div>
                                <Label htmlFor="email">Alamat Email</Label>
                                <div className="relative mt-2">
                                    <AtSign className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
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

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative mt-2">
                                    <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
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

                            <div>
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <div className="relative mt-2">
                                    <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
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
                                <Button className="w-full" variant="blue" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Daftar'}
                                </Button>

                                <Link
                                    href={route('login')}
                                    className="group inline-flex items-center text-sm font-medium text-[#23627C] hover:underline"
                                >
                                    Sudah punya akun? Masuk
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
