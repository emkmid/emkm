import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, useForm, router } from '@inertiajs/react';
import { Mail, RefreshCw, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface VerifyOtpProps {
    email: string;
    name: string;
    status?: string;
}

export default function VerifyOtp({ email, name, status }: VerifyOtpProps) {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
    });

    const resendForm = useForm({});

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits are filled
        if (newOtp.every((digit) => digit !== '') && index === 5) {
            const fullCode = newOtp.join('');
            // Submit after short delay to show the last digit
            setTimeout(() => {
                router.post(route('otp.verify'), {
                    code: fullCode,
                }, {
                    onError: () => {
                        // Clear OTP on error
                        setOtp(['', '', '', '', '', '']);
                        inputRefs.current[0]?.focus();
                    },
                });
            }, 100);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle paste
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then((text) => {
                const pastedOtp = text.replace(/\D/g, '').slice(0, 6).split('');
                const newOtp = [...otp];
                pastedOtp.forEach((digit, i) => {
                    if (i < 6) newOtp[i] = digit;
                });
                setOtp(newOtp);
                
                // Focus last filled input or last input
                const lastIndex = Math.min(pastedOtp.length, 5);
                inputRefs.current[lastIndex]?.focus();

                // Auto-submit if complete
                if (pastedOtp.length === 6) {
                    const fullCode = newOtp.join('');
                    setTimeout(() => {
                        router.post(route('otp.verify'), {
                            code: fullCode,
                        }, {
                            onError: () => {
                                setOtp(['', '', '', '', '', '']);
                                inputRefs.current[0]?.focus();
                            },
                        });
                    }, 100);
                }
            });
        }
    };

    const handleResend = () => {
        resendForm.post(route('otp.resend'), {
            onSuccess: () => {
                setTimeLeft(300); // Reset timer
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            },
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-2">
            <Head title="Verifikasi Email" />

            <div className="relative hidden flex-col items-center justify-center p-10 text-white lg:flex" style={{ backgroundColor: '#23627C' }}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="z-10 text-center">
                    <div className="mb-6 flex justify-center">
                        <AppLogo />
                    </div>
                    <Shield className="mx-auto mb-4 h-20 w-20" />
                    <h1 className="text-4xl font-bold">Verifikasi Email Anda</h1>
                    <p className="mt-4 max-w-md text-lg text-white/80">
                        Kami telah mengirim kode verifikasi 6 digit ke email Anda untuk memastikan keamanan akun.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-6" style={{ backgroundColor: '#D3EDFF' }}>
                <Card className="w-full max-w-md duration-700 animate-in fade-in-50 slide-in-from-bottom-8">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Mail className="h-6 w-6 text-[#23627C]" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-[#23627C]">Verifikasi Email</CardTitle>
                        <CardDescription>
                            Kami telah mengirim kode 6 digit ke <br />
                            <span className="font-semibold text-[#23627C]">{email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {status && (
                            <div className="rounded-md bg-green-50 p-3 text-center text-sm text-green-800">{status}</div>
                        )}

                        {errors.code && (
                            <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-800">{errors.code}</div>
                        )}

                        <div className="space-y-4">
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="h-14 w-12 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold transition-all focus:border-[#23627C] focus:outline-none focus:ring-2 focus:ring-[#23627C]/20"
                                        disabled={processing}
                                    />
                                ))}
                            </div>

                            <div className="text-center">
                                {timeLeft > 0 ? (
                                    <p className="text-sm text-gray-600">
                                        Kode akan kedaluwarsa dalam{' '}
                                        <span className="font-semibold text-[#23627C]">{formatTime(timeLeft)}</span>
                                    </p>
                                ) : (
                                    <p className="text-sm font-semibold text-red-600">Kode telah kedaluwarsa</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleResend}
                                    disabled={resendForm.processing || timeLeft > 240} // Can resend after 1 minute
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    {resendForm.processing ? 'Mengirim...' : 'Kirim Ulang Kode'}
                                </Button>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                        if (confirm('Apakah Anda yakin ingin membatalkan registrasi dan menggunakan email lain?')) {
                                            router.post(route('otp.cancel'), {}, {
                                                onSuccess: () => {
                                                    window.location.href = route('register');
                                                },
                                            });
                                        }
                                    }}
                                >
                                    Gunakan Email Lain
                                </Button>
                            </div>

                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                                <p className="font-semibold">💡 Tips:</p>
                                <ul className="mt-2 space-y-1 text-xs">
                                    <li>• Cek folder Spam/Junk jika tidak menerima email</li>
                                    <li>• Kode bisa di-paste langsung dari email</li>
                                    <li>• Maksimal 3x salah input</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
