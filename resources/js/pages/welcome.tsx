import { Navbar } from '@/components/navbar';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import RotatingText from '@/textAnimations/RotatingText/RotatingText';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, BookOpen, Calculator, Check, DollarSign, FolderKanban, LineChart, NotebookPen, UserPlus, Users, Wallet } from 'lucide-react';

import person1 from '@/../images/person1.png';
import ChromaGrid from '@/components/ChromaGrid/ChromaGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const primaryColor = '#23BBB7';
    const darkBlueColor = '#23627C';
    const softBlueColor = '#D3EDFF';
    const orangeColor = '#FFA14A';

    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };

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

    const items = [
        {
            image: 'https://i.pravatar.cc/300?img=1',
            title: 'Andi Aryanto',
            subtitle: 'Frontend Developer',
            handle: '@sarahjohnson',
            borderColor: '#23627C',
            gradient: 'linear-gradient(145deg, #23627C, #000)',
            url: 'https://github.com/sarahjohnson',
        },
        {
            image: 'https://i.pravatar.cc/300?img=2',
            title: 'Rizky Hakim',
            subtitle: 'Backend Engineer',
            handle: '@mikechen',
            borderColor: '#23BBB7',
            gradient: 'linear-gradient(180deg, #23BBB7, #000)',
            url: 'https://linkedin.com/in/mikechen',
        },
        {
            image: 'https://i.pravatar.cc/300?img=2',
            title: 'Nazmie Fadhilah',
            subtitle: 'Marketing',
            handle: '@mikechen',
            borderColor: '#23BBB7',
            gradient: 'linear-gradient(180deg, #23BBB7, #000)',
            url: 'https://linkedin.com/in/mikechen',
        },
        {
            image: 'https://i.pravatar.cc/300?img=2',
            title: 'Muhammad Khairan',
            subtitle: 'Finance',
            handle: '@mikechen',
            borderColor: '#23627C',
            gradient: 'linear-gradient(180deg, #23627C, #000)',
            url: 'https://linkedin.com/in/mikechen',
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
        <div className="min-h-screen bg-white text-gray-800">
            <Navbar auth={auth} className="sticky top-0 z-50">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="hover:bg-[#23627C]">
                        <Link href="#" className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-200">
                            Beranda
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="hover:bg-[#23627C]">
                        <Link href="#" className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-200">
                            Tentang Kami
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="hover:bg-[#23627C]">
                        <Link href="#" className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-200">
                            Fitur
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="hover:bg-[#23627C]">
                        <Link href="#harga" className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-200">
                            Harga
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-gray-600 hover:bg-[#23627C]">Edukasi</NavigationMenuTrigger>
                    <NavigationMenuContent className="!bg-white">
                        <ul className="grid w-[200px] gap-4 bg-white text-gray-600">
                            <li>
                                <NavigationMenuLink asChild className="hover:bg-[#23627C]">
                                    <Link href={'#'}>Artikel</Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="bg-[#23627C] transition hover:bg-[#23BBB7]">
                        <Link href={route('login')}>Daftar Sekarang</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </Navbar>

            <section className="bg-sky-100">
                <div className="container mx-auto flex flex-col gap-5 px-5 md:flex-row md:items-center">
                    {/* LEFT: Text */}
                    <div className="fade-down flex-1 text-center md:text-start">
                        <h1 className="letter-wide text-2xl leading-relaxed font-medium md:text-4xl md:font-semibold">
                            Atur Usaha Lebih Mudah dengan EMKM{' '}
                            <RotatingText
                                texts={['Murah', 'Mudah & Cepat', 'Tanpa Ribet', 'Akses Dimana Saja']}
                                mainClassName="text-white inline-flex align-baseline bg-[#23627C] px-4 rounded-lg"
                                staggerFrom="last"
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '-120%' }}
                                staggerDuration={0.025}
                                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                                rotationInterval={2000}
                            />
                        </h1>

                        <p className="text-1xl mt-6 text-gray-500 md:text-xl">
                            Kelola penjualan, laporan, dan data bisnismu dalam satu platform praktis. Bantu UMKM lebih teratur dan berkembang.
                        </p>

                        <div className="mt-6 flex justify-center gap-3 md:justify-start">
                            <button className="cursor-pointer rounded-lg bg-[#23627C] px-6 py-3 font-medium text-white transition hover:bg-[#1b4d61]">
                                Coba Gratis
                            </button>
                            <button className="cursor-pointer rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-[#1b4d61] hover:text-white">
                                Pelajari Lebih Lanjut
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Image */}
                    <div className="fade-down relative flex flex-1 justify-end">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 z-0">
                            <path
                                fill="#23627C"
                                d="M41.9,-22.7C56,0.2,70.3,24.6,63.4,39.7C56.4,54.8,28.2,60.7,3.6,58.7C-21.1,56.6,-42.1,46.5,-51.9,29.8C-61.6,13.1,-60,-10.3,-49.5,-31.2C-39,-52,-19.5,-70.3,-2.8,-68.7C13.9,-67.1,27.8,-45.6,41.9,-22.7Z"
                                transform="translate(100 100)"
                            />
                        </svg>
                        <img src={person1} alt="" className="relative z-10 mx-auto h-auto w-2/3 max-w-sm md:w-full" />
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Bagian Card */}
                        <div className="fade-down order-2 grid grid-cols-2 grid-rows-2 gap-5 md:order-1">
                            <Card className="border border-[#23627C] bg-white">
                                <CardContent>
                                    <h3 className="text-3xl font-bold text-[#23BBB7]">100+</h3>
                                    <p className="text-gray-500">Kursus UMKM Digital</p>
                                </CardContent>
                            </Card>
                            <Card className="border border-[#23627C] bg-white">
                                <CardContent>
                                    <h3 className="text-3xl font-bold text-[#23BBB7]">100+</h3>
                                    <p className="text-gray-500">UMKM Bergabung</p>
                                </CardContent>
                            </Card>
                            <Card className="border border-[#23627C] bg-white">
                                <CardContent>
                                    <h3 className="text-3xl font-bold text-[#23BBB7]">Sertifikat</h3>
                                    <p className="text-gray-500">Edukasi Bersertifikat</p>
                                </CardContent>
                            </Card>
                            <Card className="border border-[#23627C] bg-white">
                                <CardContent>
                                    <h3 className="text-3xl font-bold text-[#23BBB7]">Komunitas</h3>
                                    <p className="text-gray-500">Pendamping UMKM</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Bagian About Us */}
                        <div className="fade-down order-1 md:order-2">
                            <div>
                                <p className="mb-2 text-sm tracking-widest text-[#23627C] uppercase">Tentang Kami</p>
                                <h2 className="text-3xl leading-normal font-semibold tracking-wide md:text-4xl">
                                    Wujudkan usaha mu dengan <span className="text-[#23627C]">EMKM</span>
                                </h2>
                                <p className="mt-5 text-gray-500">
                                    EMKM adalah platform digital yang dirancang khusus untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah dalam
                                    mengembangkan usahanya. Kami percaya bahwa setiap usaha, sekecil apapun, berhak mendapatkan kesempatan untuk
                                    tumbuh dan dikenal lebih luas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-sky-100 py-20">
                <div className="fade-down container mx-auto px-5">
                    <div className="text-center">
                        <p className="mb-2 text-sm tracking-widest text-[#23627C] uppercase">Fitur Unggulan</p>
                        <h2 className="text-3xl leading-normal font-semibold tracking-wide md:text-4xl">Fitur yang dapat membantu kamu</h2>
                    </div>

                    <div className="fade-down mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                        {primaryFeatures.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="flex-shrink-0 rounded-lg p-3" style={{ backgroundColor: primaryColor, color: 'white' }}>
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

            <section className="py-20">
                <div className="container mx-auto px-5">
                    <div className="fade-down text-center">
                        <p className="mb-2 text-sm tracking-widest text-[#23627C] uppercase">Harga Paket</p>
                        <h2 className="text-3xl leading-normal font-semibold tracking-wide md:text-4xl">Fitur Lengkap untuk Usaha Lebih Mudah</h2>
                    </div>

                    <div className="gird-cols-1 mt-10 grid gap-5 md:grid-cols-4">
                        {plans.map((plan, idx) => (
                            <Card
                                key={idx}
                                className={`relative flex transform-gpu flex-col overflow-hidden rounded-xl bg-white shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl ${plan.popular ? 'border-2 border-[#23BBB7]' : 'border border-gray-200'}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 bg-[#23BBB7] px-3 py-1 text-center text-sm font-semibold whitespace-nowrap text-white">
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
                                                <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                                                <span className="ml-3">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className={`w-full ${plan.variant === 'blue' ? '' : 'bg-transparent'}`}
                                        variant={plan.variant as any}
                                        style={plan.variant === 'outline' ? { borderColor: '#23BBB7', color: '#23BBB7' } : {}}
                                    >
                                        {plan.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-sky-100 pt-20">
                <div className="container mx-auto px-5">
                    <div className="grid grid-cols-1 items-stretch md:grid-cols-2">
                        {/* kiri */}
                        <div className="flex flex-col justify-center">
                            <p className="mb-2 text-sm tracking-widest text-[#23627C] uppercase">Our CEO</p>
                            <h2 className="text-3xl leading-normal font-semibold tracking-wide md:text-4xl">
                                Bertemulah dengan Founder <span className="text-[#23BBB7]">EMKM</span>
                            </h2>
                            <p className="mt-5 text-gray-500">
                                EMKM adalah platform digital yang dirancang khusus untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah...
                            </p>
                        </div>

                        {/* kanan */}
                        <div className="relative flex items-center justify-center">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 z-0 h-full w-full">
                                <path
                                    fill="#23627C"
                                    d="M41.9,-22.7C56,0.2,70.3,24.6,63.4,39.7C56.4,54.8,28.2,60.7,3.6,58.7C-21.1,56.6,-42.1,46.5,-51.9,29.8C-61.6,13.1,-60,-10.3,-49.5,-31.2C-39,-52,-19.5,-70.3,-2.8,-68.7C13.9,-67.1,27.8,-45.6,41.9,-22.7Z"
                                    transform="translate(100 100)"
                                />
                            </svg>
                            <img src={person1} alt="" className="relative z-10 h-auto max-h-[500px] w-auto object-contain" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-5">
                    <div className="mb-5 text-center">
                        <p className="mb-2 text-sm tracking-widest text-[#23627C] uppercase">EMKM's Team</p>
                        <h2 className="text-3xl leading-normal font-semibold tracking-wide md:text-4xl">Bersama, Kami Mewujudkan Impian UMKM</h2>
                    </div>

                    <ChromaGrid items={items} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" />
                </div>
            </section>

            <section className="bg-[#23627C] py-20">
                <div className="container mx-auto px-5">
                    <div className="grid grid-cols-1 grid-cols-2 items-center gap-5">
                        <div className="flex flex-col justify-center text-white">
                            <p className="mb-2 text-sm tracking-widest text-sky-200 uppercase">Coba Sekarang</p>
                            <h2 className="text-3xl leading-normal font-semibold tracking-wide md:text-4xl">
                                Siap untuk mewujudkan mimpi mu dan berkembang bersama kami?
                            </h2>
                            <p className="mt-5 text-gray-400">
                                Dari pencatatan keuangan hingga laporan bisnis — semua bisa kamu atur lebih praktis di satu platform.
                            </p>
                        </div>

                        <div className="flex justify-center gap-3">
                            <button className="cursor-pointer rounded-lg bg-[#23BBB7] px-6 py-3 font-medium text-white transition hover:bg-[#1b4d61]">
                                Coba Gratis
                            </button>
                            <button className="cursor-pointer rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-100 transition hover:bg-[#1b4d61] hover:text-white">
                                Daftar sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-sky-100">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <a href="https://flowbite.com/" className="flex items-center">
                                <img src="https://flowbite.com/docs/images/logo.svg" className="me-3 h-8" alt="FlowBite Logo" />
                                <span className="self-center text-2xl font-semibold whitespace-nowrap">EMKM</span>
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Resources</h2>
                                <ul className="font-medium text-gray-500">
                                    <li className="mb-4">
                                        <a href="https://flowbite.com/" className="hover:underline">
                                            EMKM
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://tailwindcss.com/" className="hover:underline">
                                            Tailwind CSS
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Follow us</h2>
                                <ul className="font-medium text-gray-500">
                                    <li className="mb-4">
                                        <a href="https://github.com/themesberg/flowbite" className="hover:underline">
                                            Github
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">
                                            Discord
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Legal</h2>
                                <ul className="font-medium text-gray-500">
                                    <li className="mb-4">
                                        <a href="#" className="hover:underline">
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline">
                                            Terms &amp; Conditions
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-gray-500 sm:text-center">
                            © 2025{' '}
                            <a href="https://flowbite.com/" className="hover:underline">
                                EMKM™
                            </a>
                            . All Rights Reserved.
                        </span>
                        <div className="mt-4 flex sm:mt-0 sm:justify-center">
                            <a href="#" className="text-gray-500 hover:text-gray-900">
                                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                                    <path
                                        fill-rule="evenodd"
                                        d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <span className="sr-only">Facebook page</span>
                            </a>
                            <a href="#" className="ms-5 text-gray-500 hover:text-gray-900">
                                <svg
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 21 16"
                                >
                                    <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                                </svg>
                                <span className="sr-only">Discord community</span>
                            </a>
                            <a href="#" className="ms-5 text-gray-500 hover:text-gray-900">
                                <svg
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 17"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <span className="sr-only">Twitter page</span>
                            </a>
                            <a href="#" className="ms-5 text-gray-500 hover:text-gray-900">
                                <svg
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <span className="sr-only">GitHub account</span>
                            </a>
                            <a href="#" className="ms-5 text-gray-500 hover:text-gray-900">
                                <svg
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <span className="sr-only">Dribbble account</span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
