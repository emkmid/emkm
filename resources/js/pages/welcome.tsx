import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import {
    BarChart,
    BarChart3,
    Bell,
    BookOpen,
    Calculator,
    Check,
    ChevronDown,
    DollarSign,
    FolderKanban,
    LineChart,
    NotebookPen,
    UserPlus,
    Users,
    Wallet,
} from 'lucide-react';
import { useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const primary = '#23BBB7';
    const darkBlue = '#23627C';
    const softBlue = '#D3EDFF';
    const orange = '#FFA14A';

    const features = [
        {
            icon: <DollarSign className="h-8 w-8" style={{ color: primary }} />,
            title: 'Manajemen Keuangan',
            desc: 'Catat pengeluaran dan pemasukan usaha harian Anda dengan sistem sederhana.',
        },
        {
            icon: <BarChart className="h-8 w-8" style={{ color: primary }} />,
            title: 'Laporan Instan',
            desc: 'Lihat laporan laba-rugi dan arus kas secara otomatis dan real-time.',
        },
        {
            icon: <Users className="h-8 w-8" style={{ color: primary }} />,
            title: 'Kolaborasi Tim',
            desc: 'Bekerja sama dengan tim Anda untuk mengelola keuangan bisnis bersama.',
        },
    ];

    const primaryFeatures = [
        {
            title: 'Registrasi & Login',
            desc: 'Pembuatan akun berdasarkan peran pengguna dalam sistem.',
            icon: <UserPlus className="h-8 w-8" style={{ color: primary }} />,
        },
        {
            title: 'Pencatatan Keuangan Harian',
            desc: 'Input transaksi harian dengan kategori yang fleksibel.',
            icon: <NotebookPen className="h-8 w-8" style={{ color: primary }} />,
        },
        {
            title: 'Laporan Keuangan Otomatis',
            desc: 'Laporan real-time untuk evaluasi dan analisis bisnis.',
            icon: <BarChart3 className="h-8 w-8" style={{ color: primary }} />,
        },
        {
            title: 'Manajemen Kategori',
            desc: 'Kelola kategori sesuai kebutuhan bisnismu.',
            icon: <FolderKanban className="h-8 w-8" style={{ color: primary }} />,
        },
        {
            title: 'Notifikasi & Pengingat',
            desc: 'Ingatkan transaksi rutin secara otomatis.',
            icon: <Bell className="h-8 w-8" style={{ color: primary }} />,
        },
        {
            title: 'Akses Edukasi',
            desc: 'Artikel & studi kasus untuk peningkatan finansial.',
            icon: <BookOpen className="h-8 w-8" style={{ color: primary }} />,
        },
        {
            title: 'Dashboard Visual',
            desc: 'Grafik interaktif dan intuitif untuk memantau keuangan.',
            icon: <LineChart className="h-8 w-8" style={{ color: primary }} />,
        },
        {
            title: 'Kalkulator HPP',
            desc: 'Hitung harga pokok & tentukan strategi jual terbaik.',
            icon: <Calculator className="h-8 w-8" style={{ color: primary }} />,
        },
        {
            title: 'Simulasi Modal',
            desc: 'Simulasikan kebutuhan modal & break-even point.',
            icon: <Wallet className="h-8 w-8" style={{ color: primary }} />,
        },
    ];

    const plans = [
        {
            title: 'Free',
            price: 'Rp 0',
            features: ['Pencatatan Dasar', 'Laporan Harian', 'Akses Edukasi'],
            cta: 'Coba Sekarang',
        },
        {
            title: 'Basic',
            price: 'Rp 29.000 / bln',
            features: ['Semua Fitur Free', 'Laporan Bulanan', 'Notifikasi Otomatis'],
            cta: 'Coba Gratis 14 Hari',
        },
        {
            title: 'Pro',
            price: 'Rp 59.000 / bln',
            features: ['Semua Fitur Basic', 'Grafik & Simulasi', 'Dukungan Prioritas'],
            cta: 'Mulai Langganan',
        },
    ];

    const faqs = [
        {
            q: 'Apakah aplikasi ini gratis?',
            a: 'Ya! Kamu bisa menggunakan versi Free untuk fitur dasar tanpa biaya.',
        },
        {
            q: 'Apakah data saya aman?',
            a: 'Tentu. Kami menggunakan enkripsi dan keamanan standar industri untuk melindungi datamu.',
        },
        {
            q: 'Apakah butuh koneksi internet?',
            a: 'Ya, aplikasi ini berbasis web, jadi koneksi internet diperlukan untuk akses data.',
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach((el) => {
                const elementTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (elementTop < windowHeight - 50) {
                    el.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Selamat Datang di EMKM" />
            <div className="min-h-screen bg-white text-gray-800 transition-colors duration-500 ease-in-out dark:bg-gray-900 dark:text-gray-100">
                <Navbar auth={auth} className="fixed z-40 bg-gray-800 text-white">
                    <Link href="/">Home</Link>
                    <Link href="/about">Tentang</Link>
                    <Link href="/contact">Kontak</Link>
                    <Link href="/education">Edukasi</Link>
                </Navbar>
                {/* Hero */}
                <section className="relative overflow-hidden px-4 py-24" style={{ backgroundColor: darkBlue }}>
                    <div className="container mx-auto flex flex-col-reverse items-center gap-10 md:flex-row">
                        {/* Kiri */}
                        <div className="reveal flex-1 translate-y-10 opacity-0 transition-all duration-700">
                            <h1 className="mb-6 text-4xl leading-tight font-bold text-white sm:text-5xl">
                                Solusi Digital untuk <span style={{ color: primary }}>UMKM</span> Indonesia
                            </h1>
                            <p className="mb-6 max-w-xl text-lg text-white/90">
                                EMKM membantu pelaku usaha kecil dalam mengelola keuangan, menganalisis performa, dan mengambil keputusan cerdas untuk
                                pertumbuhan bisnis.
                            </p>
                            <Link
                                href={route(auth.user ? 'dashboard' : 'register')}
                                className="inline-block rounded-md px-6 py-3 font-semibold transition hover:scale-105"
                                style={{ backgroundColor: orange, color: 'white' }}
                            >
                                {auth.user ? 'Masuk ke Dashboard' : 'Mulai Sekarang'}
                            </Link>
                        </div>

                        {/* Kanan */}
                        <div className="reveal flex flex-1 translate-y-10 justify-center opacity-0 transition-all delay-100 duration-700">
                            <img
                                src="/images/hero.jpg"
                                alt="UMKM Illustration"
                                className="w-[350px] rounded-xl object-contain shadow-xl md:w-[450px]"
                            />
                        </div>
                    </div>
                </section>
                {/* Stat Bar */}
                <section className="bg-gray-800 py-10 shadow-md">
                    <div className="container mx-auto grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                        {[
                            ['500K+', 'UMKM Terbantu'],
                            ['98%', 'Puas dengan Laporan'],
                            ['24/7', 'Akses Aplikasi'],
                            ['#1', 'Pilihan UMKM Digital'],
                        ].map(([val, label], idx) => (
                            <div key={idx}>
                                <p className="text-2xl font-bold" style={{ color: primary }}>
                                    {val}
                                </p>
                                <p className="text-sm">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>
                {/* Segment */}
                <section className="py-16" style={{ backgroundColor: softBlue }}>
                    <div className="container mx-auto text-center">
                        <h2 className="reveal mb-10 translate-y-10 text-3xl font-bold text-black opacity-0 transition-all duration-700">
                            Untuk Siapa EMKM Dibuat?
                        </h2>
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                            {[
                                { title: 'Warung Makan', desc: 'Atur transaksi dan stok secara rapi dan praktis.' },
                                { title: 'Online Shop', desc: 'Pantau omzet dan laporan harian secara otomatis.' },
                                { title: 'Jasa Service', desc: 'Catat pemasukan, pengeluaran, dan tagihan pelanggan.' },
                                { title: 'Freelancer', desc: 'Hitung pendapatan proyek dan biaya operasional.' },
                            ].map((seg, idx) => (
                                <div
                                    key={idx}
                                    className="reveal translate-y-10 transform rounded-lg bg-white p-6 opacity-0 shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800"
                                >
                                    <h3 className="mb-2 text-lg font-semibold">{seg.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{seg.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Video CTA */}
                <section className="relative bg-white py-16 text-center" style={{ backgroundColor: darkBlue }}>
                    <h2 className="reveal mb-6 translate-y-10 text-3xl font-bold opacity-0 transition-all duration-700">
                        Lihat Bagaimana EMKM Bekerja
                    </h2>
                    <div className="reveal relative mx-auto max-w-4xl translate-y-10 opacity-0 transition-all delay-100 duration-700">
                        <div className="overflow-hidden rounded-xl shadow-xl transition duration-300 hover:shadow-2xl">
                            <iframe
                                className="aspect-video w-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Demo EMKM"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </section>
                {/* Features */}
                <section className="py-16 text-black" style={{ backgroundColor: softBlue }}>
                    <div className="container mx-auto px-4">
                        <h2 className="reveal mb-20 translate-y-10 text-center text-3xl font-bold opacity-0 transition-all duration-700">
                            Fitur Utama EMKM
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {features.map((feat, idx) => (
                                <Card key={idx} className="bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                    <CardHeader>
                                        <div className="mb-4">{feat.icon}</div>
                                        <CardTitle className="text-lg font-semibold text-black">{feat.title}</CardTitle>
                                        <CardDescription className="text-sm text-gray-600">{feat.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Fitur Unggulan */}
                <section className="py-16" style={{ backgroundColor: darkBlue }}>
                    <div className="container mx-auto px-4">
                        <h2 className="reveal mb-20 translate-y-10 text-center text-3xl font-bold text-white opacity-0 transition-all duration-700">
                            Fitur Unggulan yang Disesuaikan dengan Kebutuhanmu
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {primaryFeatures.map((item, idx) => (
                                <Card
                                    key={idx}
                                    className="rounded-2xl bg-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02]"
                                >
                                    <CardHeader>
                                        <div className="mb-4 text-4xl">{item.icon}</div>
                                        <CardTitle className="text-xl font-semibold text-black">{item.title}</CardTitle>
                                        <CardDescription className="text-sm text-gray-700">{item.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="bg-[#dff2ff] py-16" id="pricing">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-12 text-center text-3xl font-bold text-[#216778]">Pilih Paket Sesuai Kebutuhanmu</h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            {plans.map((plan, idx) => (
                                <Card key={idx} className="rounded-xl bg-white shadow transition hover:shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold text-[#216778]">{plan.title}</CardTitle>
                                        <p className="text-2xl font-bold text-[#216778]">{plan.price}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="mb-6 space-y-2 text-sm text-gray-700">
                                            {plan.features.map((f, i) => (
                                                <li key={i} className="flex items-center">
                                                    <Check className="h-4 w-4 text-green-600" />
                                                    <span className="ml-2">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <button className="w-full rounded bg-[#fca652] py-2 text-white transition hover:bg-orange-500">
                                            {plan.cta}
                                        </button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="bg-white py-16" id="faq">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-12 text-center text-3xl font-bold text-[#216778]">Pertanyaan Umum</h2>
                        <div className="mx-auto max-w-2xl">
                            <Accordion type="single" collapsible>
                                {faqs.map((item, i) => (
                                    <AccordionItem key={i} value={`faq-${i}`} className="mb-4 rounded-lg border px-4 shadow-sm">
                                        <AccordionTrigger className="flex items-center justify-between py-4 text-[#216778] hover:no-underline">
                                            <span className="font-semibold">{item.q}</span>
                                            <ChevronDown className="accordion-trigger-icon h-5 w-5 shrink-0 text-[#216778] transition-transform duration-300" />
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-4 text-gray-700">{item.a}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </section>
                <section className="bg-[#216778] py-20 text-center text-white">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-4 text-3xl font-bold">Saatnya bawa bisnismu naik level bersama EMKM</h2>
                        <p className="mb-6 text-lg">Mulai kelola keuanganmu secara cerdas dan otomatis hari ini juga!</p>
                        <a
                            href="#pricing"
                            className="inline-block rounded-lg bg-[#fca652] px-6 py-3 font-semibold text-white transition hover:bg-orange-500"
                        >
                            ✨ Daftar Sekarang Gratis!
                        </a>
                    </div>
                </section>
                {/* Footer */}
                <footer style={{ backgroundColor: darkBlue }} className="py-6 text-center text-sm text-white">
                    &copy; {new Date().getFullYear()} EMKM. Seluruh hak cipta dilindungi.
                </footer>
            </div>

            {/* Reveal Animation CSS */}
            <style>
                {`
                    .reveal {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    .reveal.active {
                        opacity: 1;
                        transform: translateY(0);
                        transition: all 0.6s ease-out;
                    }
                `}
            </style>
        </>
    );
}
