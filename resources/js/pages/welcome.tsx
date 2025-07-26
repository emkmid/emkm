import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { ArrowRight, BarChart, DollarSign, Users } from 'lucide-react';


export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: <DollarSign className="h-8 w-8 text-primary" />,
            title: 'Manajemen Keuangan',
            description: 'Lacak pemasukan dan pengeluaran UMKM Anda dengan mudah dan akurat.',
        },
        {
            icon: <BarChart className="h-8 w-8 text-primary" />,
            title: 'Laporan Analitis',
            description: 'Dapatkan laporan keuangan yang mendalam untuk membantu pengambilan keputusan bisnis.',
        },
        {
            icon: <Users className="h-8 w-8 text-primary" />,
            title: 'Kolaborasi Tim',
            description: 'Kelola akses untuk tim Anda dan berkolaborasi dalam mengelola keuangan bisnis.',
        },
    ];

    const testimonials = [
        {
            quote: 'Aplikasi ini benar-benar mengubah cara saya mengelola keuangan warung saya. Semuanya jadi lebih terorganisir!',
            name: 'Ibu Siti',
            role: 'Pemilik Warung Makan',
        },
        {
            quote: 'Laporan keuangannya sangat membantu saya untuk melihat perkembangan bisnis saya setiap bulan. Sangat direkomendasikan!',
            name: 'Bapak Budi',
            role: 'Pengusaha Katering',
        },
    ];

    return (
        <>
            <Head title="Selamat Datang di EMKM" />
            <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                            {/* Ganti dengan logo Anda jika ada */}
                            <svg
                                className="h-8 w-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <span className="text-xl font-semibold">EMKM</span>
                        </Link>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow">
                    {/* Hero Section */}
                    <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center transition-opacity duration-1000 ease-in animate-fade-in">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                            Kelola Keuangan <span className="text-primary">UMKM</span> Anda dengan Mudah
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                            EMKM adalah solusi lengkap untuk membantu Anda melacak, menganalisis, dan mengoptimalkan
                            keuangan bisnis Anda. Fokus pada pengembangan bisnis, biar kami yang urus angkanya.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Link
                                href={route('register')}
                                className="group inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white transition-transform hover:scale-105"
                            >
                                Mulai Sekarang
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="bg-white py-24 dark:bg-gray-800">
                        <div className="container mx-auto px-4">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                    Fitur Unggulan Kami
                                </h2>
                                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                                    Alat yang Anda butuhkan untuk membawa bisnis Anda ke level selanjutnya.
                                </p>
                            </div>
                            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="transform rounded-xl border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            {feature.icon}
                                        </div>
                                        <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="bg-gray-50 py-24 dark:bg-gray-900">
                        <div className="container mx-auto px-4">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                    Apa Kata Mereka?
                                </h2>
                            </div>
                            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                                {testimonials.map((testimonial, index) => (
                                    <figure
                                        key={index}
                                        className="rounded-xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
                                            <p>"{testimonial.quote}"</p>
                                        </blockquote>
                                        <figcaption className="mt-6 flex items-center gap-4">
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {testimonial.name}
                                                </div>
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    {testimonial.role}
                                                </div>
                                            </div>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-primary/90 py-20 text-white">
                        <div className="container mx-auto flex flex-col items-center px-4 text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Siap Mengoptimalkan Bisnis Anda?
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg opacity-90">
                                Bergabunglah dengan ratusan UMKM lain yang telah merasakan manfaatnya. Daftar gratis,
                                tanpa perlu kartu kredit.
                            </p>
                            <Link
                                href={route('register')}
                                className="mt-8 rounded-md bg-white px-8 py-3 text-base font-medium text-primary shadow-lg transition-transform hover:scale-105"
                            >
                                Daftar Sekarang, Gratis!
                            </Link>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-800">
                    <div className="container mx-auto py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} EMKM. Seluruh Hak Cipta Dilindungi.
                    </div>
                </footer>
            </div>
        </>
    );
}
