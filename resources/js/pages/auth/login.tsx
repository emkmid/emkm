import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, AtSign, Lock } from 'lucide-react';
import { useEffect, type FormEventHandler } from 'react';

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
        <div className="grid min-h-screen w-full lg:grid-cols-2">
            <Head title="Masuk ke Akun Anda" />

            <div className="relative hidden flex-col items-center justify-center p-10 text-white lg:flex" style={{ backgroundColor: '#23627C' }}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="z-10 text-center">
                    <div className="mb-6 flex justify-center">
                        <AppLogo />
                    </div>
                    <h1 className="text-4xl font-bold">Selamat Datang Kembali!</h1>
                    <p className="mt-4 max-w-md text-lg text-white/80">
                        Masuk untuk melanjutkan pengelolaan keuangan dan membawa bisnis Anda ke level berikutnya.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-6" style={{ backgroundColor: '#D3EDFF' }}>
                <Card className="w-full max-w-md duration-700 animate-in fade-in-50 slide-in-from-bottom-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight text-[#23627C]">Masuk ke Akun Anda</CardTitle>
                        <CardDescription>Gunakan email dan password Anda untuk masuk.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
                        <form onSubmit={submit} className="space-y-6">
                            <InputError message={errors.email} className="text-center" />
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
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href={route('password.request')} className="text-sm font-medium text-[#23627C] hover:underline">
                                        Lupa password?
                                    </Link>
                                </div>
                                <div className="relative mt-2">
                                    <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
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
                            <div className="flex items-center">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked === true)}
                                />
                                <Label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
                                    Ingat saya
                                </Label>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <Button className="w-full" variant="blue" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Masuk'}
                                </Button>

                                <Link
                                    href={route('register')}
                                    className="group inline-flex items-center text-sm font-medium text-[#23627C] hover:underline dark:text-blue-300"
                                >
                                    Belum punya akun? Daftar
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                {/* Garis dengan tulisan "atau" */}
                                <div className="flex w-full items-center">
                                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                                    <span className="px-3 text-sm text-gray-500 dark:text-gray-400">atau</span>
                                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                                </div>

                                {/* Tombol Google */}
                                <button
                                    onClick={() => (window.location.href = '/auth/google/redirect')}
                                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                                >
                                    <svg width="20" height="20" viewBox="0 0 48 48">
                                        <path
                                            fill="#EA4335"
                                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.24 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.71 12.19 17.82 9.5 24 9.5z"
                                        />
                                        <path
                                            fill="#4285F4"
                                            d="M46.1 24.55c0-1.57-.14-3.09-.39-4.55H24v9.02h12.65c-.55 2.96-2.18 5.47-4.63 7.15l7.15 5.52C43.82 37.89 46.1 31.88 46.1 24.55z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M10.54 28.41c-.5-1.48-.78-3.06-.78-4.69 0-1.63.28-3.21.78-4.69l-7.98-6.19C.94 15.34 0 19.06 0 23.72c0 4.66.94 8.38 2.56 11.88l7.98-6.19z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M24 47.44c6.47 0 11.9-2.13 15.87-5.78l-7.15-5.52c-2.02 1.36-4.67 2.16-8.72 2.16-6.18 0-11.29-3.69-13.46-9.02l-7.98 6.19C6.51 42.62 14.62 47.44 24 47.44z"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Login dengan Google</span>
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
