import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { SkipLink } from '@/components/ui/skip-link';
import { useArticleInteraction } from '@/hooks/useArticleInteraction';
import { Head, Link, usePage } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, Copy, Eye, Facebook, Heart, PrinterIcon, Share2, Tag, Twitter, User } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';
import { useEffect, useState } from 'react';

interface Article {
    id: number;
    title: string;
    slug: string;
    content_html: string;
    excerpt: string;
    published_at: string;
    author?: string;
    author_avatar?: string;
    reading_time?: number;
    category?: string;
    tags?: string[];
    views_count?: number;
    likes_count?: number;
    featured_image?: string;
    meta_description?: string;
}

interface RelatedArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    published_at: string;
    author?: string;
    category?: string;
    reading_time?: number;
}

export default function ArticleShow() {
    const { auth, article, relatedArticles } = usePage<{
        auth: { user: any };
        article: Article;
        relatedArticles?: RelatedArticle[];
    }>().props;

    const {
        isLiked,
        likesCount,
        readingProgress,
        isSticky,
        timeSpent,
        toggleLike,
        shareArticle,
        printArticle,
        formattedTimeSpent,
        readingCompletion,
    } = useArticleInteraction({
        initialLikes: article.likes_count || 0,
        articleId: article.id,
        articleSlug: article.slug,
    });

    const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    moment.locale('id');

    // AOS initialization and TOC generation
    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        // Generate Table of Contents
        const generateTOC = () => {
            const articleContent = document.getElementById('article-content');
            const tocContainer = document.getElementById('table-of-contents');

            if (!articleContent || !tocContainer) return;

            const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');

            if (headings.length === 0) return;

            const tocList = document.createElement('div');
            tocList.className = 'space-y-1';

            headings.forEach((heading, index) => {
                // Add ID to heading if it doesn't have one
                if (!heading.id) {
                    heading.id = `heading-${index}`;
                }

                const link = document.createElement('a');
                link.href = `#${heading.id}`;
                link.textContent = heading.textContent || '';
                link.className = `block px-3 py-1 rounded text-gray-600 hover:bg-gray-50 hover:text-[#23BBB7] transition-colors toc-link`;

                // Add indentation based on heading level
                const level = parseInt(heading.tagName[1]);
                link.style.paddingLeft = `${(level - 1) * 12 + 12}px`;

                // Smooth scroll
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    heading.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                });

                tocList.appendChild(link);
            });

            tocContainer.innerHTML = '';
            tocContainer.appendChild(tocList);
        };

        // Scroll spy for TOC
        const handleScrollSpy = () => {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const tocLinks = document.querySelectorAll('.toc-link');

            let activeHeading: Element | null = null;
            let closestDistance = Infinity;

            headings.forEach((heading) => {
                const rect = heading.getBoundingClientRect();
                const distance = Math.abs(rect.top - 100); // 100px offset for navbar

                if (distance < closestDistance && rect.top <= 150) {
                    closestDistance = distance;
                    activeHeading = heading;
                }
            });

            // Update active TOC link
            tocLinks.forEach((link) => {
                link.classList.remove('bg-[#23BBB7]/10', 'text-[#23BBB7]', 'font-medium');
                link.classList.add('text-gray-600');
            });

            if (activeHeading && (activeHeading as HTMLElement).id) {
                const activeLink = document.querySelector(`a[href="#${(activeHeading as HTMLElement).id}"]`);
                if (activeLink) {
                    activeLink.classList.remove('text-gray-600');
                    activeLink.classList.add('bg-[#23BBB7]/10', 'text-[#23BBB7]', 'font-medium');
                }
            }
        };

        // Initialize after content loads
        setTimeout(generateTOC, 100);

        window.addEventListener('scroll', handleScrollSpy);

        return () => {
            window.removeEventListener('scroll', handleScrollSpy);
        };
    }, []);

    // Navbar scroll handler (same behavior as article index)
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle share actions
    const handleShare = async (method: 'native' | 'copy' | 'twitter' | 'facebook' = 'native') => {
        const result = await shareArticle(method);

        if (result.success) {
            setShareMessage(
                method === 'copy' ? 'Link berhasil disalin!' : method === 'native' ? 'Berhasil dibagikan!' : 'Berhasil dibuka di ' + method,
            );
            setShareDropdownOpen(false);

            // Clear message after 3 seconds
            setTimeout(() => setShareMessage(''), 3000);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.share-dropdown')) {
                setShareDropdownOpen(false);
            }
        };

        if (shareDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [shareDropdownOpen]);

    return (
        <>
            <Head title={article.title} />

            {/* Meta description for SEO */}
            <meta name="description" content={article.meta_description || article.excerpt} />

            {/* Skip Link for Accessibility */}
            <SkipLink href="#article-content">Langsung ke artikel</SkipLink>

            {/* Reading Progress Bar */}
            <div
                className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-[#23BBB7] to-[#23627C] transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
            />

            <div className="min-h-screen bg-background text-foreground">
                {/* Navbar - same as article index */}
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
                                    <Link href={route('login')} className="rounded-md bg-primary px-5 py-2 text-base font-medium text-white transition">
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

                {/* Back Button - add top margin to avoid overlapping fixed navbar and tidy spacing */}
                <section className="border-b bg-white py-4 mt-20">
                    <div className="container mx-auto max-w-4xl px-4">
                        <Link
                            href={route('education.article.index')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#23627C] transition-colors hover:text-[#23BBB7]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Artikel
                        </Link>
                    </div>
                </section>

                {/* Article Header */}
                <header className="relative bg-gradient-to-b from-[#F8FBFF] to-white py-12">
                    <div className="container mx-auto max-w-4xl px-4">
                        <div className="text-center" data-aos="fade-up">
                            {/* Category Badge */}
                            <Badge variant="secondary" className="mb-4 bg-[#23BBB7]/10 text-[#23627C] hover:bg-[#23BBB7]/20">
                                <Tag className="mr-1 h-3 w-3" />
                                {article.category || 'UMKM'}
                            </Badge>

                            {/* Article Title */}
                            <h1 className="mb-6 text-3xl leading-tight font-bold text-[#23627C] md:text-4xl lg:text-5xl">{article.title}</h1>

                            {/* Article Meta */}
                            <div className="mb-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#23627C]/70">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{article.author || 'Admin EMKM'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{moment(article.published_at).format('DD MMMM YYYY')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{article.reading_time || 5} menit baca</span>
                                </div>
                                {article.views_count && (
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span>{article.views_count.toLocaleString()} views</span>
                                    </div>
                                )}
                            </div>

                            {/* Article Excerpt */}
                            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#23627C]/80">{article.excerpt}</p>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {article.featured_image && (
                    <section className="bg-white" data-aos="fade-up">
                        <div className="container mx-auto max-w-4xl px-4">
                            <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-[#23BBB7]/20 to-[#23627C]/20 shadow-lg">
                                <img src={article.featured_image} alt={article.title} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Content */}
                <main className="py-12">
                    <div className="container mx-auto max-w-4xl px-4">
                        <div className="grid gap-8 lg:grid-cols-12">
                            {/* Article Content */}
                            <article id="article-content" className="lg:col-span-8" data-aos="fade-up">
                                <div
                                    className={`mb-8 transition-all duration-300 ${isSticky ? 'sticky top-20 z-30 rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur-sm' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Social Actions */}
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={toggleLike}
                                                className={`transition-colors ${isLiked ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' : 'hover:border-[#23BBB7] hover:text-[#23BBB7]'}`}
                                            >
                                                <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                                                {likesCount}
                                            </Button>

                                            {/* Share Dropdown */}
                                            <div className="share-dropdown relative">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                                                    className="hover:border-[#23BBB7] hover:text-[#23BBB7]"
                                                >
                                                    <Share2 className="mr-2 h-4 w-4" />
                                                    Bagikan
                                                </Button>

                                                {shareDropdownOpen && (
                                                    <div className="absolute top-full left-0 z-40 mt-2 w-48 rounded-lg border bg-white shadow-lg">
                                                        <div className="space-y-1 p-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleShare('copy')}
                                                                className="w-full justify-start text-left hover:bg-gray-50"
                                                            >
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Salin Link
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleShare('facebook')}
                                                                className="w-full justify-start text-left hover:bg-blue-50 hover:text-blue-600"
                                                            >
                                                                <Facebook className="mr-2 h-4 w-4" />
                                                                Facebook
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleShare('twitter')}
                                                                className="w-full justify-start text-left hover:bg-sky-50 hover:text-sky-600"
                                                            >
                                                                <Twitter className="mr-2 h-4 w-4" />
                                                                Twitter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={printArticle}
                                                className="hover:border-[#23BBB7] hover:text-[#23BBB7]"
                                            >
                                                <PrinterIcon className="mr-2 h-4 w-4" />
                                                Print
                                            </Button>
                                        </div>

                                        {/* Reading Stats */}
                                        <div className="hidden items-center gap-4 text-xs text-gray-500 md:flex">
                                            <span>Dibaca {formattedTimeSpent}</span>
                                            <span>{readingCompletion}</span>
                                            <div className="h-1 w-16 rounded bg-gray-200">
                                                <div
                                                    className="h-full rounded bg-[#23BBB7] transition-all duration-300"
                                                    style={{ width: `${readingProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Share Message */}
                                    {shareMessage && (
                                        <div className="mt-3 rounded border border-green-200 bg-green-50 p-2 text-sm text-green-700">
                                            {shareMessage}
                                        </div>
                                    )}
                                </div>

                                {/* Article Body */}
                                <div className="prose prose-lg max-w-none prose-headings:text-[#23627C] prose-p:leading-relaxed prose-p:text-gray-700 prose-a:text-[#23BBB7] prose-a:no-underline hover:prose-a:text-[#23627C] prose-blockquote:border-l-[#23BBB7] prose-blockquote:bg-[#23BBB7]/5 prose-blockquote:px-4 prose-blockquote:py-2 prose-strong:text-[#23627C]">
                                    {article.content_html ? (
                                        <div dangerouslySetInnerHTML={{ __html: article.content_html }} />
                                    ) : (
                                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                            <p className="text-gray-500">Konten artikel sedang dalam proses penambahan...</p>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {article.tags && article.tags.length > 0 && (
                                    <div className="mt-12 border-t pt-8">
                                        <h3 className="mb-4 text-lg font-semibold text-[#23627C]">Tags:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {article.tags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="cursor-pointer bg-[#23BBB7]/10 text-[#23627C] transition-colors hover:bg-[#23BBB7]/20"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Call to Action Section */}
                                <div className="mt-12 border-t pt-8">
                                    <Card className="border-[#23BBB7]/20 bg-gradient-to-br from-[#23BBB7]/10 to-[#23627C]/10">
                                        <CardContent className="p-8 text-center">
                                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#23BBB7]" />
                                            <h3 className="mb-3 text-xl font-bold text-[#23627C]">Suka dengan artikel ini?</h3>
                                            <p className="mb-6 text-gray-600">
                                                Jelajahi artikel lainnya untuk mendapatkan wawasan lebih dalam tentang digitalisasi UMKM
                                            </p>
                                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                                <Button asChild size="lg" className="bg-[#23BBB7] hover:bg-[#23627C]">
                                                    <Link href={route('education.article.index')}>
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        Lihat Artikel Lainnya
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    onClick={() => handleShare('native')}
                                                    className="border-[#23BBB7] text-[#23BBB7] hover:bg-[#23BBB7] hover:text-white"
                                                >
                                                    <Share2 className="mr-2 h-4 w-4" />
                                                    Bagikan Artikel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </article>

                            {/* Sidebar */}
                            <aside className="lg:col-span-4" data-aos="fade-up" data-aos-delay="200">
                                {/* Table of Contents */}
                                <Card className="sticky top-24 mb-8">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-[#23627C]">
                                            <BookOpen className="h-5 w-5" />
                                            Daftar Isi
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <nav className="space-y-2">
                                            {/* Auto-generated TOC from article headings */}
                                            <div id="table-of-contents" className="text-sm">
                                                {/* This will be populated by JavaScript */}
                                                <div className="space-y-1">
                                                    <a
                                                        href="#introduction"
                                                        className="block rounded px-3 py-1 text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#23BBB7]"
                                                    >
                                                        Pendahuluan
                                                    </a>
                                                    <a
                                                        href="#main-content"
                                                        className="block rounded px-3 py-1 text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#23BBB7]"
                                                    >
                                                        Konten Utama
                                                    </a>
                                                    <a
                                                        href="#conclusion"
                                                        className="block rounded px-3 py-1 text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#23BBB7]"
                                                    >
                                                        Kesimpulan
                                                    </a>
                                                </div>
                                            </div>
                                        </nav>

                                        {/* Reading Progress */}
                                        <div className="mt-4 border-t pt-4">
                                            <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                                                <span>Progress Membaca</span>
                                                <span>{Math.round(readingProgress)}%</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#23BBB7] to-[#23627C] transition-all duration-300"
                                                    style={{ width: `${readingProgress}%` }}
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">
                                                {readingCompletion} • {formattedTimeSpent}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Author Card */}
                                <Card className="mb-8 bg-gradient-to-br from-[#23BBB7]/5 to-[#23627C]/5">
                                    <CardHeader className="text-center">
                                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-[#23BBB7] to-[#23627C] p-4">
                                            <User className="h-8 w-8 text-white" />
                                        </div>
                                        <CardTitle className="text-[#23627C]">{article.author || 'Admin EMKM'}</CardTitle>
                                        <CardDescription>
                                            {'Kontributor ahli dalam bidang digitalisasi UMKM dan pengembangan bisnis.'}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>

                                {/* Related Articles */}
                                {relatedArticles && relatedArticles.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-[#23627C]">
                                                <BookOpen className="h-5 w-5" />
                                                Artikel Terkait
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {relatedArticles.slice(0, 3).map((relatedArticle) => (
                                                <Link
                                                    key={relatedArticle.id}
                                                    href={route('education.article.show', relatedArticle.slug)}
                                                    className="group block"
                                                >
                                                    <div className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50">
                                                        <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#23BBB7]/20 to-[#23627C]/20" />
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="mb-1 line-clamp-2 text-sm font-medium text-[#23627C] group-hover:text-[#23BBB7]">
                                                                {relatedArticle.title}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">
                                                                {moment(relatedArticle.published_at).format('DD MMM YYYY')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}
                            </aside>
                        </div>
                    </div>
                </main>

                {/* Article Navigation */}
                <section className="border-t bg-gray-50 py-8">
                    <div className="container mx-auto max-w-4xl px-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <Link
                                href={route('education.article.index')}
                                className="group flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="rounded-full bg-[#23BBB7]/10 p-2 transition-colors group-hover:bg-[#23BBB7]/20">
                                    <ArrowLeft className="h-4 w-4 text-[#23BBB7]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#23627C]">Kembali</p>
                                    <p className="text-xs text-gray-500">Semua Artikel</p>
                                </div>
                            </Link>

                            {relatedArticles && relatedArticles.length > 0 && (
                                <Link
                                    href={route('education.article.show', relatedArticles[0].slug)}
                                    className="group flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div>
                                        <p className="text-right text-sm font-medium text-[#23627C]">Selanjutnya</p>
                                        <p className="line-clamp-1 text-right text-xs text-gray-500">{relatedArticles[0].title}</p>
                                    </div>
                                    <div className="rounded-full bg-[#23BBB7]/10 p-2 transition-colors group-hover:bg-[#23BBB7]/20">
                                        <ArrowRight className="h-4 w-4 text-[#23BBB7]" />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

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
                                            <Link href={route('education.article.index')} className="transition-colors hover:text-[#23BBB7]">
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

            {/* Enhanced Styles */}
            <style>{`
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                /* Print styles */
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    
                    .print-friendly {
                        color: black !important;
                        background: white !important;
                    }
                    
                    .prose a {
                        color: black !important;
                        text-decoration: underline !important;
                    }
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
