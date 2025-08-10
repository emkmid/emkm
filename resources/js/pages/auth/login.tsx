import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, AtSign, Lock } from 'lucide-react';
import { useEffect, type FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLogo from '@/components/app-logo';

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
                <Card className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-8 duration-700">
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
                                    className="group inline-flex items-center text-sm font-medium text-[#23627C] hover:underline"
                                >
                                    Belum punya akun? Daftar
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
