import AdBanner from '@/components/add-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SkipLink } from '@/components/ui/skip-link';
import { useArticleFilter } from '@/hooks/useArticleFilter';
import { Head, Link, usePage } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ArrowRight, BookOpen, Calendar, Clock, Search, Star, User } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';
import { useEffect, useState } from 'react';

export default function Education() {
    const { auth, articles } = usePage<{
        auth: { user: any };
        articles: {
            data: {
                id: number;
                title: string;
                slug: string;
                excerpt: string;
                published_at: string;
                author?: string;
                reading_time?: number;
                category?: string;
                thumbnail_url?: string | null;
            }[];
            links: { url: string | null; label: string; active: boolean }[];
        };
    }>().props;

    const {
        searchTerm,
        selectedCategory,
        setSearchTerm,
        setSelectedCategory,
        filteredArticles,
        categories,
        resetFilters,
        totalArticles,
        filteredCount,
        hasActiveFilters,
    } = useArticleFilter({ articles: articles.data });

    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    moment.locale('id'); // Set locale to Indonesian

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
            document.querySelectorAll('.reveal').forEach((el) => {
                const elementTop = el.getBoundingClientRect().top;
                if (elementTop < window.innerHeight - 50) {
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
            <Head title="Education - Artikel" />

            {/* Skip Link for Accessibility */}
            <SkipLink href="#main-content">Langsung ke konten utama</SkipLink>

            <div className="min-h-screen bg-background text-foreground">
                {/* Navbar */}
                <header
                    className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
                        scrolled ? 'bg-white/70 shadow-sm backdrop-blur-md' : 'bg-transparent'
                    }`}
                >
                    <div className="container mx-auto flex items-center justify-between px-6 py-4">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center space-x-2">
                            <img src="/images/emkm.png" alt="logo" className="h-10 w-auto" />
                        </Link>

                        {/* Desktop Menu */}
                        <nav className="hidden items-center space-x-8 lg:flex">
                            <Link
                                href={route('home')}
                                className={`text-base font-medium transition ${
                                    scrolled ? 'text-gray-800 hover:text-[#23627C]' : 'text-gray-800 hover:text-[#23627C]'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href={route('home') + '#fitur'}
                                className={`text-base font-medium transition ${
                                    scrolled ? 'text-gray-800 hover:text-[#23627C]' : 'text-gray-800 hover:text-[#23627C]'
                                }`}
                            >
                                Fitur
                            </Link>
                            <Link
                                href={route('home') + '#about'}
                                className={`text-base font-medium transition ${
                                    scrolled ? 'text-gray-800 hover:text-[#23627C]' : 'text-gray-800 hover:text-[#23627C]'
                                }`}
                            >
                                About
                            </Link>
                            <Link
                                href={route('home') + '#pricing'}
                                className={`text-base font-medium transition ${
                                    scrolled ? 'text-gray-800 hover:text-[#23627C]' : 'text-gray-800 hover:text-[#23627C]'
                                }`}
                            >
                                Pricing
                            </Link>
                            <Link
                                href={route('home') + '#team'}
                                className={`text-base font-medium transition ${
                                    scrolled ? 'text-gray-800 hover:text-[#23627C]' : 'text-gray-800 hover:text-[#23627C]'
                                }`}
                            >
                                Team
                            </Link>
                            <Link
                                href={route('home') + '#contact'}
                                className={`text-base font-medium transition ${
                                    scrolled ? 'text-gray-800 hover:text-[#23627C]' : 'text-gray-800 hover:text-[#23627C]'
                                }`}
                            >
                                Contact
                            </Link>
                            <Link
                                href={route('education.article.index')}
                                className={`text-base font-medium transition ${
                                    scrolled ? 'text-gray-800 hover:text-[#23627C]' : 'text-gray-800 hover:text-[#23627C]'
                                }`}
                            >
                                Education
                            </Link>
                        </nav>

                        {/* Action Buttons (Desktop) */}
                        <div className="hidden items-center space-x-4 sm:flex">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-primary px-5 py-2 text-base font-medium text-white transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md bg-primary px-5 py-2 text-base font-medium text-white transition"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md border border-[#23627C] bg-white px-5 py-2 text-base font-medium text-[#23627C] transition hover:bg-[#23627C] hover:text-white"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Hamburger Button (Mobile) */}
                        <button onClick={() => setIsOpen(!isOpen)} className="block text-gray-700 focus:outline-none lg:hidden">
                            {isOpen ? (
                                // Icon Close
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                // Icon Hamburger
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        className={`absolute top-full left-0 w-full bg-white/70 shadow-md backdrop-blur-md transition-all duration-300 lg:hidden ${
                            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                        }`}
                    >
                        <nav className="flex flex-col space-y-4 px-6 py-6 text-left">
                            <Link
                                href={route('home')}
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-gray-800 transition hover:text-[#23627C]"
                            >
                                Home
                            </Link>
                            <Link
                                href={route('home') + '#fitur'}
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-gray-800 transition hover:text-[#23627C]"
                            >
                                Fitur
                            </Link>
                            <Link
                                href={route('home') + '#about'}
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-gray-800 transition hover:text-[#23627C]"
                            >
                                About
                            </Link>
                            <Link
                                href={route('home') + '#pricing'}
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-gray-800 transition hover:text-[#23627C]"
                            >
                                Pricing
                            </Link>
                            <Link
                                href={route('home') + '#team'}
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-gray-800 transition hover:text-[#23627C]"
                            >
                                Team
                            </Link>
                            <Link
                                href={route('home') + '#contact'}
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-gray-800 transition hover:text-[#23627C]"
                            >
                                Contact
                            </Link>
                            <Link
                                href={route('education.article.index')}
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-gray-800 transition hover:text-[#23627C]"
                            >
                                Education
                            </Link>

                            {/* Mobile Action Buttons */}
                            <div className="flex flex-col space-y-3 pt-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md bg-primary px-6 py-2 text-base font-medium text-white transition"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md bg-primary px-6 py-2 text-base font-medium text-white transition"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md border border-[#23627C] bg-white/80 px-6 py-2 text-base font-medium text-[#23627C] transition hover:bg-[#23627C] hover:text-white"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Enhanced Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-[#D3EDFF] via-[#E8F4FD] to-[#F0F9FF] py-20 md:py-28">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-teal-600/5"></div>
                    <div className="container mx-auto max-w-screen-xl px-4">
                        <div className="text-center">
                            <Badge variant="secondary" className="mb-4 bg-[#23BBB7]/10 text-[#23627C] hover:bg-[#23BBB7]/20">
                                <BookOpen className="mr-1 h-3 w-3" />
                                Pusat Pembelajaran UMKM
                            </Badge>
                            <h1 className="reveal mb-6 text-4xl font-bold text-[#23627C] opacity-0 transition-all duration-700 md:text-6xl lg:text-7xl">
                                Artikel & <span className="text-[#23BBB7]">Edukasi</span>
                            </h1>
                            <p className="reveal mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-[#23627C]/80 opacity-0 transition-all delay-100 duration-700 md:text-xl">
                                Jelajahi artikel terbaru tentang digitalisasi UMKM, tips bisnis, dan strategi pengembangan usaha untuk meningkatkan
                                performa bisnis Anda
                            </p>

                            {/* Search and Filter Section */}
                            <div className="reveal mx-auto mb-8 max-w-4xl space-y-4 opacity-0 transition-all delay-200 duration-700">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
                                    <div className="relative max-w-md flex-1">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Cari artikel..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-white/20 bg-white/80 pl-10 backdrop-blur-sm focus:border-[#23BBB7] focus:ring-[#23BBB7]"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setSelectedCategory('all')}
                                            className={
                                                selectedCategory === 'all'
                                                    ? 'bg-[#23BBB7] hover:bg-[#23627C]'
                                                    : 'border-white/20 bg-white/80 hover:bg-white'
                                            }
                                        >
                                            Semua
                                        </Button>
                                        {categories
                                            .filter((cat) => cat !== 'all')
                                            .map((category) => (
                                                <Button
                                                    key={category}
                                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setSelectedCategory(category || 'all')}
                                                    className={
                                                        selectedCategory === category
                                                            ? 'bg-[#23BBB7] hover:bg-[#23627C]'
                                                            : 'border-white/20 bg-white/80 hover:bg-white'
                                                    }
                                                >
                                                    {category}
                                                </Button>
                                            ))}
                                    </div>
                                </div>

                                {/* Results Counter */}
                                <p className="text-sm text-[#23627C]/60">
                                    Menampilkan {filteredCount} dari {totalArticles} artikel
                                    {searchTerm && <span className="font-medium"> untuk "{searchTerm}"</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Iklan AdSense */}
                <AdBanner />

                {/* Enhanced Stat Bar */}
                <section className="border-y bg-white py-12 shadow-sm">
                    <div className="container mx-auto max-w-screen-xl px-4">
                        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                            {[
                                { value: '100+', label: 'Artikel Berkualitas', icon: BookOpen },
                                { value: 'Gratis', label: 'Akses Selamanya', icon: Star },
                                { value: '24/7', label: 'Tersedia Online', icon: Clock },
                                { value: 'Terpercaya', label: 'Sumber Informasi', icon: User },
                            ].map(({ value, label, icon: Icon }, idx) => (
                                <div key={idx} className="reveal group cursor-default opacity-0 transition-all duration-700 hover:scale-105">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#23BBB7]/10 transition-colors group-hover:bg-[#23BBB7]/20">
                                        <Icon className="h-6 w-6 text-[#23BBB7]" />
                                    </div>
                                    <p className="text-2xl font-extrabold text-[#23BBB7] md:text-3xl">{value}</p>
                                    <p className="text-sm text-[#23627C]/70 md:text-base">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Enhanced Articles Section */}
                <main id="main-content" className="bg-gradient-to-b from-[#F8FBFF] to-white py-20">
                    <div className="container mx-auto max-w-screen-xl px-4">
                        <div className="mb-12 text-center">
                            <h2 className="reveal mb-4 text-3xl font-bold text-[#23627C] opacity-0 transition-all duration-700 md:text-4xl">
                                Artikel Terbaru
                            </h2>
                            <p className="reveal mx-auto max-w-2xl text-lg text-[#23627C]/70 opacity-0 transition-all delay-100 duration-700">
                                Temukan wawasan terbaru tentang digitalisasi UMKM dan strategi bisnis yang efektif
                            </p>
                        </div>

                        {filteredArticles.length === 0 ? (
                            /* Empty State */
                            <div className="reveal flex flex-col items-center justify-center py-16 text-center opacity-0 transition-all duration-700">
                                <div className="mb-4 rounded-full bg-gray-100 p-6">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-600">Artikel tidak ditemukan</h3>
                                <p className="mb-4 text-gray-500">
                                    {searchTerm
                                        ? `Tidak ada artikel yang cocok dengan "${searchTerm}"`
                                        : 'Tidak ada artikel dalam kategori yang dipilih'}
                                </p>
                                <Button variant="outline" onClick={resetFilters}>
                                    Reset Filter
                                </Button>
                            </div>
                        ) : (
                            /* Articles Grid */
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredArticles.map((article, idx) => (
                                    <Card
                                        key={article.id}
                                        className="reveal group cursor-pointer overflow-hidden bg-white opacity-0 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                        style={{ transitionDelay: `${idx * 100}ms` }}
                                    >
                                        {/* Article Image Placeholder */}
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#23BBB7]/20 to-[#23627C]/20">
                                            {(article as any).thumbnail_url ? (
                                                <img
                                                    src={(article as any).thumbnail_url}
                                                    alt={article.title}
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            <div className="absolute bottom-3 left-3">
                                                <Badge variant="secondary" className="bg-white/90 text-[#23627C] backdrop-blur-sm">
                                                    {article.category || 'UMKM'}
                                                </Badge>
                                            </div>
                                            {/* Reading time indicator */}
                                            <div className="absolute top-3 right-3">
                                                <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs text-[#23627C] backdrop-blur-sm">
                                                    <Clock className="h-3 w-3" />
                                                    {article.reading_time || 5} min
                                                </div>
                                            </div>
                                        </div>

                                        <CardHeader className="p-6">
                                            {/* Date and Author */}
                                            <div className="mb-3 flex items-center gap-4 text-sm text-[#23627C]/60">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {moment(article.published_at).format('DD MMM YYYY')}
                                                </div>
                                                {article.author && (
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {article.author}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <CardTitle className="mb-3 line-clamp-2 text-lg font-bold text-[#23627C] transition-colors group-hover:text-[#23BBB7]">
                                                {article.title}
                                            </CardTitle>

                                            {/* Excerpt */}
                                            <CardDescription className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                                                {article.excerpt}
                                            </CardDescription>

                                            {/* Read More Link */}
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={route('education.article.show', article.slug) || '#'}
                                                    className="group/link flex items-center gap-1 text-sm font-medium text-[#23BBB7] transition-colors hover:text-[#23627C]"
                                                >
                                                    Baca Selengkapnya
                                                    <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
                                                </Link>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Load More Button */}
                        {filteredArticles.length > 0 &&
                            articles.links.some(
                                (link) => link.url && link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;' && !link.active,
                            ) && (
                                <div className="mt-12 text-center">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-[#23BBB7] text-[#23BBB7] hover:bg-[#23BBB7] hover:text-white"
                                    >
                                        Muat Artikel Lainnya
                                    </Button>
                                </div>
                            )}
                    </div>
                </main>

                {/* Enhanced Footer */}
                <footer className="border-t bg-gradient-to-r from-slate-50 to-blue-50">
                    <div className="mx-auto w-full max-w-screen-xl p-4 py-12 lg:py-16">
                        <div className="md:flex md:justify-between">
                            <div className="mb-8 md:mb-0">
                                <Link href="/" className="group flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#23BBB7] transition-transform group-hover:scale-110">
                                        <BookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="self-center text-2xl font-bold text-[#23627C] transition-colors group-hover:text-[#23BBB7]">
                                        EMKM
                                    </span>
                                </Link>
                                <p className="mt-4 max-w-sm text-sm text-gray-600">
                                    Platform pembelajaran digital untuk mengembangkan UMKM Indonesia menjadi lebih maju dan berkelanjutan.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
                                <div>
                                    <h3 className="mb-4 text-sm font-semibold tracking-wider text-[#23627C] uppercase">Pembelajaran</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>
                                            <Link href="#" className="transition-colors hover:text-[#23BBB7]">
                                                Artikel UMKM
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="transition-colors hover:text-[#23BBB7]">
                                                Panduan Digital
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="transition-colors hover:text-[#23BBB7]">
                                                Tips Bisnis
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="mb-4 text-sm font-semibold tracking-wider text-[#23627C] uppercase">Dukungan</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>
                                            <Link href="#" className="transition-colors hover:text-[#23BBB7]">
                                                Pusat Bantuan
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="transition-colors hover:text-[#23BBB7]">
                                                FAQ
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="transition-colors hover:text-[#23BBB7]">
                                                Hubungi Kami
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="mb-4 text-sm font-semibold tracking-wider text-[#23627C] uppercase">Legal</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>
                                            <Link href="#" className="transition-colors hover:text-[#23BBB7]">
                                                Kebijakan Privasi
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="transition-colors hover:text-[#23BBB7]">
                                                Syarat & Ketentuan
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <hr className="my-8 border-gray-200" />

                        <div className="sm:flex sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-500">
                                © 2025{' '}
                                <Link href="/" className="font-medium transition-colors hover:text-[#23BBB7]">
                                    EMKM
                                </Link>
                                . Semua hak dilindungi.
                            </p>

                            <div className="mt-4 flex space-x-4 sm:mt-0">
                                {[
                                    {
                                        name: 'Facebook',
                                        path: 'M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z',
                                    },
                                    {
                                        name: 'Twitter',
                                        path: 'M20 4.172a8.192 8.192 0 01-2.357.646 4.11 4.11 0 001.804-2.27 8.22 8.22 0 01-2.606.996A4.096 4.096 0 0013.847 2.5a4.1 4.1 0 00-4.1 4.1c0 .321.036.634.106.935A11.64 11.64 0 011.392 3.08a4.101 4.101 0 001.27 5.474 4.078 4.078 0 01-1.858-.514v.052a4.1 4.1 0 003.288 4.017 4.097 4.097 0 01-1.853.07 4.1 4.1 0 003.833 2.849A8.227 8.227 0 011 16.41a11.616 11.616 0 006.29 1.84c7.547 0 11.675-6.252 11.675-11.675 0-.178-.004-.355-.012-.53A8.348 8.348 0 0020 4.172Z',
                                    },
                                    {
                                        name: 'Instagram',
                                        path: 'M7.978 4c-2.205 0-4 1.795-4 4v8c0 2.205 1.795 4 4 4h8c2.205 0 4-1.795 4-4V8c0-2.205-1.795-4-4-4h-8zM12 5.865A2.135 2.135 0 1114.135 8 2.135 2.135 0 0112 5.865zM16 6a1 1 0 11-2 0 1 1 0 012 0zM12 8a4 4 0 100 8 4 4 0 000-8z',
                                    },
                                ].map((social) => (
                                    <Link key={social.name} href="#" className="text-gray-400 transition-colors hover:text-[#23BBB7]">
                                        <span className="sr-only">{social.name}</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d={social.path} clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Enhanced Reveal Animation Styles */}
            <style>{`
                .reveal { 
                    opacity: 0; 
                    transform: translateY(30px); 
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .reveal.active { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
                
                /* Line clamp utilities */
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                /* Smooth hover effects */
                .hover-lift {
                    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
                }
                
                .hover-lift:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #23BBB7;
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #23627C;
                }
            `}</style>
        </>
    );
}
