import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, AtSign, Lock } from 'lucide-react';
import { useEffect, type FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="flex min-h-screen w-full flex-wrap bg-background text-foreground transition-colors duration-500">
            <Head title="Masuk ke Akun Anda" />

            {/* Panel Kiri - Branding */}
            <div className="relative hidden w-1/2 flex-col items-center justify-center bg-primary text-primary-foreground lg:flex">
                <div className="absolute inset-0 bg-primary/90"></div>
                <div className="z-10 px-8 text-center">
                    <h1 className="text-4xl font-bold">Selamat Datang Kembali!</h1>
                    <p className="mt-4 max-w-md text-lg opacity-90">
                        Masuk untuk melanjutkan pengelolaan keuangan dan membawa bisnis Anda ke level berikutnya.
                    </p>
                </div>
            </div>

            {/* Panel Kanan - Form Login */}
            <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
                <div className="animate-fade-in w-full max-w-md space-y-6 rounded-xl bg-card p-8 shadow-lg transition-opacity duration-700 ease-in">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold">Masuk ke Akun</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Gunakan kredensial Anda untuk masuk.</p>
                    </div>

                    {status && <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <InputError message={errors.email} className="text-center" />

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Alamat Email</Label>
                            <div className="relative mt-2">
                                <AtSign className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-10"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href={route('password.request')} className="text-sm font-medium text-primary hover:underline">
                                    Lupa password?
                                </Link>
                            </div>
                            <div className="relative mt-2">
                                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="pl-10"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked === true)}
                            />
                            <Label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">
                                Ingat saya
                            </Label>
                        </div>

                        {/* Tombol & Link */}
                        <div className="flex flex-col items-center space-y-4">
                            <Button className="w-full" variant="blue" disabled={processing}>
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>

                            <Link
                                href={route('register')}
                                className="group inline-flex items-center text-sm font-medium text-primary hover:underline"
                            >
                                Belum punya akun? Daftar
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
