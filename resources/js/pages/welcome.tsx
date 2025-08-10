import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
    BarChart3,
    BookOpen,
    Calculator,
    Check,
    DollarSign,
    FolderKanban,
    LineChart,
    NotebookPen,
    UserPlus,
    Users,
    Wallet,
} from 'lucide-react';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const primaryColor = '#23BBB7';
    const darkBlueColor = '#23627C';
    const softBlueColor = '#D3EDFF';
    const orangeColor = '#FFA14A';

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
        });
    }, []);

    const features = [
        {
            icon: <DollarSign className="h-10 w-10" style={{ color: primaryColor }} />,
            title: 'Manajemen Keuangan',
            desc: 'Catat pengeluaran dan pemasukan usaha harian Anda dengan sistem sederhana dan intuitif.',
        },
        {
            icon: <BarChart3 className="h-10 w-10" style={{ color: primaryColor }} />,
            title: 'Laporan Instan',
            desc: 'Lihat laporan laba-rugi dan arus kas secara otomatis dan real-time untuk analisis cepat.',
        },
        {
            icon: <Users className="h-10 w-10" style={{ color: primaryColor }} />,
            title: 'Kolaborasi Tim',
            desc: 'Bekerja sama dengan tim Anda untuk mengelola keuangan bisnis secara efisien dan transparan.',
        },
    ];

    const primaryFeatures = [
        {
            title: 'Registrasi & Login',
            desc: 'Pembuatan akun berdasarkan peran pengguna dalam sistem.',
            icon: <UserPlus style={{ color: darkBlueColor }} />,
        },
        {
            title: 'Pencatatan Keuangan Harian',
            desc: 'Input transaksi harian dengan kategori yang fleksibel.',
            icon: <NotebookPen style={{ color: darkBlueColor }} />,
        },
        {
            title: 'Laporan Keuangan Otomatis',
            desc: 'Laporan real-time untuk evaluasi dan analisis bisnis.',
            icon: <BarChart3 style={{ color: darkBlueColor }} />,
        },
        {
            title: 'Manajemen Kategori',
            desc: 'Kelola kategori sesuai kebutuhan bisnismu.',
            icon: <FolderKanban style={{ color: darkBlueColor }} />,
        },
        {
            title: 'Akses Edukasi',
            desc: 'Artikel & studi kasus untuk peningkatan finansial.',
            icon: <BookOpen style={{ color: darkBlueColor }} />,
        },
        {
            title: 'Dashboard Visual',
            desc: 'Grafik interaktif dan intuitif untuk memantau keuangan.',
            icon: <LineChart style={{ color: darkBlueColor }} />,
        },
        {
            title: 'Kalkulator HPP',
            desc: 'Hitung harga pokok & tentukan strategi jual terbaik.',
            icon: <Calculator style={{ color: darkBlueColor }} />,
        },
        {
            title: 'Simulasi Modal',
            desc: 'Simulasikan kebutuhan modal & break-even point.',
            icon: <Wallet style={{ color: darkBlueColor }} />,
        },
    ];

    const plans = [
        {
            title: 'Free',
            price: 'Rp 0',
            features: ['Pencatatan Dasar', 'Laporan Harian', 'Akses Edukasi'],
            cta: 'Coba Sekarang',
            variant: 'outline',
            popular: false,
        },
        {
            title: 'Basic',
            price: 'Rp 29.000 / bln',
            features: ['Semua Fitur Free', 'Laporan Bulanan', 'Notifikasi Otomatis'],
            cta: 'Coba Gratis 14 Hari',
            variant: 'blue',
            popular: true,
        },
        {
            title: 'Pro',
            price: 'Rp 59.000 / bln',
            features: ['Semua Fitur Basic', 'Grafik & Simulasi', 'Dukungan Prioritas'],
            cta: 'Mulai Langganan',
            variant: 'outline',
            popular: false,
        },
    ];

    const faqs = [
        {
            q: 'Apakah aplikasi ini gratis?',
            a: 'Ya! Anda bisa menggunakan versi Free untuk fitur dasar tanpa biaya selamanya. Untuk fitur yang lebih canggih, kami menyediakan paket berbayar yang terjangkau.',
        },
        {
            q: 'Apakah data saya aman di EMKM?',
            a: 'Tentu. Kami menggunakan enkripsi dan standar keamanan terkini untuk memastikan data bisnis Anda selalu aman dan terlindungi.',
        },
        {
            q: 'Apakah saya bisa mengaksesnya dari mana saja?',
            a: 'Betul. EMKM adalah aplikasi berbasis web, sehingga Anda dapat mengaksesnya dari perangkat apapun dan di mana pun selama terhubung dengan internet.',
        },
        {
            q: 'Bagaimana jika saya mengalami kesulitan?',
            a: 'Tim dukungan kami siap membantu Anda. Pengguna paket Pro akan mendapatkan prioritas dukungan untuk penyelesaian masalah yang lebih cepat.',
        },
    ];

    return (
        <>
            <Head title="Solusi Digital untuk UMKM Indonesia" />
            <div className="min-h-screen bg-white text-gray-800">
                <Navbar auth={auth} className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
                    <Link href="#fitur" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Fitur</Link>
                    <Link href="#harga" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Harga</Link>
                    <Link href="#faq" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">FAQ</Link>
                    <Link href="/education" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Edukasi</Link>
                </Navbar>

                <main>
                    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28" style={{ backgroundColor: softBlueColor }}>
                        <div className="container mx-auto flex flex-col items-center gap-12 px-4 text-center lg:flex-row lg:text-left">
                            <div className="lg:w-1/2" data-aos="fade-right">
                                <h1 className="text-4xl font-extrabold tracking-tight text-[#23627C] sm:text-5xl md:text-6xl">
                                    Solusi Digital untuk <span style={{ color: primaryColor }}>UMKM</span> Indonesia
                                </h1>
                                <p className="mt-6 max-w-xl text-lg text-gray-600 lg:mx-0">
                                    EMKM membantu Anda mengelola keuangan, menganalisis performa, dan mengambil keputusan cerdas untuk pertumbuhan bisnis.
                                </p>
                                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                                    <Link href={route(auth.user ? 'dashboard' : 'register')}>
                                        <Button size="lg" variant="orange" className="w-full transition-transform hover:scale-105 sm:w-auto">
                                            {auth.user ? 'Masuk ke Dashboard' : 'Mulai Sekarang, Gratis!'}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="lg:w-1/2" data-aos="fade-left" data-aos-delay="200">
                                <img
                                    src="/images/hero.jpg"
                                    alt="Ilustrasi UMKM"
                                    className="w-full max-w-md rounded-xl object-cover shadow-2xl lg:max-w-none"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="py-16" id="fitur">
                        <div className="container mx-auto px-4">
                            <div className="text-center" data-aos="fade-up">
                                <h2 className="text-3xl font-bold tracking-tight text-[#23627C]">Semua yang Anda Butuhkan untuk Berkembang</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                                    Dari pencatatan keuangan hingga analisis mendalam, EMKM menyediakan fitur lengkap dalam satu platform.
                                </p>
                            </div>
                            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                                {features.map((feat, idx) => (
                                    <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
                                        <Card className="h-full transform-gpu border-0 bg-gray-50/50 text-center shadow-none transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                            <CardHeader className="flex flex-col items-center">
                                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{backgroundColor: softBlueColor}}>
                                                    {feat.icon}
                                                </div>
                                                <CardTitle className="text-xl font-semibold text-[#23627C]">{feat.title}</CardTitle>
                                                <CardDescription className="mt-2 text-base">{feat.desc}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    
                    <section className="py-16" style={{ backgroundColor: softBlueColor }}>
                        <div className="container mx-auto px-4">
                            <div className="text-center" data-aos="fade-up">
                                <h2 className="text-3xl font-bold tracking-tight text-[#23627C]">Fitur Unggulan</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                                    Dirancang khusus untuk memenuhi kebutuhan unik para pelaku UMKM di Indonesia.
                                </p>
                            </div>
                            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                                {primaryFeatures.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4" data-aos="fade-up" data-aos-delay={idx * 50}>
                                        <div className="flex-shrink-0 rounded-lg p-3" style={{backgroundColor: primaryColor, color: 'white'}}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#23627C]">{item.title}</h3>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="py-16" id="harga">
                        <div className="container mx-auto px-4">
                            <div className="text-center" data-aos="fade-up">
                                <h2 className="text-3xl font-bold tracking-tight text-[#23627C]">Pilih Paket Sesuai Kebutuhanmu</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                                    Harga transparan dan fleksibel, dirancang untuk mendukung setiap tahap pertumbuhan bisnis Anda.
                                </p>
                            </div>
                            <div className="mt-12 grid max-w-4xl mx-auto gap-8 md:grid-cols-3">
                                {plans.map((plan, idx) => (
                                    <Card key={idx} className={`relative flex flex-col transform-gpu overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${plan.popular ? 'border-2 border-[#23BBB7]' : 'border border-gray-200'}`} data-aos="fade-up" data-aos-delay={idx * 100}>
                                        {plan.popular && (
                                            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 whitespace-nowrap bg-[#23BBB7] px-3 py-1 text-center text-sm font-semibold text-white">
                                                Paling Populer
                                            </div>
                                        )}
                                        <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                                            <CardTitle className="text-xl font-semibold text-[#23627C]">{plan.title}</CardTitle>
                                            <p className="text-3xl font-bold text-[#23627C]">{plan.price}</p>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <ul className="space-y-3 text-gray-700">
                                                {plan.features.map((f, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-1" />
                                                        <span className="ml-3">{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" variant={plan.variant as any} style={plan.variant === 'outline' ? {borderColor: '#23BBB7', color: '#23BBB7'} : {}}>
                                                {plan.cta}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="py-16" id="faq" style={{backgroundColor: softBlueColor}}>
                        <div className="container mx-auto px-4">
                             <div className="text-center" data-aos="fade-up">
                                <h2 className="text-3xl font-bold tracking-tight text-[#23627C]">Pertanyaan yang Sering Diajukan</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                                    Tidak menemukan jawaban yang Anda cari? Hubungi tim dukungan kami.
                                </p>
                            </div>
                            <div className="mx-auto mt-12 max-w-3xl" data-aos="fade-up" data-aos-delay="100">
                                <Accordion type="single" collapsible className="w-full space-y-3">
                                    {faqs.map((item, i) => (
                                        <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border bg-white px-4 shadow-sm transition-shadow hover:shadow-md">
                                            <AccordionTrigger className="py-4 text-left font-medium text-[#23627C] hover:no-underline">
                                                {item.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-4 pt-0 text-base text-gray-600">{item.a}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 text-center text-white" style={{ backgroundColor: darkBlueColor }}>
                        <div className="container mx-auto px-4" data-aos="fade-up">
                            <h2 className="text-3xl font-bold">Siap Bawa Bisnismu Naik Level?</h2>
                            <p className="mt-4 mb-8 max-w-xl mx-auto text-lg text-white/90">
                                Mulai kelola keuanganmu secara cerdas dan otomatis hari ini juga!
                            </p>
                            <Link href={route(auth.user ? 'dashboard' : 'register')}>
                                <Button size="lg" variant="orange" className="transform-gpu transition-transform hover:scale-105">
                                    Daftar Sekarang, Gratis!
                                </Button>
                            </Link>
                        </div>
                    </section>
                </main>
                
                <footer style={{ backgroundColor: darkBlueColor }} className="border-t border-t-white/10">
                    <div className="container mx-auto py-6 px-4 text-center text-sm text-white/70">
                        &copy; {new Date().getFullYear()} EMKM. Seluruh hak cipta dilindungi.
                    </div>
                </footer>
            </div>
        </>
    );
}