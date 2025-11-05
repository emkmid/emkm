import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const primaryColor = '#23BBB7';
    const darkBlueColor = '#23627C';
    const softBlueColor = '#D3EDFF';
    const orangeColor = '#FFA14A';

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
    });

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const scriptURL = 'https://script.google.com/macros/s/AKfycbzwf2sghll0-ruWfnkhng_5V8J0N5azt4Q6FNnFLIRkyzwu7nhvjeO25bn0QHhf0A/exec';

        try {
            await fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(formData),
                mode: 'no-cors',
            });

            // langsung anggap sukses
            setAlertType('success');
            setAlertOpen(true);
            setFormData({ fullName: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error('Error:', error);
            setAlertType('error');
            setAlertOpen(true);
        }
    };

    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            price: 'Rp 29.000',
            features: ['Semua Fitur Free', 'Laporan Bulanan', 'Notifikasi Otomatis'],
            cta: 'Coba Gratis 14 Hari',
            variant: 'blue',
            popular: true,
        },
        {
            title: 'Pro',
            price: 'Rp 59.000',
            features: ['Semua Fitur Basic', 'Grafik & Simulasi', 'Dukungan Prioritas'],
            cta: 'Mulai Langganan',
            variant: 'outline',
            popular: false,
        },
    ];

    const navItems = [
        { label: 'Home', href: '#home' },
        { label: 'Fitur', href: '#fitur' },
        { label: 'About', href: '#about' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Team', href: '#team' },
        { label: 'Contact', href: '#contact' },
        { label: 'Education', href: '/education/articles' },
    ];

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-white text-gray-800">
                {/* Navbar */}
                <header
                    className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
                        scrolled ? 'bg-white/70 shadow-sm backdrop-blur-md' : 'bg-transparent'
                    }`}
                >
                    <div className="container mx-auto flex items-center justify-between px-6 py-4">
                        {/* Logo */}
                        <a href="/" className="flex items-center space-x-2">
                            <img src="/images/emkm.png" alt="logo" className="h-10 w-auto" />
                        </a>

                        {/* Desktop Menu */}
                        <nav className="hidden items-center space-x-8 lg:flex">
                            {navItems.map(({ label, href }) =>
                                href.startsWith('#') ? (
                                    <a
                                        key={label}
                                        href={href}
                                        className={`text-base font-medium transition ${
                                            scrolled ? 'text-gray-800 hover:text-[#23627C]' : 'text-white hover:text-gray-200'
                                        }`}
                                    >
                                        {label}
                                    </a>
                                ) : (
                                    <Link
                                        key={label}
                                        href={href}
                                        className={`text-base font-medium transition ${
                                            scrolled ? 'text-gray-800 hover:text-[#23627C]' : 'text-white hover:text-gray-200'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                ),
                            )}
                        </nav>

                        {/* Action Buttons (Desktop) */}
                        <div className="hidden items-center space-x-4 sm:flex">
                            <a href="signin.html" className="rounded-md bg-primary px-5 py-2 text-base font-medium text-white transition">
                                Sign In
                            </a>
                            <a
                                href="signup.html"
                                className="rounded-md border border-[#23627C] bg-white px-5 py-2 text-base font-medium text-[#23627C] transition hover:bg-[#23627C] hover:text-white"
                            >
                                Sign Up
                            </a>
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
                            {navItems.map(({ label, href }) =>
                                href.startsWith('#') ? (
                                    <a
                                        key={label}
                                        href={href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-base font-medium text-gray-800 transition hover:text-[#23627C]"
                                    >
                                        {label}
                                    </a>
                                ) : (
                                    <Link
                                        key={label}
                                        href={href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-base font-medium text-gray-800 transition hover:text-[#23627C]"
                                    >
                                        {label}
                                    </Link>
                                ),
                            )}

                            {/* Mobile Action Buttons */}
                            <div className="flex flex-col space-y-3 pt-4">
                                <a href="signin.html" className="rounded-md bg-primary px-6 py-2 text-base font-medium text-white transition">
                                    Sign In
                                </a>
                                <a
                                    href="signup.html"
                                    className="rounded-md border border-[#23627C] bg-white/80 px-6 py-2 text-base font-medium text-[#23627C] transition hover:bg-[#23627C] hover:text-white"
                                >
                                    Sign Up
                                </a>
                            </div>
                        </nav>
                    </div>
                </header>

                {/* End of Navbar */}

                {/* Hero Section */}
                <div id="home" className="relative overflow-hidden pt-[120px] md:pt-[130px] lg:pt-[160px]" style={{ backgroundColor: '#23627C' }}>
                    <div className="container mx-auto px-4">
                        <div className="-mx-4 flex flex-wrap items-center">
                            <div className="w-full px-4">
                                <div className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center" data-wow-delay=".2s">
                                    <h1 className="mb-6 text-3xl leading-snug font-bold text-white sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">
                                        Catat keuangan UMKM-mu Lebih Mudah Bersama EMKM
                                    </h1>
                                    <p className="mx-auto mb-9 max-w-[600px] text-base font-medium text-white sm:text-lg sm:leading-[1.44]">
                                        Kelola penjualan, laporan keuangan, dan data pelanggan dalam satu platform terpadu. Mulai Sekarang, Kembangkan
                                        Bisnismu Lebih Cepat!
                                    </p>
                                    <ul className="mb-10 flex flex-wrap items-center justify-center gap-5">
                                        <li>
                                            <a
                                                href="https://links.tailgrids.com/play-download"
                                                className="text-dark shadow-1 hover:bg-gray-2 hover:text-body-color inline-flex items-center justify-center rounded-md bg-white px-7 py-[14px] text-center text-base font-medium transition duration-300 ease-in-out"
                                            >
                                                Daftar Paket
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.instagram.com/emkm.id"
                                                target="_blank"
                                                className="flex items-center gap-4 rounded-md bg-white/[0.12] px-6 py-[14px] text-base font-medium text-white transition duration-300 ease-in-out hover:bg-white hover:text-slate-800"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M7.75 2C4.57436 2 2 4.57436 2 7.75V16.25C2 19.4256 4.57436 22 7.75 22H16.25C19.4256 22 22 19.4256 22 16.25V7.75C22 4.57436 19.4256 2 16.25 2H7.75ZM7.75 4H16.25C18.314 4 20 5.686 20 7.75V16.25C20 18.314 18.314 20 16.25 20H7.75C5.686 20 4 18.314 4 16.25V7.75C4 5.686 5.686 4 7.75 4ZM17.5 5.75C17.0858 5.75 16.75 6.08579 16.75 6.5C16.75 6.91421 17.0858 7.25 17.5 7.25C17.9142 7.25 18.25 6.91421 18.25 6.5C18.25 6.08579 17.9142 5.75 17.5 5.75ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z" />
                                                </svg>
                                                Follow Kami
                                            </a>
                                        </li>
                                    </ul>
                                    <div>
                                        <p className="mb-4 text-center text-base font-medium text-white">Berkerja sama dan disponsori oleh</p>
                                        <div className="wow fadeInUp flex items-center justify-center gap-4 text-center" data-wow-delay=".3s">
                                            <a href="#" className="group duration-300 ease-in-out" target="_blank">
                                                <img
                                                    src="/images/rb-logo.png"
                                                    alt="Rumah BUMN Logo"
                                                    className="h-8 w-auto opacity-60 grayscale filter transition group-hover:opacity-100 group-hover:grayscale-0"
                                                />
                                            </a>
                                            <a href="#" className="group duration-300 ease-in-out" target="_blank">
                                                <img
                                                    src="/images/p2pmw-logo.png"
                                                    alt="p2mw"
                                                    className="h-8 w-auto opacity-60 grayscale filter transition group-hover:opacity-100 group-hover:grayscale-0"
                                                />
                                            </a>

                                            {/* <a href="#" className="text-white/60 duration-300 ease-in-out hover:text-white" target="_blank">
                                                <svg
                                                    className="fill-current"
                                                    width="41"
                                                    height="26"
                                                    viewBox="0 0 41 26"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <mask
                                                        id="mask0_2005_10783"
                                                        style={{ maskType: 'luminance' }}
                                                        maskUnits="userSpaceOnUse"
                                                        x="0"
                                                        y="0"
                                                        width="41"
                                                        height="26"
                                                    >
                                                        <path d="M0.521393 0.949463H40.5214V25.0135H0.521393V0.949463Z" />
                                                    </mask>
                                                    <g mask="url(#mask0_2005_10783)">
                                                        <path d="M20.5214 0.980713C15.1882 0.980713 11.8546 3.64743 10.5214 8.98071C12.5214 6.31399 14.8546 5.31399 17.5214 5.98071C19.043 6.36103 20.1302 7.46495 21.3342 8.68667C23.295 10.6771 25.5642 12.9807 30.5214 12.9807C35.8546 12.9807 39.1882 10.314 40.5214 4.98071C38.5214 7.64743 36.1882 8.64743 33.5214 7.98071C31.9998 7.60039 30.9126 6.49651 29.7086 5.27479C27.7478 3.28431 25.4786 0.980713 20.5214 0.980713ZM10.5214 12.9807C5.18819 12.9807 1.85459 15.6474 0.521393 20.9807C2.52139 18.314 4.85459 17.314 7.52139 17.9807C9.04299 18.361 10.1302 19.465 11.3342 20.6867C13.295 22.6771 15.5642 24.9807 20.5214 24.9807C25.8546 24.9807 29.1882 22.314 30.5214 16.9807C28.5214 19.6474 26.1882 20.6474 23.5214 19.9807C21.9998 19.6004 20.9126 18.4965 19.7086 17.2748C17.7478 15.2843 15.4786 12.9807 10.5214 12.9807Z" />
                                                    </g>
                                                </svg>
                                            </a> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full px-4">
                                <div className="wow fadeInUp relative z-10 mx-auto max-w-[845px]" data-wow-delay=".25s">
                                    <div className="mt-16">
                                        <img src="/images/dashboard-hero.png" alt="hero" className="mx-auto max-w-full rounded-t-xl rounded-tr-xl" />
                                    </div>
                                    <div className="absolute bottom-0 -left-9 z-[-1]">
                                        <svg width="134" height="106" viewBox="0 0 134 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="1.66667" cy="104" r="1.66667" transform="rotate(-90 1.66667 104)" fill="white" />
                                            <circle cx="16.3333" cy="104" r="1.66667" transform="rotate(-90 16.3333 104)" fill="white" />
                                            <circle cx="31" cy="104" r="1.66667" transform="rotate(-90 31 104)" fill="white" />
                                            <circle cx="45.6667" cy="104" r="1.66667" transform="rotate(-90 45.6667 104)" fill="white" />
                                            <circle cx="60.3333" cy="104" r="1.66667" transform="rotate(-90 60.3333 104)" fill="white" />
                                            <circle cx="88.6667" cy="104" r="1.66667" transform="rotate(-90 88.6667 104)" fill="white" />
                                            <circle cx="117.667" cy="104" r="1.66667" transform="rotate(-90 117.667 104)" fill="white" />
                                            <circle cx="74.6667" cy="104" r="1.66667" transform="rotate(-90 74.6667 104)" fill="white" />
                                            <circle cx="103" cy="104" r="1.66667" transform="rotate(-90 103 104)" fill="white" />
                                            <circle cx="132" cy="104" r="1.66667" transform="rotate(-90 132 104)" fill="white" />
                                            <circle cx="1.66667" cy="89.3333" r="1.66667" transform="rotate(-90 1.66667 89.3333)" fill="white" />
                                            <circle cx="16.3333" cy="89.3333" r="1.66667" transform="rotate(-90 16.3333 89.3333)" fill="white" />
                                            <circle cx="31" cy="89.3333" r="1.66667" transform="rotate(-90 31 89.3333)" fill="white" />
                                            <circle cx="45.6667" cy="89.3333" r="1.66667" transform="rotate(-90 45.6667 89.3333)" fill="white" />
                                            <circle cx="60.3333" cy="89.3338" r="1.66667" transform="rotate(-90 60.3333 89.3338)" fill="white" />
                                            <circle cx="88.6667" cy="89.3338" r="1.66667" transform="rotate(-90 88.6667 89.3338)" fill="white" />
                                            <circle cx="117.667" cy="89.3338" r="1.66667" transform="rotate(-90 117.667 89.3338)" fill="white" />
                                            <circle cx="74.6667" cy="89.3338" r="1.66667" transform="rotate(-90 74.6667 89.3338)" fill="white" />
                                            <circle cx="103" cy="89.3338" r="1.66667" transform="rotate(-90 103 89.3338)" fill="white" />
                                            <circle cx="132" cy="89.3338" r="1.66667" transform="rotate(-90 132 89.3338)" fill="white" />
                                            <circle cx="1.66667" cy="74.6673" r="1.66667" transform="rotate(-90 1.66667 74.6673)" fill="white" />
                                            <circle cx="1.66667" cy="31.0003" r="1.66667" transform="rotate(-90 1.66667 31.0003)" fill="white" />
                                            <circle cx="16.3333" cy="74.6668" r="1.66667" transform="rotate(-90 16.3333 74.6668)" fill="white" />
                                            <circle cx="16.3333" cy="31.0003" r="1.66667" transform="rotate(-90 16.3333 31.0003)" fill="white" />
                                            <circle cx="31" cy="74.6668" r="1.66667" transform="rotate(-90 31 74.6668)" fill="white" />
                                            <circle cx="31" cy="31.0003" r="1.66667" transform="rotate(-90 31 31.0003)" fill="white" />
                                            <circle cx="45.6667" cy="74.6668" r="1.66667" transform="rotate(-90 45.6667 74.6668)" fill="white" />
                                            <circle cx="45.6667" cy="31.0003" r="1.66667" transform="rotate(-90 45.6667 31.0003)" fill="white" />
                                            <circle cx="60.3333" cy="74.6668" r="1.66667" transform="rotate(-90 60.3333 74.6668)" fill="white" />
                                            <circle cx="60.3333" cy="31.0001" r="1.66667" transform="rotate(-90 60.3333 31.0001)" fill="white" />
                                            <circle cx="88.6667" cy="74.6668" r="1.66667" transform="rotate(-90 88.6667 74.6668)" fill="white" />
                                            <circle cx="88.6667" cy="31.0001" r="1.66667" transform="rotate(-90 88.6667 31.0001)" fill="white" />
                                            <circle cx="117.667" cy="74.6668" r="1.66667" transform="rotate(-90 117.667 74.6668)" fill="white" />
                                            <circle cx="117.667" cy="31.0001" r="1.66667" transform="rotate(-90 117.667 31.0001)" fill="white" />
                                            <circle cx="74.6667" cy="74.6668" r="1.66667" transform="rotate(-90 74.6667 74.6668)" fill="white" />
                                            <circle cx="74.6667" cy="31.0001" r="1.66667" transform="rotate(-90 74.6667 31.0001)" fill="white" />
                                            <circle cx="103" cy="74.6668" r="1.66667" transform="rotate(-90 103 74.6668)" fill="white" />
                                            <circle cx="103" cy="31.0001" r="1.66667" transform="rotate(-90 103 31.0001)" fill="white" />
                                            <circle cx="132" cy="74.6668" r="1.66667" transform="rotate(-90 132 74.6668)" fill="white" />
                                            <circle cx="132" cy="31.0001" r="1.66667" transform="rotate(-90 132 31.0001)" fill="white" />
                                            <circle cx="1.66667" cy="60.0003" r="1.66667" transform="rotate(-90 1.66667 60.0003)" fill="white" />
                                            <circle cx="1.66667" cy="16.3336" r="1.66667" transform="rotate(-90 1.66667 16.3336)" fill="white" />
                                            <circle cx="16.3333" cy="60.0003" r="1.66667" transform="rotate(-90 16.3333 60.0003)" fill="white" />
                                            <circle cx="16.3333" cy="16.3336" r="1.66667" transform="rotate(-90 16.3333 16.3336)" fill="white" />
                                            <circle cx="31" cy="60.0003" r="1.66667" transform="rotate(-90 31 60.0003)" fill="white" />
                                            <circle cx="31" cy="16.3336" r="1.66667" transform="rotate(-90 31 16.3336)" fill="white" />
                                            <circle cx="45.6667" cy="60.0003" r="1.66667" transform="rotate(-90 45.6667 60.0003)" fill="white" />
                                            <circle cx="45.6667" cy="16.3336" r="1.66667" transform="rotate(-90 45.6667 16.3336)" fill="white" />
                                            <circle cx="60.3333" cy="60.0003" r="1.66667" transform="rotate(-90 60.3333 60.0003)" fill="white" />
                                            <circle cx="60.3333" cy="16.3336" r="1.66667" transform="rotate(-90 60.3333 16.3336)" fill="white" />
                                            <circle cx="88.6667" cy="60.0003" r="1.66667" transform="rotate(-90 88.6667 60.0003)" fill="white" />
                                            <circle cx="88.6667" cy="16.3336" r="1.66667" transform="rotate(-90 88.6667 16.3336)" fill="white" />
                                            <circle cx="117.667" cy="60.0003" r="1.66667" transform="rotate(-90 117.667 60.0003)" fill="white" />
                                            <circle cx="117.667" cy="16.3336" r="1.66667" transform="rotate(-90 117.667 16.3336)" fill="white" />
                                            <circle cx="74.6667" cy="60.0003" r="1.66667" transform="rotate(-90 74.6667 60.0003)" fill="white" />
                                            <circle cx="74.6667" cy="16.3336" r="1.66667" transform="rotate(-90 74.6667 16.3336)" fill="white" />
                                            <circle cx="103" cy="60.0003" r="1.66667" transform="rotate(-90 103 60.0003)" fill="white" />
                                            <circle cx="103" cy="16.3336" r="1.66667" transform="rotate(-90 103 16.3336)" fill="white" />
                                            <circle cx="132" cy="60.0003" r="1.66667" transform="rotate(-90 132 60.0003)" fill="white" />
                                            <circle cx="132" cy="16.3336" r="1.66667" transform="rotate(-90 132 16.3336)" fill="white" />
                                            <circle cx="1.66667" cy="45.3336" r="1.66667" transform="rotate(-90 1.66667 45.3336)" fill="white" />
                                            <circle cx="1.66667" cy="1.66683" r="1.66667" transform="rotate(-90 1.66667 1.66683)" fill="white" />
                                            <circle cx="16.3333" cy="45.3336" r="1.66667" transform="rotate(-90 16.3333 45.3336)" fill="white" />
                                            <circle cx="16.3333" cy="1.66683" r="1.66667" transform="rotate(-90 16.3333 1.66683)" fill="white" />
                                            <circle cx="31" cy="45.3336" r="1.66667" transform="rotate(-90 31 45.3336)" fill="white" />
                                            <circle cx="31" cy="1.66683" r="1.66667" transform="rotate(-90 31 1.66683)" fill="white" />
                                            <circle cx="45.6667" cy="45.3336" r="1.66667" transform="rotate(-90 45.6667 45.3336)" fill="white" />
                                            <circle cx="45.6667" cy="1.66683" r="1.66667" transform="rotate(-90 45.6667 1.66683)" fill="white" />
                                            <circle cx="60.3333" cy="45.3338" r="1.66667" transform="rotate(-90 60.3333 45.3338)" fill="white" />
                                            <circle cx="60.3333" cy="1.66707" r="1.66667" transform="rotate(-90 60.3333 1.66707)" fill="white" />
                                            <circle cx="88.6667" cy="45.3338" r="1.66667" transform="rotate(-90 88.6667 45.3338)" fill="white" />
                                            <circle cx="88.6667" cy="1.66707" r="1.66667" transform="rotate(-90 88.6667 1.66707)" fill="white" />
                                            <circle cx="117.667" cy="45.3338" r="1.66667" transform="rotate(-90 117.667 45.3338)" fill="white" />
                                            <circle cx="117.667" cy="1.66707" r="1.66667" transform="rotate(-90 117.667 1.66707)" fill="white" />
                                            <circle cx="74.6667" cy="45.3338" r="1.66667" transform="rotate(-90 74.6667 45.3338)" fill="white" />
                                            <circle cx="74.6667" cy="1.66707" r="1.66667" transform="rotate(-90 74.6667 1.66707)" fill="white" />
                                            <circle cx="103" cy="45.3338" r="1.66667" transform="rotate(-90 103 45.3338)" fill="white" />
                                            <circle cx="103" cy="1.66707" r="1.66667" transform="rotate(-90 103 1.66707)" fill="white" />
                                            <circle cx="132" cy="45.3338" r="1.66667" transform="rotate(-90 132 45.3338)" fill="white" />
                                            <circle cx="132" cy="1.66707" r="1.66667" transform="rotate(-90 132 1.66707)" fill="white" />
                                        </svg>
                                    </div>
                                    <div className="absolute -top-6 -right-6 z-[-1]">
                                        <svg width="134" height="106" viewBox="0 0 134 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="1.66667" cy="104" r="1.66667" transform="rotate(-90 1.66667 104)" fill="white" />
                                            <circle cx="16.3333" cy="104" r="1.66667" transform="rotate(-90 16.3333 104)" fill="white" />
                                            <circle cx="31" cy="104" r="1.66667" transform="rotate(-90 31 104)" fill="white" />
                                            <circle cx="45.6667" cy="104" r="1.66667" transform="rotate(-90 45.6667 104)" fill="white" />
                                            <circle cx="60.3333" cy="104" r="1.66667" transform="rotate(-90 60.3333 104)" fill="white" />
                                            <circle cx="88.6667" cy="104" r="1.66667" transform="rotate(-90 88.6667 104)" fill="white" />
                                            <circle cx="117.667" cy="104" r="1.66667" transform="rotate(-90 117.667 104)" fill="white" />
                                            <circle cx="74.6667" cy="104" r="1.66667" transform="rotate(-90 74.6667 104)" fill="white" />
                                            <circle cx="103" cy="104" r="1.66667" transform="rotate(-90 103 104)" fill="white" />
                                            <circle cx="132" cy="104" r="1.66667" transform="rotate(-90 132 104)" fill="white" />
                                            <circle cx="1.66667" cy="89.3333" r="1.66667" transform="rotate(-90 1.66667 89.3333)" fill="white" />
                                            <circle cx="16.3333" cy="89.3333" r="1.66667" transform="rotate(-90 16.3333 89.3333)" fill="white" />
                                            <circle cx="31" cy="89.3333" r="1.66667" transform="rotate(-90 31 89.3333)" fill="white" />
                                            <circle cx="45.6667" cy="89.3333" r="1.66667" transform="rotate(-90 45.6667 89.3333)" fill="white" />
                                            <circle cx="60.3333" cy="89.3338" r="1.66667" transform="rotate(-90 60.3333 89.3338)" fill="white" />
                                            <circle cx="88.6667" cy="89.3338" r="1.66667" transform="rotate(-90 88.6667 89.3338)" fill="white" />
                                            <circle cx="117.667" cy="89.3338" r="1.66667" transform="rotate(-90 117.667 89.3338)" fill="white" />
                                            <circle cx="74.6667" cy="89.3338" r="1.66667" transform="rotate(-90 74.6667 89.3338)" fill="white" />
                                            <circle cx="103" cy="89.3338" r="1.66667" transform="rotate(-90 103 89.3338)" fill="white" />
                                            <circle cx="132" cy="89.3338" r="1.66667" transform="rotate(-90 132 89.3338)" fill="white" />
                                            <circle cx="1.66667" cy="74.6673" r="1.66667" transform="rotate(-90 1.66667 74.6673)" fill="white" />
                                            <circle cx="1.66667" cy="31.0003" r="1.66667" transform="rotate(-90 1.66667 31.0003)" fill="white" />
                                            <circle cx="16.3333" cy="74.6668" r="1.66667" transform="rotate(-90 16.3333 74.6668)" fill="white" />
                                            <circle cx="16.3333" cy="31.0003" r="1.66667" transform="rotate(-90 16.3333 31.0003)" fill="white" />
                                            <circle cx="31" cy="74.6668" r="1.66667" transform="rotate(-90 31 74.6668)" fill="white" />
                                            <circle cx="31" cy="31.0003" r="1.66667" transform="rotate(-90 31 31.0003)" fill="white" />
                                            <circle cx="45.6667" cy="74.6668" r="1.66667" transform="rotate(-90 45.6667 74.6668)" fill="white" />
                                            <circle cx="45.6667" cy="31.0003" r="1.66667" transform="rotate(-90 45.6667 31.0003)" fill="white" />
                                            <circle cx="60.3333" cy="74.6668" r="1.66667" transform="rotate(-90 60.3333 74.6668)" fill="white" />
                                            <circle cx="60.3333" cy="31.0001" r="1.66667" transform="rotate(-90 60.3333 31.0001)" fill="white" />
                                            <circle cx="88.6667" cy="74.6668" r="1.66667" transform="rotate(-90 88.6667 74.6668)" fill="white" />
                                            <circle cx="88.6667" cy="31.0001" r="1.66667" transform="rotate(-90 88.6667 31.0001)" fill="white" />
                                            <circle cx="117.667" cy="74.6668" r="1.66667" transform="rotate(-90 117.667 74.6668)" fill="white" />
                                            <circle cx="117.667" cy="31.0001" r="1.66667" transform="rotate(-90 117.667 31.0001)" fill="white" />
                                            <circle cx="74.6667" cy="74.6668" r="1.66667" transform="rotate(-90 74.6667 74.6668)" fill="white" />
                                            <circle cx="74.6667" cy="31.0001" r="1.66667" transform="rotate(-90 74.6667 31.0001)" fill="white" />
                                            <circle cx="103" cy="74.6668" r="1.66667" transform="rotate(-90 103 74.6668)" fill="white" />
                                            <circle cx="103" cy="31.0001" r="1.66667" transform="rotate(-90 103 31.0001)" fill="white" />
                                            <circle cx="132" cy="74.6668" r="1.66667" transform="rotate(-90 132 74.6668)" fill="white" />
                                            <circle cx="132" cy="31.0001" r="1.66667" transform="rotate(-90 132 31.0001)" fill="white" />
                                            <circle cx="1.66667" cy="60.0003" r="1.66667" transform="rotate(-90 1.66667 60.0003)" fill="white" />
                                            <circle cx="1.66667" cy="16.3336" r="1.66667" transform="rotate(-90 1.66667 16.3336)" fill="white" />
                                            <circle cx="16.3333" cy="60.0003" r="1.66667" transform="rotate(-90 16.3333 60.0003)" fill="white" />
                                            <circle cx="16.3333" cy="16.3336" r="1.66667" transform="rotate(-90 16.3333 16.3336)" fill="white" />
                                            <circle cx="31" cy="60.0003" r="1.66667" transform="rotate(-90 31 60.0003)" fill="white" />
                                            <circle cx="31" cy="16.3336" r="1.66667" transform="rotate(-90 31 16.3336)" fill="white" />
                                            <circle cx="45.6667" cy="60.0003" r="1.66667" transform="rotate(-90 45.6667 60.0003)" fill="white" />
                                            <circle cx="45.6667" cy="16.3336" r="1.66667" transform="rotate(-90 45.6667 16.3336)" fill="white" />
                                            <circle cx="60.3333" cy="60.0003" r="1.66667" transform="rotate(-90 60.3333 60.0003)" fill="white" />
                                            <circle cx="60.3333" cy="16.3336" r="1.66667" transform="rotate(-90 60.3333 16.3336)" fill="white" />
                                            <circle cx="88.6667" cy="60.0003" r="1.66667" transform="rotate(-90 88.6667 60.0003)" fill="white" />
                                            <circle cx="88.6667" cy="16.3336" r="1.66667" transform="rotate(-90 88.6667 16.3336)" fill="white" />
                                            <circle cx="117.667" cy="60.0003" r="1.66667" transform="rotate(-90 117.667 60.0003)" fill="white" />
                                            <circle cx="117.667" cy="16.3336" r="1.66667" transform="rotate(-90 117.667 16.3336)" fill="white" />
                                            <circle cx="74.6667" cy="60.0003" r="1.66667" transform="rotate(-90 74.6667 60.0003)" fill="white" />
                                            <circle cx="74.6667" cy="16.3336" r="1.66667" transform="rotate(-90 74.6667 16.3336)" fill="white" />
                                            <circle cx="103" cy="60.0003" r="1.66667" transform="rotate(-90 103 60.0003)" fill="white" />
                                            <circle cx="103" cy="16.3336" r="1.66667" transform="rotate(-90 103 16.3336)" fill="white" />
                                            <circle cx="132" cy="60.0003" r="1.66667" transform="rotate(-90 132 60.0003)" fill="white" />
                                            <circle cx="132" cy="16.3336" r="1.66667" transform="rotate(-90 132 16.3336)" fill="white" />
                                            <circle cx="1.66667" cy="45.3336" r="1.66667" transform="rotate(-90 1.66667 45.3336)" fill="white" />
                                            <circle cx="1.66667" cy="1.66683" r="1.66667" transform="rotate(-90 1.66667 1.66683)" fill="white" />
                                            <circle cx="16.3333" cy="45.3336" r="1.66667" transform="rotate(-90 16.3333 45.3336)" fill="white" />
                                            <circle cx="16.3333" cy="1.66683" r="1.66667" transform="rotate(-90 16.3333 1.66683)" fill="white" />
                                            <circle cx="31" cy="45.3336" r="1.66667" transform="rotate(-90 31 45.3336)" fill="white" />
                                            <circle cx="31" cy="1.66683" r="1.66667" transform="rotate(-90 31 1.66683)" fill="white" />
                                            <circle cx="45.6667" cy="45.3336" r="1.66667" transform="rotate(-90 45.6667 45.3336)" fill="white" />
                                            <circle cx="45.6667" cy="1.66683" r="1.66667" transform="rotate(-90 45.6667 1.66683)" fill="white" />
                                            <circle cx="60.3333" cy="45.3338" r="1.66667" transform="rotate(-90 60.3333 45.3338)" fill="white" />
                                            <circle cx="60.3333" cy="1.66707" r="1.66667" transform="rotate(-90 60.3333 1.66707)" fill="white" />
                                            <circle cx="88.6667" cy="45.3338" r="1.66667" transform="rotate(-90 88.6667 45.3338)" fill="white" />
                                            <circle cx="88.6667" cy="1.66707" r="1.66667" transform="rotate(-90 88.6667 1.66707)" fill="white" />
                                            <circle cx="117.667" cy="45.3338" r="1.66667" transform="rotate(-90 117.667 45.3338)" fill="white" />
                                            <circle cx="117.667" cy="1.66707" r="1.66667" transform="rotate(-90 117.667 1.66707)" fill="white" />
                                            <circle cx="74.6667" cy="45.3338" r="1.66667" transform="rotate(-90 74.6667 45.3338)" fill="white" />
                                            <circle cx="74.6667" cy="1.66707" r="1.66667" transform="rotate(-90 74.6667 1.66707)" fill="white" />
                                            <circle cx="103" cy="45.3338" r="1.66667" transform="rotate(-90 103 45.3338)" fill="white" />
                                            <circle cx="103" cy="1.66707" r="1.66667" transform="rotate(-90 103 1.66707)" fill="white" />
                                            <circle cx="132" cy="45.3338" r="1.66667" transform="rotate(-90 132 45.3338)" fill="white" />
                                            <circle cx="132" cy="1.66707" r="1.66667" transform="rotate(-90 132 1.66707)" fill="white" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End of Hero */}

                {/* Features */}
                <section className="pt-20 pb-8 lg:pt-[120px] lg:pb-[70px]" id="fitur">
                    <div className="container mx-auto px-4">
                        <div className="-mx-4 flex flex-wrap">
                            <div className="w-full px-4">
                                <div className="mx-auto mb-12 max-w-[485px] text-center lg:mb-[70px]">
                                    <span className="mb-2 block text-lg font-semibold text-primary">Fitur EMKM</span>
                                    <h2 className="text-dark mb-3 text-3xl font-bold sm:text-4xl md:text-[40px] md:leading-[1.2]">
                                        Powerful Features for Small Business
                                    </h2>
                                    <p className="text-body-color text-base">
                                        Nikmati kemudahan mengelola bisnis Anda dengan fitur pintar EMKM yang membantu Anda berkembang lebih cepat.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="-mx-4 flex flex-wrap">
                            <div className="w-full px-4 md:w-1/2 lg:w-1/4">
                                <div className="wow fadeInUp group mb-12" data-wow-delay=".1s">
                                    <div className="relative z-10 mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary">
                                        <span className="absolute top-0 left-0 -z-1 mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary/20 duration-300 group-hover:rotate-45"></span>
                                        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M30.5801 8.30514H27.9926C28.6113 7.85514 29.1176 7.34889 29.3426 6.73014C29.6801 5.88639 29.6801 4.48014 27.9363 2.84889C26.0801 1.04889 24.3926 1.04889 23.3238 1.33014C20.9051 1.94889 19.2738 4.76139 18.3738 6.78639C17.4738 4.76139 15.8426 2.00514 13.4238 1.33014C12.3551 1.04889 10.6676 1.10514 8.81133 2.84889C7.06758 4.53639 7.12383 5.88639 7.40508 6.73014C7.63008 7.34889 8.13633 7.85514 8.75508 8.30514H5.71758C4.08633 8.30514 2.73633 9.65514 2.73633 11.2864V14.9989C2.73633 16.5739 4.03008 17.8676 5.60508 17.9239V31.6489C5.60508 33.5614 7.18008 35.1926 9.14883 35.1926H27.5426C29.4551 35.1926 31.0863 33.6176 31.0863 31.6489V17.8676C32.4926 17.6426 33.5613 16.4051 33.5613 14.9426V11.2301C33.5613 9.59889 32.2113 8.30514 30.5801 8.30514ZM23.9426 3.69264C23.9988 3.69264 24.1676 3.63639 24.3363 3.63639C24.7301 3.63639 25.3488 3.80514 26.1926 4.59264C26.8676 5.21139 27.0363 5.66139 26.9801 5.77389C26.6988 6.56139 23.8863 7.40514 20.6801 7.74264C21.4676 5.99889 22.6488 4.03014 23.9426 3.69264ZM10.4988 4.64889C11.3426 3.86139 11.9613 3.69264 12.3551 3.69264C12.5238 3.69264 12.6363 3.74889 12.7488 3.74889C14.0426 4.08639 15.2801 5.99889 16.0676 7.79889C12.8613 7.46139 10.0488 6.61764 9.76758 5.83014C9.71133 5.66139 9.88008 5.26764 10.4988 4.64889ZM5.26758 14.9426V11.2301C5.26758 11.0051 5.43633 10.7801 5.71758 10.7801H30.5801C30.8051 10.7801 31.0301 10.9489 31.0301 11.2301V14.9426C31.0301 15.1676 30.8613 15.3926 30.5801 15.3926H5.71758C5.49258 15.3926 5.26758 15.2239 5.26758 14.9426ZM27.5426 32.6614H9.14883C8.58633 32.6614 8.13633 32.2114 8.13633 31.6489V17.9239H28.4988V31.6489C28.5551 32.2114 28.1051 32.6614 27.5426 32.6614Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-dark mb-3 text-xl font-bold">Pencatatan Transaksi</h4>
                                    <p className="text-body-color mb-8 lg:mb-9">
                                        Catat pemasukan dan pengeluaran harian dengan mudah, lengkap dengan kategori dan sumber transaksi secara
                                        otomatis.
                                    </p>
                                    {/* <a href="javascript:void(0)" className="text-dark text-base font-medium hover:text-primary">
                                        Learn More
                                    </a> */}
                                </div>
                            </div>
                            <div className="w-full px-4 md:w-1/2 lg:w-1/4">
                                <div className="wow fadeInUp group mb-12" data-wow-delay=".15s">
                                    <div className="relative z-10 mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary">
                                        <span className="absolute top-0 left-0 -z-1 mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary/20 duration-300 group-hover:rotate-45"></span>
                                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M30.5998 1.01245H5.39981C2.98105 1.01245 0.956055 2.9812 0.956055 5.4562V30.6562C0.956055 33.075 2.9248 35.0437 5.39981 35.0437H30.5998C33.0186 35.0437 34.9873 33.075 34.9873 30.6562V5.39995C34.9873 2.9812 33.0186 1.01245 30.5998 1.01245ZM5.39981 3.48745H30.5998C31.6123 3.48745 32.4561 4.3312 32.4561 5.39995V11.1937H3.4873V5.39995C3.4873 4.38745 4.38731 3.48745 5.39981 3.48745ZM3.4873 30.6V13.725H23.0623V32.5125H5.39981C4.38731 32.5125 3.4873 31.6125 3.4873 30.6ZM30.5998 32.5125H25.5373V13.725H32.4561V30.6C32.5123 31.6125 31.6123 32.5125 30.5998 32.5125Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-dark mb-3 text-xl font-bold">Laporan Keuangan Instan</h4>
                                    <p className="text-body-color mb-8 lg:mb-9">
                                        Dapatkan laporan laba rugi, arus kas, dan neraca usaha secara otomatis tanpa perlu menghitung manual.
                                    </p>
                                    {/* <a href="javascript:void(0)" className="text-dark text-base font-medium hover:text-primary">
                                        Learn More
                                    </a> */}
                                </div>
                            </div>
                            <div className="w-full px-4 md:w-1/2 lg:w-1/4">
                                <div className="wow fadeInUp group mb-12" data-wow-delay=".2s">
                                    <div className="relative z-10 mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary">
                                        <span className="absolute top-0 left-0 -z-1 mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary/20 duration-300 group-hover:rotate-45"></span>
                                        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M33.5613 21.4677L31.3675 20.1177C30.805 19.7239 30.0175 19.9489 29.6238 20.5114C29.23 21.1302 29.455 21.8614 30.0175 22.2552L31.48 23.2114L18.1488 31.5927L4.76127 23.2114L6.22377 22.2552C6.84252 21.8614 7.01127 21.0739 6.61752 20.5114C6.22377 19.8927 5.43627 19.7239 4.87377 20.1177L2.68002 21.4677C2.11752 21.8614 1.72377 22.4802 1.72377 23.1552C1.72377 23.8302 2.06127 24.5052 2.68002 24.8427L17.08 33.8989C17.4175 34.1239 17.755 34.1802 18.1488 34.1802C18.5425 34.1802 18.88 34.0677 19.2175 33.8989L33.5613 24.8989C34.1238 24.5052 34.5175 23.8864 34.5175 23.2114C34.5175 22.5364 34.18 21.8614 33.5613 21.4677Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M20.1175 20.4552L18.1488 21.6364L16.18 20.3989C15.5613 20.0052 14.83 20.2302 14.4363 20.7927C14.0425 21.4114 14.2675 22.1427 14.83 22.5364L17.4738 24.1677C17.6988 24.2802 17.9238 24.3364 18.1488 24.3364C18.3738 24.3364 18.5988 24.2802 18.8238 24.1677L21.4675 22.5364C22.0863 22.1427 22.255 21.3552 21.8613 20.7927C21.4675 20.2302 20.68 20.0614 20.1175 20.4552Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M7.74252 18.0927L11.455 20.4552C11.68 20.5677 11.905 20.6239 12.13 20.6239C12.5238 20.6239 12.9738 20.3989 13.1988 20.0052C13.5925 19.3864 13.3675 18.6552 12.805 18.2614L9.09252 15.8989C8.47377 15.5052 7.74252 15.7302 7.34877 16.2927C6.95502 16.9677 7.12377 17.7552 7.74252 18.0927Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M5.04252 16.1802C5.43627 16.1802 5.88627 15.9552 6.11127 15.5614C6.50502 14.9427 6.28002 14.2114 5.71752 13.8177L4.81752 13.2552L5.71752 12.6927C6.33627 12.2989 6.50502 11.5114 6.11127 10.9489C5.71752 10.3302 4.93002 10.1614 4.36752 10.5552L1.72377 12.1864C1.33002 12.4114 1.10502 12.8052 1.10502 13.2552C1.10502 13.7052 1.33002 14.0989 1.72377 14.3239L4.36752 15.9552C4.53627 16.1239 4.76127 16.1802 5.04252 16.1802Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M8.41752 10.7239C8.64252 10.7239 8.86752 10.6677 9.09252 10.5552L12.805 8.1927C13.4238 7.79895 13.5925 7.01145 13.1988 6.44895C12.805 5.8302 12.0175 5.66145 11.455 6.0552L7.74252 8.4177C7.12377 8.81145 6.95502 9.59895 7.34877 10.1614C7.57377 10.4989 7.96752 10.7239 8.41752 10.7239Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M16.18 6.05522L18.1488 4.81772L20.1175 6.05522C20.3425 6.16772 20.5675 6.22397 20.7925 6.22397C21.1863 6.22397 21.6363 5.99897 21.8613 5.60522C22.255 4.98647 22.03 4.25522 21.4675 3.86147L18.8238 2.23022C18.43 1.94897 17.8675 1.94897 17.4738 2.23022L14.83 3.86147C14.2113 4.25522 14.0425 5.04272 14.4363 5.60522C14.83 6.16772 15.6175 6.44897 16.18 6.05522Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M23.4925 8.19267L27.205 10.5552C27.43 10.6677 27.655 10.7239 27.88 10.7239C28.2738 10.7239 28.7238 10.4989 28.9488 10.1052C29.3425 9.48642 29.1175 8.75517 28.555 8.36142L24.8425 5.99892C24.28 5.60517 23.4925 5.83017 23.0988 6.39267C22.705 7.01142 22.8738 7.79892 23.4925 8.19267Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M34.5738 12.1864L31.93 10.5552C31.3675 10.1614 30.58 10.3864 30.1863 10.9489C29.7925 11.5677 30.0175 12.2989 30.58 12.6927L31.48 13.2552L30.58 13.8177C29.9613 14.2114 29.7925 14.9989 30.1863 15.5614C30.4113 15.9552 30.8613 16.1802 31.255 16.1802C31.48 16.1802 31.705 16.1239 31.93 16.0114L34.5738 14.3802C34.9675 14.1552 35.1925 13.7614 35.1925 13.3114C35.1925 12.8614 34.9675 12.4114 34.5738 12.1864Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M24.1675 20.624C24.3925 20.624 24.6175 20.5677 24.8425 20.4552L28.555 18.0927C29.1738 17.699 29.3425 16.9115 28.9488 16.349C28.555 15.7302 27.7675 15.5615 27.205 15.9552L23.4925 18.3177C22.8738 18.7115 22.705 19.499 23.0988 20.0615C23.3238 20.4552 23.7175 20.624 24.1675 20.624Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-dark mb-3 text-xl font-bold">Manajemen Produk & Stok</h4>
                                    <p className="text-body-color mb-8 lg:mb-9">
                                        Kelola daftar produk, harga, dan stok barang secara real-time agar operasional tetap efisien dan terkendali.
                                    </p>
                                    {/* <a href="javascript:void(0)" className="text-dark text-base font-medium hover:text-primary">
                                        Learn More
                                    </a> */}
                                </div>
                            </div>
                            <div className="w-full px-4 md:w-1/2 lg:w-1/4">
                                <div className="wow fadeInUp group mb-12" data-wow-delay=".25s">
                                    <div className="relative z-10 mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary">
                                        <span className="absolute top-0 left-0 -z-1 mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary/20 duration-300 group-hover:rotate-45"></span>
                                        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12.355 2.0614H5.21129C3.29879 2.0614 1.72379 3.6364 1.72379 5.5489V12.6927C1.72379 14.6052 3.29879 16.1802 5.21129 16.1802H12.355C14.2675 16.1802 15.8425 14.6052 15.8425 12.6927V5.60515C15.8988 3.6364 14.3238 2.0614 12.355 2.0614ZM13.3675 12.7489C13.3675 13.3114 12.9175 13.7614 12.355 13.7614H5.21129C4.64879 13.7614 4.19879 13.3114 4.19879 12.7489V5.60515C4.19879 5.04265 4.64879 4.59265 5.21129 4.59265H12.355C12.9175 4.59265 13.3675 5.04265 13.3675 5.60515V12.7489Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M31.0863 2.0614H23.9425C22.03 2.0614 20.455 3.6364 20.455 5.5489V12.6927C20.455 14.6052 22.03 16.1802 23.9425 16.1802H31.0863C32.9988 16.1802 34.5738 14.6052 34.5738 12.6927V5.60515C34.5738 3.6364 32.9988 2.0614 31.0863 2.0614ZM32.0988 12.7489C32.0988 13.3114 31.6488 13.7614 31.0863 13.7614H23.9425C23.38 13.7614 22.93 13.3114 22.93 12.7489V5.60515C22.93 5.04265 23.38 4.59265 23.9425 4.59265H31.0863C31.6488 4.59265 32.0988 5.04265 32.0988 5.60515V12.7489Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M12.355 20.0051H5.21129C3.29879 20.0051 1.72379 21.5801 1.72379 23.4926V30.6364C1.72379 32.5489 3.29879 34.1239 5.21129 34.1239H12.355C14.2675 34.1239 15.8425 32.5489 15.8425 30.6364V23.5489C15.8988 21.5801 14.3238 20.0051 12.355 20.0051ZM13.3675 30.6926C13.3675 31.2551 12.9175 31.7051 12.355 31.7051H5.21129C4.64879 31.7051 4.19879 31.2551 4.19879 30.6926V23.5489C4.19879 22.9864 4.64879 22.5364 5.21129 22.5364H12.355C12.9175 22.5364 13.3675 22.9864 13.3675 23.5489V30.6926Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M31.0863 20.0051H23.9425C22.03 20.0051 20.455 21.5801 20.455 23.4926V30.6364C20.455 32.5489 22.03 34.1239 23.9425 34.1239H31.0863C32.9988 34.1239 34.5738 32.5489 34.5738 30.6364V23.5489C34.5738 21.5801 32.9988 20.0051 31.0863 20.0051ZM32.0988 30.6926C32.0988 31.2551 31.6488 31.7051 31.0863 31.7051H23.9425C23.38 31.7051 22.93 31.2551 22.93 30.6926V23.5489C22.93 22.9864 23.38 22.5364 23.9425 22.5364H31.0863C31.6488 22.5364 32.0988 22.9864 32.0988 23.5489V30.6926Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-dark mb-3 text-xl font-bold">Dashboard Interaktif</h4>
                                    <p className="text-body-color mb-8 lg:mb-9">
                                        Lihat performa bisnismu secara real-time melalui tampilan dashboard yang sederhana, intuitif, dan informatif.
                                    </p>
                                    {/* <a href="javascript:void(0)" className="text-dark text-base font-medium hover:text-primary">
                                        Learn More
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End of Features */}

                {/* About Us */}
                <section id="about" className="bg-gray-100 pt-20 pb-8 lg:pt-[120px] lg:pb-[70px]">
                    <div className="container mx-auto px-4">
                        <div className="wow fadeInUp" data-wow-delay=".2s">
                            <div className="-mx-4 flex flex-wrap items-center">
                                {/* Bagian Kiri (Teks) */}
                                <div className="w-full px-4 lg:w-1/2">
                                    <div className="mb-12 max-w-[540px] lg:mb-0">
                                        <h2 className="text-dark mb-5 text-3xl leading-tight font-bold sm:text-[40px] sm:leading-[1.2]">
                                            Wujudkan usaha mu dengan <span className="text-[#23627C]">EMKM</span>
                                        </h2>
                                        <p className="text-body-color mb-10 text-base leading-relaxed">
                                            EMKM adalah platform digital yang dirancang khusus untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah
                                            dalam mengembangkan usahanya. Kami percaya bahwa setiap usaha, sekecil apapun, berhak mendapatkan
                                            kesempatan untuk tumbuh dan dikenal lebih luas.
                                            <br />
                                            <br />
                                            Dengan EMKM, pelaku usaha dapat mengelola operasional, memantau keuangan, dan menjangkau pelanggan dengan
                                            lebih mudah. Kami menghadirkan solusi terpadu yang tidak hanya efisien, tetapi juga mudah digunakan bagi
                                            siapapun tanpa perlu latar belakang teknis.
                                        </p>

                                        <a
                                            href="#"
                                            className="hover:border-blue-dark hover:bg-blue-dark inline-flex items-center justify-center rounded-md border border-primary bg-primary px-7 py-3 text-center text-base font-medium text-white transition duration-300 ease-in-out"
                                        >
                                            Know More
                                        </a>
                                    </div>
                                </div>

                                <div className="w-full px-4 lg:w-1/2">
                                    <div className="mb-8 sm:h-[400px] md:h-[540px] lg:h-[450px] xl:h-[500px]">
                                        <img
                                            src="/images/about-me-img.jpg"
                                            alt="Foto oleh Blake Wis di Unsplash"
                                            className="h-full w-full rounded-lg object-cover object-center shadow-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="relative z-20 overflow-hidden bg-white pt-20 pb-12 lg:pt-[120px] lg:pb-[90px]">
                    <div className="container mx-auto px-4">
                        <div className="-mx-4 flex flex-wrap">
                            <div className="w-full px-4">
                                <div className="mx-auto mb-[60px] max-w-[510px] text-center">
                                    <span className="mb-2 block text-lg font-semibold text-[#23BBB7]">Harga Paket</span>
                                    <h2 className="text-dark mb-3 text-3xl font-bold sm:text-4xl md:text-[40px] md:leading-[1.2]">
                                        Fitur Lengkap untuk Usaha Lebih Mudah
                                    </h2>
                                    <p className="text-body-color text-base">
                                        Pilih paket terbaik sesuai kebutuhan bisnis Anda. Semua paket sudah termasuk fitur-fitur penting untuk
                                        mempermudah pengelolaan usaha.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="-mx-4 flex flex-wrap justify-center">
                            {plans.map((plan, index) => (
                                <div className="w-full px-4 md:w-1/2 lg:w-1/3" key={index}>
                                    <div
                                        className={`relative z-10 mb-10 overflow-hidden rounded-xl bg-white px-8 py-10 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-12 lg:px-6 lg:py-10 xl:p-14 ${plan.popular ? 'border border-[#23BBB7]' : ''}`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute top-4 right-4 rounded-full bg-[#23BBB7] px-4 py-1 text-xs font-semibold text-white">
                                                Populer
                                            </div>
                                        )}
                                        <span className="text-dark mb-5 block text-xl font-semibold">{plan.title}</span>
                                        <h2 className="text-dark mb-11 text-4xl font-bold xl:text-[42px] xl:leading-[1.21]">
                                            <span className="text-xl font-medium text-[#23BBB7]">Rp</span>
                                            <span className="ml-1 -tracking-[2px]">{plan.price}</span>
                                            <span className="text-body-color text-base font-normal">/bulan</span>
                                        </h2>
                                        <div className="mb-[50px]">
                                            <h5 className="text-dark mb-5 text-lg font-semibold">Fitur</h5>
                                            <div className="flex flex-col gap-[14px] text-gray-600">
                                                {plan.features.map((feature, idx) => (
                                                    <p key={idx}>{feature}</p>
                                                ))}
                                            </div>
                                        </div>
                                        <a
                                            href="#"
                                            className="inline-block rounded-md bg-[#23BBB7] px-7 py-3 text-center text-base font-medium text-white transition hover:bg-[#1a8f85]"
                                        >
                                            Pilih Paket
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* End of Pricing */}

                {/* CTA */}
                <section className="relative z-10 overflow-hidden bg-primary py-20 lg:py-[115px]">
                    <div className="container mx-auto px-4">
                        <div className="relative overflow-hidden">
                            <div className="-mx-4 flex flex-wrap items-stretch">
                                <div className="w-full px-4">
                                    <div className="mx-auto max-w-[570px] text-center">
                                        <h2 className="mb-2.5 text-3xl font-bold text-white md:text-[38px] md:leading-[1.44]">
                                            <span>Setiap Usaha Punya Peluang Besar</span>
                                            <br />
                                            <span className="text-3xl font-normal md:text-[40px]">Mulai Sekarang</span>
                                        </h2>
                                        <p className="mx-auto mb-6 max-w-[515px] text-base leading-[1.5] text-white">
                                            Kami hadir untuk membantu pelaku UMKM tumbuh lebih cepat melalui solusi digital yang mudah, praktis, dan
                                            terjangkau.
                                        </p>
                                        <a
                                            href="javascript:void(0)"
                                            className="inline-block rounded-md bg-[#ffffff40] px-7 py-3 text-center text-base font-medium text-white transition hover:bg-[#1a8f85]"
                                        >
                                            Coba Gratis
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="absolute top-0 left-0">
                            <svg width="495" height="470" viewBox="0 0 495 470" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="55" cy="442" r="138" stroke="white" stroke-opacity="0.04" stroke-width="50" />
                                <circle cx="446" r="39" stroke="white" stroke-opacity="0.04" stroke-width="20" />
                                <path
                                    d="M245.406 137.609L233.985 94.9852L276.609 106.406L245.406 137.609Z"
                                    stroke="white"
                                    stroke-opacity="0.08"
                                    stroke-width="12"
                                />
                            </svg>
                        </span>
                        <span className="absolute right-0 bottom-0">
                            <svg width="493" height="470" viewBox="0 0 493 470" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="462" cy="5" r="138" stroke="white" stroke-opacity="0.04" stroke-width="50" />
                                <circle cx="49" cy="470" r="39" stroke="white" stroke-opacity="0.04" stroke-width="20" />
                                <path
                                    d="M222.393 226.701L272.808 213.192L259.299 263.607L222.393 226.701Z"
                                    stroke="white"
                                    stroke-opacity="0.06"
                                    stroke-width="13"
                                />
                            </svg>
                        </span>
                    </div>
                </section>
                {/* End Of CTA */}

                {/* Our Founder */}
                <section id="team" className="pt-20 pb-8 lg:pt-[120px] lg:pb-[70px]">
                    <div className="container mx-auto px-4">
                        <div className="wow fadeInUp" data-wow-delay=".2s">
                            <div className="-mx-4 flex flex-wrap items-center lg:flex-row-reverse">
                                {/* Bagian Kanan (Teks) */}
                                <div className="w-full px-4 lg:w-1/2">
                                    <div className="mb-12 max-w-[540px] lg:mb-0 lg:ml-auto">
                                        <h2 className="text-dark mb-5 text-3xl leading-tight font-bold sm:text-[40px] sm:leading-[1.2]">
                                            Temui <span className="text-[#23627C]">Founder Kami</span>
                                        </h2>
                                        <p className="text-body-color mb-10 text-base leading-relaxed">
                                            Di balik EMKM, ada visi besar untuk membantu pelaku usaha kecil di seluruh Indonesia agar bisa naik kelas
                                            dan bersaing di era digital.
                                            <br />
                                            <br />
                                            Founder kami percaya bahwa setiap pengusaha lokal memiliki potensi luar biasa untuk berkembang asal
                                            diberikan akses pada alat, wawasan, dan dukungan yang tepat. EMKM lahir dari semangat itu, untuk menjadi
                                            mitra digital yang memudahkan UMKM dalam mengelola bisnis, memperluas jangkauan, dan meningkatkan daya
                                            saing.
                                            <br />
                                            <br />
                                            Dengan tim yang berdedikasi dan pengalaman di dunia teknologi serta kewirausahaan, kami berkomitmen
                                            menghadirkan solusi yang tidak hanya canggih, tapi juga relevan dan mudah digunakan oleh semua kalangan.
                                        </p>

                                        {/* <a
                                            href="https://www.instagram.com/thaniate"
                                            className="hover:border-blue-dark hover:bg-blue-dark inline-flex items-center justify-center rounded-md border border-primary bg-primary px-7 py-3 text-center text-base font-medium text-white transition duration-300 ease-in-out"
                                        >
                                            <svg
                                                className="mr-1 fill-current"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M7.75 2C4.57436 2 2 4.57436 2 7.75V16.25C2 19.4256 4.57436 22 7.75 22H16.25C19.4256 22 22 19.4256 22 16.25V7.75C22 4.57436 19.4256 2 16.25 2H7.75ZM7.75 4H16.25C18.314 4 20 5.686 20 7.75V16.25C20 18.314 18.314 20 16.25 20H7.75C5.686 20 4 18.314 4 16.25V7.75C4 5.686 5.686 4 7.75 4ZM17.5 5.75C17.0858 5.75 16.75 6.08579 16.75 6.5C16.75 6.91421 17.0858 7.25 17.5 7.25C17.9142 7.25 18.25 6.91421 18.25 6.5C18.25 6.08579 17.9142 5.75 17.5 5.75ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z" />
                                            </svg>
                                            Know More
                                        </a> */}

                                        <div className="flex items-center gap-5">
                                            <a href="https://github.com/230414020N" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M12 0.297C5.373 0.297 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.43 9.025 23.108C9.025 22.819 9.015 22.065 9.009 21.065C5.672 21.789 4.967 19.427 4.967 19.427C4.422 18.043 3.633 17.657 3.633 17.657C2.546 16.911 3.716 16.927 3.716 16.927C4.922 17.013 5.555 18.162 5.555 18.162C6.625 19.996 8.366 19.484 9.048 19.184C9.157 18.406 9.46 17.87 9.797 17.567C7.141 17.267 4.343 16.234 4.343 11.577C4.343 10.26 4.813 9.204 5.6 8.38C5.475 8.077 5.073 6.832 5.725 5.134C5.725 5.134 6.71 4.81 8.995 6.408C9.935 6.145 10.945 6.013 11.955 6.007C12.965 6.013 13.975 6.145 14.915 6.408C17.2 4.81 18.185 5.134 18.185 5.134C18.837 6.832 18.435 8.077 18.31 8.38C19.097 9.204 19.567 10.26 19.567 11.577C19.567 16.248 16.762 17.263 14.1 17.557C14.514 17.921 14.885 18.659 14.885 19.762C14.885 21.316 14.869 22.705 14.869 23.108C14.869 23.43 15.089 23.8 15.695 23.682C20.46 22.095 23.897 17.598 23.897 12.297C23.897 5.67 18.523 0.297 12 0.297Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="https://www.linkedin.com/in/sharla-nathania/" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M4.983 3.5C4.983 4.60457 4.08557 5.5 2.983 5.5C1.88043 5.5 0.983002 4.60457 0.983002 3.5C0.983002 2.39543 1.88043 1.5 2.983 1.5C4.08557 1.5 4.983 2.39543 4.983 3.5ZM1 8.5H5V22H1V8.5ZM8.982 8.5H12.788V10.325C13.33 9.225 14.716 8.096 16.896 8.096C21.08 8.096 22 10.816 22 14.545V22H18V15.125C18 13.25 17.964 10.875 15.557 10.875C13.113 10.875 12.75 12.893 12.75 14.988V22H8.982V8.5Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="https://www.instagram.com/thaniate" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M9.02429 11.8066C10.5742 11.8066 11.8307 10.5501 11.8307 9.00018C11.8307 7.45022 10.5742 6.19373 9.02429 6.19373C7.47433 6.19373 6.21783 7.45022 6.21783 9.00018C6.21783 10.5501 7.47433 11.8066 9.02429 11.8066Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M12.0726 1.5H5.92742C3.48387 1.5 1.5 3.48387 1.5 5.92742V12.0242C1.5 14.5161 3.48387 16.5 5.92742 16.5H12.0242C14.5161 16.5 16.5 14.5161 16.5 12.0726V5.92742C16.5 3.48387 14.5161 1.5 12.0726 1.5ZM9.02419 12.6774C6.96774 12.6774 5.34677 11.0081 5.34677 9C5.34677 6.99194 6.99194 5.32258 9.02419 5.32258C11.0323 5.32258 12.6774 6.99194 12.6774 9C12.6774 11.0081 11.0565 12.6774 9.02419 12.6774ZM14.1048 5.66129C13.8629 5.92742 13.5 6.07258 13.0887 6.07258C12.7258 6.07258 12.3629 5.92742 12.0726 5.66129C11.8065 5.39516 11.6613 5.05645 11.6613 4.64516C11.6613 4.23387 11.8065 3.91935 12.0726 3.62903C12.3387 3.33871 12.6774 3.19355 13.0887 3.19355C13.4516 3.19355 13.8387 3.33871 14.1048 3.60484C14.3468 3.91935 14.5161 4.28226 14.5161 4.66935C14.4919 5.05645 14.3468 5.39516 14.1048 5.66129Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M13.1135 4.06433C12.799 4.06433 12.5329 4.33046 12.5329 4.64498C12.5329 4.95949 12.799 5.22562 13.1135 5.22562C13.428 5.22562 13.6942 4.95949 13.6942 4.64498C13.6942 4.33046 13.4522 4.06433 13.1135 4.06433Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full px-4 lg:w-1/2">
                                    <div className="mb-8 sm:h-[400px] md:h-[540px] lg:h-[450px] xl:h-[500px]">
                                        <img
                                            src="/images/team/founder.jpg"
                                            alt="Foto oleh Blake Wis di Unsplash"
                                            className="h-full w-full rounded-lg object-cover object-center shadow-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End of Our Founder */}

                {/* Team */}
                <section id="team" className="overflow-hidden bg-gray-100 pt-20 pb-12 lg:pt-[120px] lg:pb-[90px]">
                    <div className="container mx-auto px-4">
                        <div className="-mx-4 flex flex-wrap">
                            <div className="w-full px-4">
                                <div className="mx-auto mb-[60px] max-w-[485px] text-center">
                                    <span className="mb-2 block text-lg font-semibold text-primary">Our Team Members</span>
                                    <h2 className="text-dark mb-3 text-3xl leading-[1.2] font-bold sm:text-4xl md:text-[40px]">Our Creative Team</h2>
                                    <p className="text-body-color text-base">
                                        Kami percaya inovasi lahir dari kolaborasi. Bersama, kami menciptakan solusi yang relevan dan berdampak nyata.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="-mx-4 flex flex-wrap justify-center">
                            <div className="w-full px-4 sm:w-1/2 lg:w-1/4 xl:w-1/4">
                                <div className="group shadow-testimonial mb-8 rounded-xl bg-white px-5 pt-12 pb-10">
                                    <div className="relative z-10 mx-auto mb-5 h-[120px] w-[120px]">
                                        <img src="/images/team/team1.jpg" alt="team image" className="h-[120px] w-[120px] rounded-full" />
                                        <span className="absolute bottom-0 left-0 -z-10 h-10 w-10 rounded-full bg-secondary opacity-0 transition-all group-hover:opacity-100"></span>
                                        <span className="absolute top-0 right-0 -z-10 opacity-0 transition-all group-hover:opacity-100">
                                            <svg width="55" height="53" viewBox="0 0 55 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5118 3.1009C13.3681 3.1009 14.0622 2.40674 14.0622 1.55045C14.0622 0.69416 13.3681 0 12.5118 0C11.6555 0 10.9613 0.69416 10.9613 1.55045C10.9613 2.40674 11.6555 3.1009 12.5118 3.1009Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.5038 3.1009C23.3601 3.1009 24.0543 2.40674 24.0543 1.55045C24.0543 0.69416 23.3601 0 22.5038 0C21.6475 0 20.9534 0.69416 20.9534 1.55045C20.9534 2.40674 21.6475 3.1009 22.5038 3.1009Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.4958 3.1009C33.3521 3.1009 34.0463 2.40674 34.0463 1.55045C34.0463 0.69416 33.3521 0 32.4958 0C31.6395 0 30.9454 0.69416 30.9454 1.55045C30.9454 2.40674 31.6395 3.1009 32.4958 3.1009Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.4875 3.1009C43.3438 3.1009 44.038 2.40674 44.038 1.55045C44.038 0.69416 43.3438 0 42.4875 0C41.6312 0 40.9371 0.69416 40.9371 1.55045C40.9371 2.40674 41.6312 3.1009 42.4875 3.1009Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M52.4795 3.1009C53.3358 3.1009 54.03 2.40674 54.03 1.55045C54.03 0.69416 53.3358 0 52.4795 0C51.6233 0 50.9291 0.69416 50.9291 1.55045C50.9291 2.40674 51.6233 3.1009 52.4795 3.1009Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M2.52045 13.0804C3.37674 13.0804 4.0709 12.3862 4.0709 11.5299C4.0709 10.6737 3.37674 9.97949 2.52045 9.97949C1.66416 9.97949 0.970001 10.6737 0.970001 11.5299C0.970001 12.3862 1.66416 13.0804 2.52045 13.0804Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5118 13.0804C13.3681 13.0804 14.0622 12.3862 14.0622 11.5299C14.0622 10.6737 13.3681 9.97949 12.5118 9.97949C11.6555 9.97949 10.9613 10.6737 10.9613 11.5299C10.9613 12.3862 11.6555 13.0804 12.5118 13.0804Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.5038 13.0804C23.3601 13.0804 24.0543 12.3862 24.0543 11.5299C24.0543 10.6737 23.3601 9.97949 22.5038 9.97949C21.6475 9.97949 20.9534 10.6737 20.9534 11.5299C20.9534 12.3862 21.6475 13.0804 22.5038 13.0804Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.4958 13.0804C33.3521 13.0804 34.0463 12.3862 34.0463 11.5299C34.0463 10.6737 33.3521 9.97949 32.4958 9.97949C31.6395 9.97949 30.9454 10.6737 30.9454 11.5299C30.9454 12.3862 31.6395 13.0804 32.4958 13.0804Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.4875 13.0804C43.3438 13.0804 44.038 12.3862 44.038 11.5299C44.038 10.6737 43.3438 9.97949 42.4875 9.97949C41.6312 9.97949 40.9371 10.6737 40.9371 11.5299C40.9371 12.3862 41.6312 13.0804 42.4875 13.0804Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M52.4795 13.0804C53.3358 13.0804 54.03 12.3862 54.03 11.5299C54.03 10.6737 53.3358 9.97949 52.4795 9.97949C51.6233 9.97949 50.9291 10.6737 50.9291 11.5299C50.9291 12.3862 51.6233 13.0804 52.4795 13.0804Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M2.52045 23.0604C3.37674 23.0604 4.0709 22.3662 4.0709 21.5099C4.0709 20.6536 3.37674 19.9595 2.52045 19.9595C1.66416 19.9595 0.970001 20.6536 0.970001 21.5099C0.970001 22.3662 1.66416 23.0604 2.52045 23.0604Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5118 23.0604C13.3681 23.0604 14.0622 22.3662 14.0622 21.5099C14.0622 20.6536 13.3681 19.9595 12.5118 19.9595C11.6555 19.9595 10.9613 20.6536 10.9613 21.5099C10.9613 22.3662 11.6555 23.0604 12.5118 23.0604Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.5038 23.0604C23.3601 23.0604 24.0543 22.3662 24.0543 21.5099C24.0543 20.6536 23.3601 19.9595 22.5038 19.9595C21.6475 19.9595 20.9534 20.6536 20.9534 21.5099C20.9534 22.3662 21.6475 23.0604 22.5038 23.0604Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.4958 23.0604C33.3521 23.0604 34.0463 22.3662 34.0463 21.5099C34.0463 20.6536 33.3521 19.9595 32.4958 19.9595C31.6395 19.9595 30.9454 20.6536 30.9454 21.5099C30.9454 22.3662 31.6395 23.0604 32.4958 23.0604Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.4875 23.0604C43.3438 23.0604 44.038 22.3662 44.038 21.5099C44.038 20.6536 43.3438 19.9595 42.4875 19.9595C41.6312 19.9595 40.9371 20.6536 40.9371 21.5099C40.9371 22.3662 41.6312 23.0604 42.4875 23.0604Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M52.4795 23.0604C53.3358 23.0604 54.03 22.3662 54.03 21.5099C54.03 20.6536 53.3358 19.9595 52.4795 19.9595C51.6233 19.9595 50.9291 20.6536 50.9291 21.5099C50.9291 22.3662 51.6233 23.0604 52.4795 23.0604Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M2.52045 33.0404C3.37674 33.0404 4.0709 32.3462 4.0709 31.4899C4.0709 30.6336 3.37674 29.9395 2.52045 29.9395C1.66416 29.9395 0.970001 30.6336 0.970001 31.4899C0.970001 32.3462 1.66416 33.0404 2.52045 33.0404Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5118 33.0404C13.3681 33.0404 14.0622 32.3462 14.0622 31.4899C14.0622 30.6336 13.3681 29.9395 12.5118 29.9395C11.6555 29.9395 10.9613 30.6336 10.9613 31.4899C10.9613 32.3462 11.6555 33.0404 12.5118 33.0404Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.5038 33.0404C23.3601 33.0404 24.0543 32.3462 24.0543 31.4899C24.0543 30.6336 23.3601 29.9395 22.5038 29.9395C21.6475 29.9395 20.9534 30.6336 20.9534 31.4899C20.9534 32.3462 21.6475 33.0404 22.5038 33.0404Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.4958 33.0404C33.3521 33.0404 34.0463 32.3462 34.0463 31.4899C34.0463 30.6336 33.3521 29.9395 32.4958 29.9395C31.6395 29.9395 30.9454 30.6336 30.9454 31.4899C30.9454 32.3462 31.6395 33.0404 32.4958 33.0404Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.4875 33.0404C43.3438 33.0404 44.038 32.3462 44.038 31.4899C44.038 30.6336 43.3438 29.9395 42.4875 29.9395C41.6312 29.9395 40.9371 30.6336 40.9371 31.4899C40.9371 32.3462 41.6312 33.0404 42.4875 33.0404Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M52.4795 33.0404C53.3358 33.0404 54.03 32.3462 54.03 31.4899C54.03 30.6336 53.3358 29.9395 52.4795 29.9395C51.6233 29.9395 50.9291 30.6336 50.9291 31.4899C50.9291 32.3462 51.6233 33.0404 52.4795 33.0404Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M2.52045 43.0203C3.37674 43.0203 4.0709 42.3262 4.0709 41.4699C4.0709 40.6136 3.37674 39.9194 2.52045 39.9194C1.66416 39.9194 0.970001 40.6136 0.970001 41.4699C0.970001 42.3262 1.66416 43.0203 2.52045 43.0203Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5118 43.0203C13.3681 43.0203 14.0622 42.3262 14.0622 41.4699C14.0622 40.6136 13.3681 39.9194 12.5118 39.9194C11.6555 39.9194 10.9613 40.6136 10.9613 41.4699C10.9613 42.3262 11.6555 43.0203 12.5118 43.0203Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.5038 43.0203C23.3601 43.0203 24.0543 42.3262 24.0543 41.4699C24.0543 40.6136 23.3601 39.9194 22.5038 39.9194C21.6475 39.9194 20.9534 40.6136 20.9534 41.4699C20.9534 42.3262 21.6475 43.0203 22.5038 43.0203Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.4958 43.0203C33.3521 43.0203 34.0463 42.3262 34.0463 41.4699C34.0463 40.6136 33.3521 39.9194 32.4958 39.9194C31.6395 39.9194 30.9454 40.6136 30.9454 41.4699C30.9454 42.3262 31.6395 43.0203 32.4958 43.0203Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.4875 43.0203C43.3438 43.0203 44.038 42.3262 44.038 41.4699C44.038 40.6136 43.3438 39.9194 42.4875 39.9194C41.6312 39.9194 40.9371 40.6136 40.9371 41.4699C40.9371 42.3262 41.6312 43.0203 42.4875 43.0203Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M52.4795 43.0203C53.3358 43.0203 54.03 42.3262 54.03 41.4699C54.03 40.6136 53.3358 39.9194 52.4795 39.9194C51.6233 39.9194 50.9291 40.6136 50.9291 41.4699C50.9291 42.3262 51.6233 43.0203 52.4795 43.0203Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M2.52045 53.0001C3.37674 53.0001 4.0709 52.3059 4.0709 51.4496C4.0709 50.5933 3.37674 49.8992 2.52045 49.8992C1.66416 49.8992 0.970001 50.5933 0.970001 51.4496C0.970001 52.3059 1.66416 53.0001 2.52045 53.0001Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5118 53.0001C13.3681 53.0001 14.0622 52.3059 14.0622 51.4496C14.0622 50.5933 13.3681 49.8992 12.5118 49.8992C11.6555 49.8992 10.9613 50.5933 10.9613 51.4496C10.9613 52.3059 11.6555 53.0001 12.5118 53.0001Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.5038 53.0001C23.3601 53.0001 24.0543 52.3059 24.0543 51.4496C24.0543 50.5933 23.3601 49.8992 22.5038 49.8992C21.6475 49.8992 20.9534 50.5933 20.9534 51.4496C20.9534 52.3059 21.6475 53.0001 22.5038 53.0001Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.4958 53.0001C33.3521 53.0001 34.0463 52.3059 34.0463 51.4496C34.0463 50.5933 33.3521 49.8992 32.4958 49.8992C31.6395 49.8992 30.9454 50.5933 30.9454 51.4496C30.9454 52.3059 31.6395 53.0001 32.4958 53.0001Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.4875 53.0001C43.3438 53.0001 44.038 52.3059 44.038 51.4496C44.038 50.5933 43.3438 49.8992 42.4875 49.8992C41.6312 49.8992 40.9371 50.5933 40.9371 51.4496C40.9371 52.3059 41.6312 53.0001 42.4875 53.0001Z"
                                                    fill="#3758F9"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M52.4795 53.0001C53.3358 53.0001 54.03 52.3059 54.03 51.4496C54.03 50.5933 53.3358 49.8992 52.4795 49.8992C51.6233 49.8992 50.9291 50.5933 50.9291 51.4496C50.9291 52.3059 51.6233 53.0001 52.4795 53.0001Z"
                                                    fill="#3758F9"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-dark mb-1 text-lg font-semibold">Andi Aryanto</h4>
                                        <p className="text-body-color mb-5 text-sm">Software Developer</p>
                                        <div className="flex items-center justify-center gap-5">
                                            <a href="https://github.com/bacoti" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M12 0.297C5.373 0.297 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.43 9.025 23.108C9.025 22.819 9.015 22.065 9.009 21.065C5.672 21.789 4.967 19.427 4.967 19.427C4.422 18.043 3.633 17.657 3.633 17.657C2.546 16.911 3.716 16.927 3.716 16.927C4.922 17.013 5.555 18.162 5.555 18.162C6.625 19.996 8.366 19.484 9.048 19.184C9.157 18.406 9.46 17.87 9.797 17.567C7.141 17.267 4.343 16.234 4.343 11.577C4.343 10.26 4.813 9.204 5.6 8.38C5.475 8.077 5.073 6.832 5.725 5.134C5.725 5.134 6.71 4.81 8.995 6.408C9.935 6.145 10.945 6.013 11.955 6.007C12.965 6.013 13.975 6.145 14.915 6.408C17.2 4.81 18.185 5.134 18.185 5.134C18.837 6.832 18.435 8.077 18.31 8.38C19.097 9.204 19.567 10.26 19.567 11.577C19.567 16.248 16.762 17.263 14.1 17.557C14.514 17.921 14.885 18.659 14.885 19.762C14.885 21.316 14.869 22.705 14.869 23.108C14.869 23.43 15.089 23.8 15.695 23.682C20.46 22.095 23.897 17.598 23.897 12.297C23.897 5.67 18.523 0.297 12 0.297Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="https://www.linkedin.com/in/andi-aryanto" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M4.983 3.5C4.983 4.60457 4.08557 5.5 2.983 5.5C1.88043 5.5 0.983002 4.60457 0.983002 3.5C0.983002 2.39543 1.88043 1.5 2.983 1.5C4.08557 1.5 4.983 2.39543 4.983 3.5ZM1 8.5H5V22H1V8.5ZM8.982 8.5H12.788V10.325C13.33 9.225 14.716 8.096 16.896 8.096C21.08 8.096 22 10.816 22 14.545V22H18V15.125C18 13.25 17.964 10.875 15.557 10.875C13.113 10.875 12.75 12.893 12.75 14.988V22H8.982V8.5Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="https://www.instagram.com/andiiarynt" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M9.02429 11.8066C10.5742 11.8066 11.8307 10.5501 11.8307 9.00018C11.8307 7.45022 10.5742 6.19373 9.02429 6.19373C7.47433 6.19373 6.21783 7.45022 6.21783 9.00018C6.21783 10.5501 7.47433 11.8066 9.02429 11.8066Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M12.0726 1.5H5.92742C3.48387 1.5 1.5 3.48387 1.5 5.92742V12.0242C1.5 14.5161 3.48387 16.5 5.92742 16.5H12.0242C14.5161 16.5 16.5 14.5161 16.5 12.0726V5.92742C16.5 3.48387 14.5161 1.5 12.0726 1.5ZM9.02419 12.6774C6.96774 12.6774 5.34677 11.0081 5.34677 9C5.34677 6.99194 6.99194 5.32258 9.02419 5.32258C11.0323 5.32258 12.6774 6.99194 12.6774 9C12.6774 11.0081 11.0565 12.6774 9.02419 12.6774ZM14.1048 5.66129C13.8629 5.92742 13.5 6.07258 13.0887 6.07258C12.7258 6.07258 12.3629 5.92742 12.0726 5.66129C11.8065 5.39516 11.6613 5.05645 11.6613 4.64516C11.6613 4.23387 11.8065 3.91935 12.0726 3.62903C12.3387 3.33871 12.6774 3.19355 13.0887 3.19355C13.4516 3.19355 13.8387 3.33871 14.1048 3.60484C14.3468 3.91935 14.5161 4.28226 14.5161 4.66935C14.4919 5.05645 14.3468 5.39516 14.1048 5.66129Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M13.1135 4.06433C12.799 4.06433 12.5329 4.33046 12.5329 4.64498C12.5329 4.95949 12.799 5.22562 13.1135 5.22562C13.428 5.22562 13.6942 4.95949 13.6942 4.64498C13.6942 4.33046 13.4522 4.06433 13.1135 4.06433Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:w-1/2 lg:w-1/4 xl:w-1/4">
                                <div className="group shadow-testimonial mb-8 rounded-xl bg-white px-5 pt-12 pb-10">
                                    <div className="relative z-10 mx-auto mb-5 h-[120px] w-[120px]">
                                        <img src="/images/team/team2.jpg" alt="team image" className="h-[120px] w-[120px] rounded-full" />
                                        <span className="absolute bottom-0 left-0 -z-10 h-10 w-10 rounded-full bg-secondary opacity-0 transition-all group-hover:opacity-100"></span>
                                        <span className="absolute top-0 right-0 -z-10 opacity-0 transition-all group-hover:opacity-100">
                                            <svg width="45" height="53" viewBox="0 0 45 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M2.54166 3.1009C3.39795 3.1009 4.09211 2.40674 4.09211 1.55045C4.09211 0.69416 3.39795 0 2.54166 0C1.68537 0 0.991211 0.69416 0.991211 1.55045C0.991211 2.40674 1.68537 3.1009 2.54166 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5338 3.1009C13.3901 3.1009 14.0843 2.40674 14.0843 1.55045C14.0843 0.69416 13.3901 0 12.5338 0C11.6776 0 10.9834 0.69416 10.9834 1.55045C10.9834 2.40674 11.6776 3.1009 12.5338 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.526 3.1009C23.3823 3.1009 24.0765 2.40674 24.0765 1.55045C24.0765 0.69416 23.3823 0 22.526 0C21.6697 0 20.9756 0.69416 20.9756 1.55045C20.9756 2.40674 21.6697 3.1009 22.526 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 3.1009C33.374 3.1009 34.0682 2.40674 34.0682 1.55045C34.0682 0.69416 33.374 0 32.5177 0C31.6614 0 30.9673 0.69416 30.9673 1.55045C30.9673 2.40674 31.6614 3.1009 32.5177 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 3.1009C43.3657 3.1009 44.0599 2.40674 44.0599 1.55045C44.0599 0.69416 43.3657 0 42.5094 0C41.6531 0 40.959 0.69416 40.959 1.55045C40.959 2.40674 41.6531 3.1009 42.5094 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5338 13.0804C13.3901 13.0804 14.0843 12.3862 14.0843 11.5299C14.0843 10.6737 13.3901 9.97949 12.5338 9.97949C11.6776 9.97949 10.9834 10.6737 10.9834 11.5299C10.9834 12.3862 11.6776 13.0804 12.5338 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.526 13.0804C23.3823 13.0804 24.0765 12.3862 24.0765 11.5299C24.0765 10.6737 23.3823 9.97949 22.526 9.97949C21.6697 9.97949 20.9756 10.6737 20.9756 11.5299C20.9756 12.3862 21.6697 13.0804 22.526 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 13.0804C33.374 13.0804 34.0682 12.3862 34.0682 11.5299C34.0682 10.6737 33.374 9.97949 32.5177 9.97949C31.6614 9.97949 30.9673 10.6737 30.9673 11.5299C30.9673 12.3862 31.6614 13.0804 32.5177 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 13.0804C43.3657 13.0804 44.0599 12.3862 44.0599 11.5299C44.0599 10.6737 43.3657 9.97949 42.5094 9.97949C41.6531 9.97949 40.959 10.6737 40.959 11.5299C40.959 12.3862 41.6531 13.0804 42.5094 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.526 23.0604C23.3823 23.0604 24.0765 22.3662 24.0765 21.5099C24.0765 20.6536 23.3823 19.9595 22.526 19.9595C21.6697 19.9595 20.9756 20.6536 20.9756 21.5099C20.9756 22.3662 21.6697 23.0604 22.526 23.0604Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 23.0604C33.374 23.0604 34.0682 22.3662 34.0682 21.5099C34.0682 20.6536 33.374 19.9595 32.5177 19.9595C31.6614 19.9595 30.9673 20.6536 30.9673 21.5099C30.9673 22.3662 31.6614 23.0604 32.5177 23.0604Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 23.0604C43.3657 23.0604 44.0599 22.3662 44.0599 21.5099C44.0599 20.6536 43.3657 19.9595 42.5094 19.9595C41.6531 19.9595 40.959 20.6536 40.959 21.5099C40.959 22.3662 41.6531 23.0604 42.5094 23.0604Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 33.0404C33.374 33.0404 34.0682 32.3462 34.0682 31.4899C34.0682 30.6336 33.374 29.9395 32.5177 29.9395C31.6614 29.9395 30.9673 30.6336 30.9673 31.4899C30.9673 32.3462 31.6614 33.0404 32.5177 33.0404Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 33.0404C43.3657 33.0404 44.0599 32.3462 44.0599 31.4899C44.0599 30.6336 43.3657 29.9395 42.5094 29.9395C41.6531 29.9395 40.959 30.6336 40.959 31.4899C40.959 32.3462 41.6531 33.0404 42.5094 33.0404Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 43.0203C33.374 43.0203 34.0682 42.3262 34.0682 41.4699C34.0682 40.6136 33.374 39.9194 32.5177 39.9194C31.6614 39.9194 30.9673 40.6136 30.9673 41.4699C30.9673 42.3262 31.6614 43.0203 32.5177 43.0203Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 43.0203C43.3657 43.0203 44.0599 42.3262 44.0599 41.4699C44.0599 40.6136 43.3657 39.9194 42.5094 39.9194C41.6531 39.9194 40.959 40.6136 40.959 41.4699C40.959 42.3262 41.6531 43.0203 42.5094 43.0203Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 52.9998C43.3657 52.9998 44.0599 52.3057 44.0599 51.4494C44.0599 50.5931 43.3657 49.8989 42.5094 49.8989C41.6531 49.8989 40.959 50.5931 40.959 51.4494C40.959 52.3057 41.6531 52.9998 42.5094 52.9998Z"
                                                    fill="#3056D3"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-dark mb-1 text-lg font-semibold">Rizky Hakim</h4>
                                        <p className="text-body-color mb-5 text-sm">Software Developer</p>
                                        <div className="flex items-center justify-center gap-5">
                                            <a href="https://github.com/Hakimrizm" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M12 0.297C5.373 0.297 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.43 9.025 23.108C9.025 22.819 9.015 22.065 9.009 21.065C5.672 21.789 4.967 19.427 4.967 19.427C4.422 18.043 3.633 17.657 3.633 17.657C2.546 16.911 3.716 16.927 3.716 16.927C4.922 17.013 5.555 18.162 5.555 18.162C6.625 19.996 8.366 19.484 9.048 19.184C9.157 18.406 9.46 17.87 9.797 17.567C7.141 17.267 4.343 16.234 4.343 11.577C4.343 10.26 4.813 9.204 5.6 8.38C5.475 8.077 5.073 6.832 5.725 5.134C5.725 5.134 6.71 4.81 8.995 6.408C9.935 6.145 10.945 6.013 11.955 6.007C12.965 6.013 13.975 6.145 14.915 6.408C17.2 4.81 18.185 5.134 18.185 5.134C18.837 6.832 18.435 8.077 18.31 8.38C19.097 9.204 19.567 10.26 19.567 11.577C19.567 16.248 16.762 17.263 14.1 17.557C14.514 17.921 14.885 18.659 14.885 19.762C14.885 21.316 14.869 22.705 14.869 23.108C14.869 23.43 15.089 23.8 15.695 23.682C20.46 22.095 23.897 17.598 23.897 12.297C23.897 5.67 18.523 0.297 12 0.297Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="www.linkedin.com/in/muhammad-rizky-hakim" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M4.983 3.5C4.983 4.60457 4.08557 5.5 2.983 5.5C1.88043 5.5 0.983002 4.60457 0.983002 3.5C0.983002 2.39543 1.88043 1.5 2.983 1.5C4.08557 1.5 4.983 2.39543 4.983 3.5ZM1 8.5H5V22H1V8.5ZM8.982 8.5H12.788V10.325C13.33 9.225 14.716 8.096 16.896 8.096C21.08 8.096 22 10.816 22 14.545V22H18V15.125C18 13.25 17.964 10.875 15.557 10.875C13.113 10.875 12.75 12.893 12.75 14.988V22H8.982V8.5Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="https://www.instagram.com/hakimrizzm" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M9.02429 11.8066C10.5742 11.8066 11.8307 10.5501 11.8307 9.00018C11.8307 7.45022 10.5742 6.19373 9.02429 6.19373C7.47433 6.19373 6.21783 7.45022 6.21783 9.00018C6.21783 10.5501 7.47433 11.8066 9.02429 11.8066Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M12.0726 1.5H5.92742C3.48387 1.5 1.5 3.48387 1.5 5.92742V12.0242C1.5 14.5161 3.48387 16.5 5.92742 16.5H12.0242C14.5161 16.5 16.5 14.5161 16.5 12.0726V5.92742C16.5 3.48387 14.5161 1.5 12.0726 1.5ZM9.02419 12.6774C6.96774 12.6774 5.34677 11.0081 5.34677 9C5.34677 6.99194 6.99194 5.32258 9.02419 5.32258C11.0323 5.32258 12.6774 6.99194 12.6774 9C12.6774 11.0081 11.0565 12.6774 9.02419 12.6774ZM14.1048 5.66129C13.8629 5.92742 13.5 6.07258 13.0887 6.07258C12.7258 6.07258 12.3629 5.92742 12.0726 5.66129C11.8065 5.39516 11.6613 5.05645 11.6613 4.64516C11.6613 4.23387 11.8065 3.91935 12.0726 3.62903C12.3387 3.33871 12.6774 3.19355 13.0887 3.19355C13.4516 3.19355 13.8387 3.33871 14.1048 3.60484C14.3468 3.91935 14.5161 4.28226 14.5161 4.66935C14.4919 5.05645 14.3468 5.39516 14.1048 5.66129Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M13.1135 4.06433C12.799 4.06433 12.5329 4.33046 12.5329 4.64498C12.5329 4.95949 12.799 5.22562 13.1135 5.22562C13.428 5.22562 13.6942 4.95949 13.6942 4.64498C13.6942 4.33046 13.4522 4.06433 13.1135 4.06433Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:w-1/2 lg:w-1/4 xl:w-1/4">
                                <div className="group shadow-testimonial mb-8 rounded-xl bg-white px-5 pt-12 pb-10">
                                    <div className="relative z-10 mx-auto mb-5 h-[120px] w-[120px]">
                                        <img src="/images/team/team3.jpg" alt="team image" className="h-[120px] w-[120px] rounded-full" />
                                        <span className="absolute bottom-0 left-0 -z-10 h-10 w-10 rounded-full bg-secondary opacity-0 transition-all group-hover:opacity-100"></span>
                                        <span className="absolute top-0 right-0 -z-10 opacity-0 transition-all group-hover:opacity-100">
                                            <svg width="45" height="53" viewBox="0 0 45 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M2.54166 3.1009C3.39795 3.1009 4.09211 2.40674 4.09211 1.55045C4.09211 0.69416 3.39795 0 2.54166 0C1.68537 0 0.991211 0.69416 0.991211 1.55045C0.991211 2.40674 1.68537 3.1009 2.54166 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5338 3.1009C13.3901 3.1009 14.0843 2.40674 14.0843 1.55045C14.0843 0.69416 13.3901 0 12.5338 0C11.6776 0 10.9834 0.69416 10.9834 1.55045C10.9834 2.40674 11.6776 3.1009 12.5338 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.526 3.1009C23.3823 3.1009 24.0765 2.40674 24.0765 1.55045C24.0765 0.69416 23.3823 0 22.526 0C21.6697 0 20.9756 0.69416 20.9756 1.55045C20.9756 2.40674 21.6697 3.1009 22.526 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 3.1009C33.374 3.1009 34.0682 2.40674 34.0682 1.55045C34.0682 0.69416 33.374 0 32.5177 0C31.6614 0 30.9673 0.69416 30.9673 1.55045C30.9673 2.40674 31.6614 3.1009 32.5177 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 3.1009C43.3657 3.1009 44.0599 2.40674 44.0599 1.55045C44.0599 0.69416 43.3657 0 42.5094 0C41.6531 0 40.959 0.69416 40.959 1.55045C40.959 2.40674 41.6531 3.1009 42.5094 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5338 13.0804C13.3901 13.0804 14.0843 12.3862 14.0843 11.5299C14.0843 10.6737 13.3901 9.97949 12.5338 9.97949C11.6776 9.97949 10.9834 10.6737 10.9834 11.5299C10.9834 12.3862 11.6776 13.0804 12.5338 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.526 13.0804C23.3823 13.0804 24.0765 12.3862 24.0765 11.5299C24.0765 10.6737 23.3823 9.97949 22.526 9.97949C21.6697 9.97949 20.9756 10.6737 20.9756 11.5299C20.9756 12.3862 21.6697 13.0804 22.526 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 13.0804C33.374 13.0804 34.0682 12.3862 34.0682 11.5299C34.0682 10.6737 33.374 9.97949 32.5177 9.97949C31.6614 9.97949 30.9673 10.6737 30.9673 11.5299C30.9673 12.3862 31.6614 13.0804 32.5177 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 13.0804C43.3657 13.0804 44.0599 12.3862 44.0599 11.5299C44.0599 10.6737 43.3657 9.97949 42.5094 9.97949C41.6531 9.97949 40.959 10.6737 40.959 11.5299C40.959 12.3862 41.6531 13.0804 42.5094 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.526 23.0604C23.3823 23.0604 24.0765 22.3662 24.0765 21.5099C24.0765 20.6536 23.3823 19.9595 22.526 19.9595C21.6697 19.9595 20.9756 20.6536 20.9756 21.5099C20.9756 22.3662 21.6697 23.0604 22.526 23.0604Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 23.0604C33.374 23.0604 34.0682 22.3662 34.0682 21.5099C34.0682 20.6536 33.374 19.9595 32.5177 19.9595C31.6614 19.9595 30.9673 20.6536 30.9673 21.5099C30.9673 22.3662 31.6614 23.0604 32.5177 23.0604Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 23.0604C43.3657 23.0604 44.0599 22.3662 44.0599 21.5099C44.0599 20.6536 43.3657 19.9595 42.5094 19.9595C41.6531 19.9595 40.959 20.6536 40.959 21.5099C40.959 22.3662 41.6531 23.0604 42.5094 23.0604Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 33.0404C33.374 33.0404 34.0682 32.3462 34.0682 31.4899C34.0682 30.6336 33.374 29.9395 32.5177 29.9395C31.6614 29.9395 30.9673 30.6336 30.9673 31.4899C30.9673 32.3462 31.6614 33.0404 32.5177 33.0404Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 33.0404C43.3657 33.0404 44.0599 32.3462 44.0599 31.4899C44.0599 30.6336 43.3657 29.9395 42.5094 29.9395C41.6531 29.9395 40.959 30.6336 40.959 31.4899C40.959 32.3462 41.6531 33.0404 42.5094 33.0404Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 43.0203C33.374 43.0203 34.0682 42.3262 34.0682 41.4699C34.0682 40.6136 33.374 39.9194 32.5177 39.9194C31.6614 39.9194 30.9673 40.6136 30.9673 41.4699C30.9673 42.3262 31.6614 43.0203 32.5177 43.0203Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 43.0203C43.3657 43.0203 44.0599 42.3262 44.0599 41.4699C44.0599 40.6136 43.3657 39.9194 42.5094 39.9194C41.6531 39.9194 40.959 40.6136 40.959 41.4699C40.959 42.3262 41.6531 43.0203 42.5094 43.0203Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 52.9998C43.3657 52.9998 44.0599 52.3057 44.0599 51.4494C44.0599 50.5931 43.3657 49.8989 42.5094 49.8989C41.6531 49.8989 40.959 50.5931 40.959 51.4494C40.959 52.3057 41.6531 52.9998 42.5094 52.9998Z"
                                                    fill="#3056D3"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-dark mb-1 text-lg font-semibold">Khairan</h4>
                                        <p className="text-body-color mb-5 text-sm">Finance</p>
                                        <div className="flex items-center justify-center gap-5">
                                            <a href="https://github.com/CERULEDGE-4Khay" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M12 0.297C5.373 0.297 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.43 9.025 23.108C9.025 22.819 9.015 22.065 9.009 21.065C5.672 21.789 4.967 19.427 4.967 19.427C4.422 18.043 3.633 17.657 3.633 17.657C2.546 16.911 3.716 16.927 3.716 16.927C4.922 17.013 5.555 18.162 5.555 18.162C6.625 19.996 8.366 19.484 9.048 19.184C9.157 18.406 9.46 17.87 9.797 17.567C7.141 17.267 4.343 16.234 4.343 11.577C4.343 10.26 4.813 9.204 5.6 8.38C5.475 8.077 5.073 6.832 5.725 5.134C5.725 5.134 6.71 4.81 8.995 6.408C9.935 6.145 10.945 6.013 11.955 6.007C12.965 6.013 13.975 6.145 14.915 6.408C17.2 4.81 18.185 5.134 18.185 5.134C18.837 6.832 18.435 8.077 18.31 8.38C19.097 9.204 19.567 10.26 19.567 11.577C19.567 16.248 16.762 17.263 14.1 17.557C14.514 17.921 14.885 18.659 14.885 19.762C14.885 21.316 14.869 22.705 14.869 23.108C14.869 23.43 15.089 23.8 15.695 23.682C20.46 22.095 23.897 17.598 23.897 12.297C23.897 5.67 18.523 0.297 12 0.297Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="https://www.linkedin.com/in/khairan-mochamad" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M4.983 3.5C4.983 4.60457 4.08557 5.5 2.983 5.5C1.88043 5.5 0.983002 4.60457 0.983002 3.5C0.983002 2.39543 1.88043 1.5 2.983 1.5C4.08557 1.5 4.983 2.39543 4.983 3.5ZM1 8.5H5V22H1V8.5ZM8.982 8.5H12.788V10.325C13.33 9.225 14.716 8.096 16.896 8.096C21.08 8.096 22 10.816 22 14.545V22H18V15.125C18 13.25 17.964 10.875 15.557 10.875C13.113 10.875 12.75 12.893 12.75 14.988V22H8.982V8.5Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="https://www.instagram.com/m.khairan22" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M9.02429 11.8066C10.5742 11.8066 11.8307 10.5501 11.8307 9.00018C11.8307 7.45022 10.5742 6.19373 9.02429 6.19373C7.47433 6.19373 6.21783 7.45022 6.21783 9.00018C6.21783 10.5501 7.47433 11.8066 9.02429 11.8066Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M12.0726 1.5H5.92742C3.48387 1.5 1.5 3.48387 1.5 5.92742V12.0242C1.5 14.5161 3.48387 16.5 5.92742 16.5H12.0242C14.5161 16.5 16.5 14.5161 16.5 12.0726V5.92742C16.5 3.48387 14.5161 1.5 12.0726 1.5ZM9.02419 12.6774C6.96774 12.6774 5.34677 11.0081 5.34677 9C5.34677 6.99194 6.99194 5.32258 9.02419 5.32258C11.0323 5.32258 12.6774 6.99194 12.6774 9C12.6774 11.0081 11.0565 12.6774 9.02419 12.6774ZM14.1048 5.66129C13.8629 5.92742 13.5 6.07258 13.0887 6.07258C12.7258 6.07258 12.3629 5.92742 12.0726 5.66129C11.8065 5.39516 11.6613 5.05645 11.6613 4.64516C11.6613 4.23387 11.8065 3.91935 12.0726 3.62903C12.3387 3.33871 12.6774 3.19355 13.0887 3.19355C13.4516 3.19355 13.8387 3.33871 14.1048 3.60484C14.3468 3.91935 14.5161 4.28226 14.5161 4.66935C14.4919 5.05645 14.3468 5.39516 14.1048 5.66129Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M13.1135 4.06433C12.799 4.06433 12.5329 4.33046 12.5329 4.64498C12.5329 4.95949 12.799 5.22562 13.1135 5.22562C13.428 5.22562 13.6942 4.95949 13.6942 4.64498C13.6942 4.33046 13.4522 4.06433 13.1135 4.06433Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:w-1/2 lg:w-1/4 xl:w-1/4">
                                <div className="group shadow-testimonial mb-8 rounded-xl bg-white px-5 pt-12 pb-10">
                                    <div className="relative z-10 mx-auto mb-5 h-[120px] w-[120px]">
                                        <img src="/images/team/team4.jpg" alt="team image" className="h-[120px] w-[120px] rounded-full" />
                                        <span className="absolute bottom-0 left-0 -z-10 h-10 w-10 rounded-full bg-secondary opacity-0 transition-all group-hover:opacity-100"></span>
                                        <span className="absolute top-0 right-0 -z-10 opacity-0 transition-all group-hover:opacity-100">
                                            <svg width="45" height="53" viewBox="0 0 45 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M2.54166 3.1009C3.39795 3.1009 4.09211 2.40674 4.09211 1.55045C4.09211 0.69416 3.39795 0 2.54166 0C1.68537 0 0.991211 0.69416 0.991211 1.55045C0.991211 2.40674 1.68537 3.1009 2.54166 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5338 3.1009C13.3901 3.1009 14.0843 2.40674 14.0843 1.55045C14.0843 0.69416 13.3901 0 12.5338 0C11.6776 0 10.9834 0.69416 10.9834 1.55045C10.9834 2.40674 11.6776 3.1009 12.5338 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.526 3.1009C23.3823 3.1009 24.0765 2.40674 24.0765 1.55045C24.0765 0.69416 23.3823 0 22.526 0C21.6697 0 20.9756 0.69416 20.9756 1.55045C20.9756 2.40674 21.6697 3.1009 22.526 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 3.1009C33.374 3.1009 34.0682 2.40674 34.0682 1.55045C34.0682 0.69416 33.374 0 32.5177 0C31.6614 0 30.9673 0.69416 30.9673 1.55045C30.9673 2.40674 31.6614 3.1009 32.5177 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 3.1009C43.3657 3.1009 44.0599 2.40674 44.0599 1.55045C44.0599 0.69416 43.3657 0 42.5094 0C41.6531 0 40.959 0.69416 40.959 1.55045C40.959 2.40674 41.6531 3.1009 42.5094 3.1009Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M12.5338 13.0804C13.3901 13.0804 14.0843 12.3862 14.0843 11.5299C14.0843 10.6737 13.3901 9.97949 12.5338 9.97949C11.6776 9.97949 10.9834 10.6737 10.9834 11.5299C10.9834 12.3862 11.6776 13.0804 12.5338 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.526 13.0804C23.3823 13.0804 24.0765 12.3862 24.0765 11.5299C24.0765 10.6737 23.3823 9.97949 22.526 9.97949C21.6697 9.97949 20.9756 10.6737 20.9756 11.5299C20.9756 12.3862 21.6697 13.0804 22.526 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 13.0804C33.374 13.0804 34.0682 12.3862 34.0682 11.5299C34.0682 10.6737 33.374 9.97949 32.5177 9.97949C31.6614 9.97949 30.9673 10.6737 30.9673 11.5299C30.9673 12.3862 31.6614 13.0804 32.5177 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 13.0804C43.3657 13.0804 44.0599 12.3862 44.0599 11.5299C44.0599 10.6737 43.3657 9.97949 42.5094 9.97949C41.6531 9.97949 40.959 10.6737 40.959 11.5299C40.959 12.3862 41.6531 13.0804 42.5094 13.0804Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M22.526 23.0604C23.3823 23.0604 24.0765 22.3662 24.0765 21.5099C24.0765 20.6536 23.3823 19.9595 22.526 19.9595C21.6697 19.9595 20.9756 20.6536 20.9756 21.5099C20.9756 22.3662 21.6697 23.0604 22.526 23.0604Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 23.0604C33.374 23.0604 34.0682 22.3662 34.0682 21.5099C34.0682 20.6536 33.374 19.9595 32.5177 19.9595C31.6614 19.9595 30.9673 20.6536 30.9673 21.5099C30.9673 22.3662 31.6614 23.0604 32.5177 23.0604Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 23.0604C43.3657 23.0604 44.0599 22.3662 44.0599 21.5099C44.0599 20.6536 43.3657 19.9595 42.5094 19.9595C41.6531 19.9595 40.959 20.6536 40.959 21.5099C40.959 22.3662 41.6531 23.0604 42.5094 23.0604Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 33.0404C33.374 33.0404 34.0682 32.3462 34.0682 31.4899C34.0682 30.6336 33.374 29.9395 32.5177 29.9395C31.6614 29.9395 30.9673 30.6336 30.9673 31.4899C30.9673 32.3462 31.6614 33.0404 32.5177 33.0404Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 33.0404C43.3657 33.0404 44.0599 32.3462 44.0599 31.4899C44.0599 30.6336 43.3657 29.9395 42.5094 29.9395C41.6531 29.9395 40.959 30.6336 40.959 31.4899C40.959 32.3462 41.6531 33.0404 42.5094 33.0404Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M32.5177 43.0203C33.374 43.0203 34.0682 42.3262 34.0682 41.4699C34.0682 40.6136 33.374 39.9194 32.5177 39.9194C31.6614 39.9194 30.9673 40.6136 30.9673 41.4699C30.9673 42.3262 31.6614 43.0203 32.5177 43.0203Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 43.0203C43.3657 43.0203 44.0599 42.3262 44.0599 41.4699C44.0599 40.6136 43.3657 39.9194 42.5094 39.9194C41.6531 39.9194 40.959 40.6136 40.959 41.4699C40.959 42.3262 41.6531 43.0203 42.5094 43.0203Z"
                                                    fill="#3056D3"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M42.5094 52.9998C43.3657 52.9998 44.0599 52.3057 44.0599 51.4494C44.0599 50.5931 43.3657 49.8989 42.5094 49.8989C41.6531 49.8989 40.959 50.5931 40.959 51.4494C40.959 52.3057 41.6531 52.9998 42.5094 52.9998Z"
                                                    fill="#3056D3"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-dark mb-1 text-lg font-semibold">Najmie Fadhilah</h4>
                                        <p className="text-body-color mb-5 text-sm">Marketing</p>
                                        <div className="flex items-center justify-center gap-5">
                                            <a href="javascript:void(0)" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M12 0.297C5.373 0.297 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.43 9.025 23.108C9.025 22.819 9.015 22.065 9.009 21.065C5.672 21.789 4.967 19.427 4.967 19.427C4.422 18.043 3.633 17.657 3.633 17.657C2.546 16.911 3.716 16.927 3.716 16.927C4.922 17.013 5.555 18.162 5.555 18.162C6.625 19.996 8.366 19.484 9.048 19.184C9.157 18.406 9.46 17.87 9.797 17.567C7.141 17.267 4.343 16.234 4.343 11.577C4.343 10.26 4.813 9.204 5.6 8.38C5.475 8.077 5.073 6.832 5.725 5.134C5.725 5.134 6.71 4.81 8.995 6.408C9.935 6.145 10.945 6.013 11.955 6.007C12.965 6.013 13.975 6.145 14.915 6.408C17.2 4.81 18.185 5.134 18.185 5.134C18.837 6.832 18.435 8.077 18.31 8.38C19.097 9.204 19.567 10.26 19.567 11.577C19.567 16.248 16.762 17.263 14.1 17.557C14.514 17.921 14.885 18.659 14.885 19.762C14.885 21.316 14.869 22.705 14.869 23.108C14.869 23.43 15.089 23.8 15.695 23.682C20.46 22.095 23.897 17.598 23.897 12.297C23.897 5.67 18.523 0.297 12 0.297Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="https://www.linkedin.com/in/najmi-fadhila-zahran" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M4.983 3.5C4.983 4.60457 4.08557 5.5 2.983 5.5C1.88043 5.5 0.983002 4.60457 0.983002 3.5C0.983002 2.39543 1.88043 1.5 2.983 1.5C4.08557 1.5 4.983 2.39543 4.983 3.5ZM1 8.5H5V22H1V8.5ZM8.982 8.5H12.788V10.325C13.33 9.225 14.716 8.096 16.896 8.096C21.08 8.096 22 10.816 22 14.545V22H18V15.125C18 13.25 17.964 10.875 15.557 10.875C13.113 10.875 12.75 12.893 12.75 14.988V22H8.982V8.5Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                            <a href="https://www.instagram.com/najmiifz" className="text-dark-6 hover:text-primary">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="fill-current"
                                                >
                                                    <path
                                                        d="M9.02429 11.8066C10.5742 11.8066 11.8307 10.5501 11.8307 9.00018C11.8307 7.45022 10.5742 6.19373 9.02429 6.19373C7.47433 6.19373 6.21783 7.45022 6.21783 9.00018C6.21783 10.5501 7.47433 11.8066 9.02429 11.8066Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M12.0726 1.5H5.92742C3.48387 1.5 1.5 3.48387 1.5 5.92742V12.0242C1.5 14.5161 3.48387 16.5 5.92742 16.5H12.0242C14.5161 16.5 16.5 14.5161 16.5 12.0726V5.92742C16.5 3.48387 14.5161 1.5 12.0726 1.5ZM9.02419 12.6774C6.96774 12.6774 5.34677 11.0081 5.34677 9C5.34677 6.99194 6.99194 5.32258 9.02419 5.32258C11.0323 5.32258 12.6774 6.99194 12.6774 9C12.6774 11.0081 11.0565 12.6774 9.02419 12.6774ZM14.1048 5.66129C13.8629 5.92742 13.5 6.07258 13.0887 6.07258C12.7258 6.07258 12.3629 5.92742 12.0726 5.66129C11.8065 5.39516 11.6613 5.05645 11.6613 4.64516C11.6613 4.23387 11.8065 3.91935 12.0726 3.62903C12.3387 3.33871 12.6774 3.19355 13.0887 3.19355C13.4516 3.19355 13.8387 3.33871 14.1048 3.60484C14.3468 3.91935 14.5161 4.28226 14.5161 4.66935C14.4919 5.05645 14.3468 5.39516 14.1048 5.66129Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M13.1135 4.06433C12.799 4.06433 12.5329 4.33046 12.5329 4.64498C12.5329 4.95949 12.799 5.22562 13.1135 5.22562C13.428 5.22562 13.6942 4.95949 13.6942 4.64498C13.6942 4.33046 13.4522 4.06433 13.1135 4.06433Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End of Team */}

                {/* FAQ */}
                <section className="dark:bg-dark relative z-20 mb-20 overflow-hidden bg-white pt-20 lg:pt-[120px] lg:pb-[50px]">
                    <div className="container mx-auto px-4">
                        <div className="-mx-4 flex flex-wrap">
                            <div className="w-full px-4">
                                <div className="mx-auto mb-[60px] max-w-[520px] text-center">
                                    <span className="mb-2 block text-lg font-semibold text-primary">FAQ</span>
                                    <h2 className="text-dark mb-3 text-3xl leading-[1.2] font-bold sm:text-4xl md:text-[40px] dark:text-white">
                                        Punya Pertanyaan?
                                    </h2>
                                    <p className="text-body-color dark:text-dark-6 mx-auto max-w-[485px] text-base">
                                        There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in
                                        some form.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center">
                            <div className="w-full px-4 md:w-11/12 lg:w-9/12 xl:w-7/12">
                                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Apa itu EMKM?</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-4 text-balance">
                                            <p>
                                                E-MKM adalah platform digital hasil inovasi mahasiswa P2MW LPKIA yang membantu pelaku UMKM dan calon
                                                wirausahawan mencatat keuangan, menghitung HPP, membuat laporan usaha otomatis, dan belajar bisnis
                                                secara praktis.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Siapa yang bisa menggunakan E-MKM</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-4 text-balance">
                                            <p>
                                                Platform ini ditujukan untuk mahasiswa wirausaha, pelaku UMKM mikro, lulusan SMK, hingga pekerja yang
                                                ingin beralih ke dunia usaha.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Apakah fitur E-MKM gratis?</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-4 text-balance">
                                            <p>
                                                Ada versi gratis dengan fitur dasar, dan versi premium berbayar yang menyediakan akses penuh ke
                                                seluruhlaporan ekspor, dan lainnya.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End of FAQ */}

                {/* Contact */}
                <section id="contact" className="relative py-20 md:py-[120px]">
                    <div className="dark:bg-dark-700 absolute inset-0 h-1/2 bg-[#E9F9FF] lg:h-[45%] xl:h-1/2"></div>
                    <div className="dark:bg-dark absolute inset-0 top-1/2 bg-white"></div>
                    <div className="relative container mx-auto px-4">
                        <div className="-mx-4 flex flex-wrap items-center">
                            <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
                                <div className="ud-contact-content-wrapper">
                                    <div className="ud-contact-title mb-12 lg:mb-[150px]">
                                        <span className="text-dark mb-6 block text-base font-medium dark:text-white">HUBUNGI KAMI</span>
                                        <h2 className="text-dark max-w-[260px] text-[35px] leading-[1.14] font-semibold dark:text-white">
                                            Mari bicarakan kebutuhan bisnismu.
                                        </h2>
                                    </div>
                                    <div className="mb-12 flex flex-wrap justify-between lg:mb-0">
                                        <div className="mb-8 flex w-[330px] max-w-full">
                                            <div className="mr-6 text-[32px] text-primary">
                                                <svg width="29" height="35" viewBox="0 0 29 35" className="fill-current">
                                                    <path d="M14.5 0.710938C6.89844 0.710938 0.664062 6.72656 0.664062 14.0547C0.664062 19.9062 9.03125 29.5859 12.6406 33.5234C13.1328 34.0703 13.7891 34.3437 14.5 34.3437C15.2109 34.3437 15.8672 34.0703 16.3594 33.5234C19.9688 29.6406 28.3359 19.9062 28.3359 14.0547C28.3359 6.67188 22.1016 0.710938 14.5 0.710938ZM14.9375 32.2109C14.6641 32.4844 14.2812 32.4844 14.0625 32.2109C11.3828 29.3125 2.57812 19.3594 2.57812 14.0547C2.57812 7.71094 7.9375 2.625 14.5 2.625C21.0625 2.625 26.4219 7.76562 26.4219 14.0547C26.4219 19.3594 17.6172 29.2578 14.9375 32.2109Z" />
                                                    <path d="M14.5 8.58594C11.2734 8.58594 8.59375 11.2109 8.59375 14.4922C8.59375 17.7188 11.2187 20.3984 14.5 20.3984C17.7812 20.3984 20.4062 17.7734 20.4062 14.4922C20.4062 11.2109 17.7266 8.58594 14.5 8.58594ZM14.5 18.4297C12.3125 18.4297 10.5078 16.625 10.5078 14.4375C10.5078 12.25 12.3125 10.4453 14.5 10.4453C16.6875 10.4453 18.4922 12.25 18.4922 14.4375C18.4922 16.625 16.6875 18.4297 14.5 18.4297Z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h5 className="text-dark mb-[18px] text-lg font-semibold dark:text-white">Lokasi Kami</h5>
                                                <p className="text-body-color dark:text-dark-6 text-base">
                                                    Jl. Soekarno-Hatta No.456, Batununggal, Kec. Bandung Kidul, Kota Bandung, Jawa Barat 40266
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mb-8 flex w-[330px] max-w-full">
                                            <div className="mr-6 text-[32px] text-primary">
                                                <svg width="34" height="25" viewBox="0 0 34 25" className="fill-current">
                                                    <path d="M30.5156 0.960938H3.17188C1.42188 0.960938 0 2.38281 0 4.13281V20.9219C0 22.6719 1.42188 24.0938 3.17188 24.0938H30.5156C32.2656 24.0938 33.6875 22.6719 33.6875 20.9219V4.13281C33.6875 2.38281 32.2656 0.960938 30.5156 0.960938ZM30.5156 2.875C30.7891 2.875 31.0078 2.92969 31.2266 3.09375L17.6094 11.3516C17.1172 11.625 16.5703 11.625 16.0781 11.3516L2.46094 3.09375C2.67969 2.98438 2.89844 2.875 3.17188 2.875H30.5156ZM30.5156 22.125H3.17188C2.51562 22.125 1.91406 21.5781 1.91406 20.8672V5.00781L15.0391 12.9922C15.5859 13.3203 16.1875 13.4844 16.7891 13.4844C17.3906 13.4844 17.9922 13.3203 18.5391 12.9922L31.6641 5.00781V20.8672C31.7734 21.5781 31.1719 22.125 30.5156 22.125Z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h5 className="text-dark mb-[18px] text-lg font-semibold dark:text-white">
                                                    Butuh Bantuan atau Informasi?
                                                </h5>
                                                <p className="text-body-color dark:text-dark-6 text-base">webemkm@gmail.com</p>
                                                <a
                                                    href="https://emkm.web.id/"
                                                    className="text-base text-primary transition-colors duration-200 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    https://emkm.web.id/
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
                                <div
                                    className="wow fadeInUp shadow-testimonial dark:bg-dark-2 rounded-lg bg-white px-8 py-10 sm:px-10 sm:py-12 md:p-[60px] lg:p-10 lg:px-10 lg:py-12 2xl:p-[60px] dark:shadow-none"
                                    data-wow-delay=".2s."
                                >
                                    <h3 className="text-dark mb-8 text-2xl font-semibold md:text-[28px] md:leading-[1.42] dark:text-white">
                                        Kirim kami Pesan
                                    </h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-[22px]">
                                            <label htmlFor="fullName" className="text-body-color dark:text-dark-6 mb-4 block text-sm">
                                                Nama Lengkap*
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                placeholder="Adam Gelius"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="text-body-color placeholder:text-body-color/60 dark:border-dark-3 dark:text-dark-6 w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 focus:border-primary focus:outline-hidden"
                                            />
                                        </div>
                                        <div className="mb-[22px]">
                                            <label htmlFor="email" className="text-body-color dark:text-dark-6 mb-4 block text-sm">
                                                Email*
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="example@yourmail.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="text-body-color placeholder:text-body-color/60 dark:border-dark-3 dark:text-dark-6 w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 focus:border-primary focus:outline-hidden"
                                            />
                                        </div>
                                        <div className="mb-[22px]">
                                            <label htmlFor="phone" className="text-body-color dark:text-dark-6 mb-4 block text-sm">
                                                Nomor Telepon*
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+62 832 1234 1234"
                                                value={formData.phone}
                                                className="text-body-color placeholder:text-body-color/60 dark:border-dark-3 dark:text-dark-6 w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 focus:border-primary focus:outline-hidden"
                                            />
                                        </div>
                                        <div className="mb-[30px]">
                                            <label htmlFor="message" className="text-body-color dark:text-dark-6 mb-4 block text-sm">
                                                Pesan*
                                            </label>
                                            <textarea
                                                name="message"
                                                rows={1}
                                                placeholder="Ketikan pesan mu disini"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="text-body-color placeholder:text-body-color/60 dark:border-dark-3 dark:text-dark-6 w-full resize-none border-0 border-b border-[#f1f1f1] bg-transparent pb-3 focus:border-primary focus:outline-hidden"
                                            ></textarea>
                                        </div>
                                        <div className="mb-0">
                                            <button
                                                type="submit"
                                                className="hover:bg-blue-dark inline-flex items-center justify-center rounded-md bg-primary px-10 py-3 text-base font-medium text-white transition duration-300 ease-in-out"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End of Contact */}

                {/* Alert Dialog */}
                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{alertType === 'success' ? 'Pesan Berhasil Dikirim 🎉' : 'Terjadi Kesalahan 😕'}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {alertType === 'success'
                                    ? 'Terima kasih! Pesanmu sudah kami terima dan akan segera kami tanggapi.'
                                    : 'Gagal mengirim pesan. Silakan periksa koneksi internetmu atau coba lagi nanti.'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setAlertOpen(false)}>Oke</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {/* End of Alert Dialog */}

                {/* Footer */}
                <footer className="wow fadeInUp relative z-10 bg-[#090E34] pt-20 lg:pt-[100px]" data-wow-delay=".15s">
                    <div className="container mx-auto px-4">
                        <div className="-mx-4 flex flex-wrap justify-between">
                            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-4/12 xl:w-3/12">
                                <div className="mb-10 w-full">
                                    <a href="javascript:void(0)" className="mb-6 inline-block max-w-[160px]">
                                        <img src="/images/emkm.png" alt="logo" className="max-w-full" />
                                    </a>
                                    <p className="mb-8 max-w-[270px] text-base text-gray-500">
                                        EMKM adalah platform digital yang membantu pelaku usaha mikro, kecil, dan menengah untuk tumbuh dan berkembang
                                        melalui solusi pengelolaan bisnis yang mudah dan terintegrasi.
                                    </p>
                                    <div className="-mx-3 flex items-center">
                                        <a href="https://www.instagram.com/emkm.id" className="px-3 text-gray-500 hover:text-white">
                                            <svg
                                                width="22"
                                                height="22"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="fill-current"
                                            >
                                                <path d="M11.0297 14.4305C12.9241 14.4305 14.4598 12.8948 14.4598 11.0004C14.4598 9.10602 12.9241 7.57031 11.0297 7.57031C9.13529 7.57031 7.59958 9.10602 7.59958 11.0004C7.59958 12.8948 9.13529 14.4305 11.0297 14.4305Z" />
                                                <path d="M14.7554 1.8335H7.24463C4.25807 1.8335 1.83334 4.25823 1.83334 7.24479V14.6964C1.83334 17.7421 4.25807 20.1668 7.24463 20.1668H14.6962C17.7419 20.1668 20.1667 17.7421 20.1667 14.7555V7.24479C20.1667 4.25823 17.7419 1.8335 14.7554 1.8335ZM11.0296 15.4948C8.51614 15.4948 6.53496 13.4545 6.53496 11.0002C6.53496 8.54586 8.54571 6.50554 11.0296 6.50554C13.4839 6.50554 15.4946 8.54586 15.4946 11.0002C15.4946 13.4545 13.5134 15.4948 11.0296 15.4948ZM17.2393 6.91952C16.9436 7.24479 16.5 7.42221 15.9973 7.42221C15.5538 7.42221 15.1102 7.24479 14.7554 6.91952C14.4301 6.59425 14.2527 6.18027 14.2527 5.67758C14.2527 5.17489 14.4301 4.79049 14.7554 4.43565C15.0807 4.08081 15.4946 3.90339 15.9973 3.90339C16.4409 3.90339 16.914 4.08081 17.2393 4.40608C17.535 4.79049 17.7419 5.23403 17.7419 5.70715C17.7124 6.18027 17.535 6.59425 17.2393 6.91952Z" />
                                                <path d="M16.0276 4.96777C15.6432 4.96777 15.318 5.29304 15.318 5.67745C15.318 6.06186 15.6432 6.38713 16.0276 6.38713C16.412 6.38713 16.7373 6.06186 16.7373 5.67745C16.7373 5.29304 16.4416 4.96777 16.0276 4.96777Z" />
                                            </svg>
                                        </a>
                                        <a href="https://www.tiktok.com/@emkm.id" className="px-3 text-gray-500 hover:text-white">
                                            <svg
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="fill-current"
                                            >
                                                <path d="M12.75 2C13.38 2 13.96 2.26 14.38 2.68C14.8 3.1 15.06 3.68 15.06 4.31C15.06 6.45 17.09 8.13 19.25 8.13C19.47 8.13 19.69 8.12 19.91 8.09V10.87C19.68 10.89 19.46 10.9 19.24 10.9C18.09 10.9 16.99 10.64 15.99 10.17V15.18C15.99 18.66 13.16 21.5 9.68 21.5C6.2 21.5 3.37 18.66 3.37 15.18C3.37 11.7 6.2 8.87 9.68 8.87C10.02 8.87 10.35 8.89 10.68 8.93V11.72C10.45 11.69 10.22 11.68 9.99 11.68C8.3 11.68 6.93 13.05 6.93 14.74C6.93 16.43 8.3 17.8 9.99 17.8C11.68 17.8 13.05 16.43 13.05 14.74V2H12.75Z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-7/12 xl:w-7/12">
                                <div className="flex flex-wrap justify-end">
                                    <div className="mb-10 w-1/3 px-4">
                                        <h4 className="mb-9 text-lg font-semibold text-white">Page Section</h4>
                                        <ul>
                                            <li>
                                                <a href="#home" className="mb-3 block text-base text-gray-500 hover:text-primary">
                                                    Home
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#fitur" className="mb-3 block text-base text-gray-500 hover:text-primary">
                                                    Features
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#about" className="mb-3 block text-base text-gray-500 hover:text-primary">
                                                    About
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#pricing" className="mb-3 block text-base text-gray-500 hover:text-primary">
                                                    Pricing
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#team" className="mb-3 block text-base text-gray-500 hover:text-primary">
                                                    Team
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#edukasi" className="mb-3 block text-base text-gray-500 hover:text-primary">
                                                    Edukasi
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mb-10 w-1/3 px-4">
                                        <h4 className="mb-9 text-lg font-semibold text-white">Fitur-fitur</h4>
                                        <ul>
                                            <li>
                                                <a href="#" className="mb-3 block text-base text-gray-500 hover:text-primary">
                                                    Hitung HPP
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="mb-3 block text-base text-gray-500 hover:text-primary">
                                                    Laporan Keuangan
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="mb-3 block text-base text-gray-500 hover:text-primary">
                                                    Pencatatan
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mb-10 w-1/3 px-4">
                                        <h4 className="mb-9 text-lg font-semibold text-white">Resources</h4>
                                        <ul>
                                            <li>
                                                <a
                                                    href="https://unsplash.com/id/foto/dua-wanita-di-dekat-meja-GFrBMipOd_E?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                                                    className="mb-3 block text-base text-gray-500 hover:text-primary"
                                                >
                                                    Photo by Blake Wisz
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-[#8890A4]/40 py-8 lg:mt-[60px]">
                        <div className="container mx-auto px-4">
                            <div className="-mx-4 flex flex-wrap">
                                <div className="w-full px-4 md:w-2/3 lg:w-1/2">
                                    <div className="my-1">
                                        <div className="-mx-3 flex items-center justify-center md:justify-start">
                                            <a href="javascript:void(0)" className="px-3 text-base text-gray-500 hover:text-white hover:underline">
                                                Privacy policy
                                            </a>
                                            <a href="javascript:void(0)" className="px-3 text-base text-gray-500 hover:text-white hover:underline">
                                                Legal notice
                                            </a>
                                            <a href="javascript:void(0)" className="px-3 text-base text-gray-500 hover:text-white hover:underline">
                                                Terms of service
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full px-4 md:w-1/3 lg:w-1/2">
                                    <div className="my-1 flex justify-center md:justify-end">
                                        <p className="text-base text-gray-500">© {new Date().getFullYear()} EMKM. Semua hak cipta dilindungi.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="absolute top-0 left-0 z-[-1]">
                            <img src="assets/images/footer/shape-1.svg" alt="" />
                        </span>

                        <span className="absolute right-0 bottom-0 z-[-1]">
                            <img src="assets/images/footer/shape-3.svg" alt="" />
                        </span>

                        <span className="absolute top-0 right-0 z-[-1]">
                            <svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1.8667 33.1956C2.89765 33.1956 3.7334 34.0318 3.7334 35.0633C3.7334 36.0947 2.89765 36.9309 1.8667 36.9309C0.835744 36.9309 4.50645e-08 36.0947 0 35.0633C-4.50645e-08 34.0318 0.835744 33.1956 1.8667 33.1956Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M18.2939 33.1956C19.3249 33.1956 20.1606 34.0318 20.1606 35.0633C20.1606 36.0947 19.3249 36.9309 18.2939 36.9309C17.263 36.9309 16.4272 36.0947 16.4272 35.0633C16.4272 34.0318 17.263 33.1956 18.2939 33.1956Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M34.7209 33.195C35.7519 33.195 36.5876 34.0311 36.5876 35.0626C36.5876 36.0941 35.7519 36.9303 34.7209 36.9303C33.69 36.9303 32.8542 36.0941 32.8542 35.0626C32.8542 34.0311 33.69 33.195 34.7209 33.195Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M50.9341 33.195C51.965 33.195 52.8008 34.0311 52.8008 35.0626C52.8008 36.0941 51.965 36.9303 50.9341 36.9303C49.9031 36.9303 49.0674 36.0941 49.0674 35.0626C49.0674 34.0311 49.9031 33.195 50.9341 33.195Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M1.8667 16.7605C2.89765 16.7605 3.7334 17.5966 3.7334 18.6281C3.7334 19.6596 2.89765 20.4957 1.8667 20.4957C0.835744 20.4957 4.50645e-08 19.6596 0 18.6281C-4.50645e-08 17.5966 0.835744 16.7605 1.8667 16.7605Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M18.2939 16.7605C19.3249 16.7605 20.1606 17.5966 20.1606 18.6281C20.1606 19.6596 19.3249 20.4957 18.2939 20.4957C17.263 20.4957 16.4272 19.6596 16.4272 18.6281C16.4272 17.5966 17.263 16.7605 18.2939 16.7605Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M34.7209 16.7605C35.7519 16.7605 36.5876 17.5966 36.5876 18.6281C36.5876 19.6596 35.7519 20.4957 34.7209 20.4957C33.69 20.4957 32.8542 19.6596 32.8542 18.6281C32.8542 17.5966 33.69 16.7605 34.7209 16.7605Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M50.9341 16.7605C51.965 16.7605 52.8008 17.5966 52.8008 18.6281C52.8008 19.6596 51.965 20.4957 50.9341 20.4957C49.9031 20.4957 49.0674 19.6596 49.0674 18.6281C49.0674 17.5966 49.9031 16.7605 50.9341 16.7605Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M1.8667 0.324951C2.89765 0.324951 3.7334 1.16115 3.7334 2.19261C3.7334 3.22408 2.89765 4.06024 1.8667 4.06024C0.835744 4.06024 4.50645e-08 3.22408 0 2.19261C-4.50645e-08 1.16115 0.835744 0.324951 1.8667 0.324951Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M18.2939 0.324951C19.3249 0.324951 20.1606 1.16115 20.1606 2.19261C20.1606 3.22408 19.3249 4.06024 18.2939 4.06024C17.263 4.06024 16.4272 3.22408 16.4272 2.19261C16.4272 1.16115 17.263 0.324951 18.2939 0.324951Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M34.7209 0.325302C35.7519 0.325302 36.5876 1.16147 36.5876 2.19293C36.5876 3.2244 35.7519 4.06056 34.7209 4.06056C33.69 4.06056 32.8542 3.2244 32.8542 2.19293C32.8542 1.16147 33.69 0.325302 34.7209 0.325302Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M50.9341 0.325302C51.965 0.325302 52.8008 1.16147 52.8008 2.19293C52.8008 3.2244 51.965 4.06056 50.9341 4.06056C49.9031 4.06056 49.0674 3.2244 49.0674 2.19293C49.0674 1.16147 49.9031 0.325302 50.9341 0.325302Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M66.9037 33.1956C67.9346 33.1956 68.7704 34.0318 68.7704 35.0633C68.7704 36.0947 67.9346 36.9309 66.9037 36.9309C65.8727 36.9309 65.037 36.0947 65.037 35.0633C65.037 34.0318 65.8727 33.1956 66.9037 33.1956Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M83.3307 33.1956C84.3616 33.1956 85.1974 34.0318 85.1974 35.0633C85.1974 36.0947 84.3616 36.9309 83.3307 36.9309C82.2997 36.9309 81.464 36.0947 81.464 35.0633C81.464 34.0318 82.2997 33.1956 83.3307 33.1956Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M99.7576 33.1956C100.789 33.1956 101.624 34.0318 101.624 35.0633C101.624 36.0947 100.789 36.9309 99.7576 36.9309C98.7266 36.9309 97.8909 36.0947 97.8909 35.0633C97.8909 34.0318 98.7266 33.1956 99.7576 33.1956Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M66.9037 16.7605C67.9346 16.7605 68.7704 17.5966 68.7704 18.6281C68.7704 19.6596 67.9346 20.4957 66.9037 20.4957C65.8727 20.4957 65.037 19.6596 65.037 18.6281C65.037 17.5966 65.8727 16.7605 66.9037 16.7605Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M83.3307 16.7605C84.3616 16.7605 85.1974 17.5966 85.1974 18.6281C85.1974 19.6596 84.3616 20.4957 83.3307 20.4957C82.2997 20.4957 81.464 19.6596 81.464 18.6281C81.464 17.5966 82.2997 16.7605 83.3307 16.7605Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M99.7576 16.7605C100.789 16.7605 101.624 17.5966 101.624 18.6281C101.624 19.6596 100.789 20.4957 99.7576 20.4957C98.7266 20.4957 97.8909 19.6596 97.8909 18.6281C97.8909 17.5966 98.7266 16.7605 99.7576 16.7605Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M66.9037 0.324966C67.9346 0.324966 68.7704 1.16115 68.7704 2.19261C68.7704 3.22408 67.9346 4.06024 66.9037 4.06024C65.8727 4.06024 65.037 3.22408 65.037 2.19261C65.037 1.16115 65.8727 0.324966 66.9037 0.324966Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M83.3307 0.324951C84.3616 0.324951 85.1974 1.16115 85.1974 2.19261C85.1974 3.22408 84.3616 4.06024 83.3307 4.06024C82.2997 4.06024 81.464 3.22408 81.464 2.19261C81.464 1.16115 82.2997 0.324951 83.3307 0.324951Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M99.7576 0.324951C100.789 0.324951 101.624 1.16115 101.624 2.19261C101.624 3.22408 100.789 4.06024 99.7576 4.06024C98.7266 4.06024 97.8909 3.22408 97.8909 2.19261C97.8909 1.16115 98.7266 0.324951 99.7576 0.324951Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M1.8667 82.2029C2.89765 82.2029 3.7334 83.039 3.7334 84.0705C3.7334 85.102 2.89765 85.9382 1.8667 85.9382C0.835744 85.9382 4.50645e-08 85.102 0 84.0705C-4.50645e-08 83.039 0.835744 82.2029 1.8667 82.2029Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M18.2939 82.2029C19.3249 82.2029 20.1606 83.039 20.1606 84.0705C20.1606 85.102 19.3249 85.9382 18.2939 85.9382C17.263 85.9382 16.4272 85.102 16.4272 84.0705C16.4272 83.039 17.263 82.2029 18.2939 82.2029Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M34.7209 82.2026C35.7519 82.2026 36.5876 83.0387 36.5876 84.0702C36.5876 85.1017 35.7519 85.9378 34.7209 85.9378C33.69 85.9378 32.8542 85.1017 32.8542 84.0702C32.8542 83.0387 33.69 82.2026 34.7209 82.2026Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M50.9341 82.2026C51.965 82.2026 52.8008 83.0387 52.8008 84.0702C52.8008 85.1017 51.965 85.9378 50.9341 85.9378C49.9031 85.9378 49.0674 85.1017 49.0674 84.0702C49.0674 83.0387 49.9031 82.2026 50.9341 82.2026Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M1.8667 65.7677C2.89765 65.7677 3.7334 66.6039 3.7334 67.6353C3.7334 68.6668 2.89765 69.503 1.8667 69.503C0.835744 69.503 4.50645e-08 68.6668 0 67.6353C-4.50645e-08 66.6039 0.835744 65.7677 1.8667 65.7677Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M18.2939 65.7677C19.3249 65.7677 20.1606 66.6039 20.1606 67.6353C20.1606 68.6668 19.3249 69.503 18.2939 69.503C17.263 69.503 16.4272 68.6668 16.4272 67.6353C16.4272 66.6039 17.263 65.7677 18.2939 65.7677Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M34.7209 65.7674C35.7519 65.7674 36.5876 66.6036 36.5876 67.635C36.5876 68.6665 35.7519 69.5027 34.7209 69.5027C33.69 69.5027 32.8542 68.6665 32.8542 67.635C32.8542 66.6036 33.69 65.7674 34.7209 65.7674Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M50.9341 65.7674C51.965 65.7674 52.8008 66.6036 52.8008 67.635C52.8008 68.6665 51.965 69.5027 50.9341 69.5027C49.9031 69.5027 49.0674 68.6665 49.0674 67.635C49.0674 66.6036 49.9031 65.7674 50.9341 65.7674Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M1.8667 98.2644C2.89765 98.2644 3.7334 99.1005 3.7334 100.132C3.7334 101.163 2.89765 102 1.8667 102C0.835744 102 4.50645e-08 101.163 0 100.132C-4.50645e-08 99.1005 0.835744 98.2644 1.8667 98.2644Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M1.8667 49.3322C2.89765 49.3322 3.7334 50.1684 3.7334 51.1998C3.7334 52.2313 2.89765 53.0675 1.8667 53.0675C0.835744 53.0675 4.50645e-08 52.2313 0 51.1998C-4.50645e-08 50.1684 0.835744 49.3322 1.8667 49.3322Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M18.2939 98.2644C19.3249 98.2644 20.1606 99.1005 20.1606 100.132C20.1606 101.163 19.3249 102 18.2939 102C17.263 102 16.4272 101.163 16.4272 100.132C16.4272 99.1005 17.263 98.2644 18.2939 98.2644Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M18.2939 49.3322C19.3249 49.3322 20.1606 50.1684 20.1606 51.1998C20.1606 52.2313 19.3249 53.0675 18.2939 53.0675C17.263 53.0675 16.4272 52.2313 16.4272 51.1998C16.4272 50.1684 17.263 49.3322 18.2939 49.3322Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M34.7209 98.2647C35.7519 98.2647 36.5876 99.1008 36.5876 100.132C36.5876 101.164 35.7519 102 34.7209 102C33.69 102 32.8542 101.164 32.8542 100.132C32.8542 99.1008 33.69 98.2647 34.7209 98.2647Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M50.9341 98.2647C51.965 98.2647 52.8008 99.1008 52.8008 100.132C52.8008 101.164 51.965 102 50.9341 102C49.9031 102 49.0674 101.164 49.0674 100.132C49.0674 99.1008 49.9031 98.2647 50.9341 98.2647Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M34.7209 49.3326C35.7519 49.3326 36.5876 50.1687 36.5876 51.2002C36.5876 52.2317 35.7519 53.0678 34.7209 53.0678C33.69 53.0678 32.8542 52.2317 32.8542 51.2002C32.8542 50.1687 33.69 49.3326 34.7209 49.3326Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M50.9341 49.3326C51.965 49.3326 52.8008 50.1687 52.8008 51.2002C52.8008 52.2317 51.965 53.0678 50.9341 53.0678C49.9031 53.0678 49.0674 52.2317 49.0674 51.2002C49.0674 50.1687 49.9031 49.3326 50.9341 49.3326Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M66.9037 82.2029C67.9346 82.2029 68.7704 83.0391 68.7704 84.0705C68.7704 85.102 67.9346 85.9382 66.9037 85.9382C65.8727 85.9382 65.037 85.102 65.037 84.0705C65.037 83.0391 65.8727 82.2029 66.9037 82.2029Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M83.3307 82.2029C84.3616 82.2029 85.1974 83.0391 85.1974 84.0705C85.1974 85.102 84.3616 85.9382 83.3307 85.9382C82.2997 85.9382 81.464 85.102 81.464 84.0705C81.464 83.0391 82.2997 82.2029 83.3307 82.2029Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M99.7576 82.2029C100.789 82.2029 101.624 83.039 101.624 84.0705C101.624 85.102 100.789 85.9382 99.7576 85.9382C98.7266 85.9382 97.8909 85.102 97.8909 84.0705C97.8909 83.039 98.7266 82.2029 99.7576 82.2029Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M66.9037 65.7674C67.9346 65.7674 68.7704 66.6036 68.7704 67.635C68.7704 68.6665 67.9346 69.5027 66.9037 69.5027C65.8727 69.5027 65.037 68.6665 65.037 67.635C65.037 66.6036 65.8727 65.7674 66.9037 65.7674Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M83.3307 65.7677C84.3616 65.7677 85.1974 66.6039 85.1974 67.6353C85.1974 68.6668 84.3616 69.503 83.3307 69.503C82.2997 69.503 81.464 68.6668 81.464 67.6353C81.464 66.6039 82.2997 65.7677 83.3307 65.7677Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M99.7576 65.7677C100.789 65.7677 101.624 66.6039 101.624 67.6353C101.624 68.6668 100.789 69.503 99.7576 69.503C98.7266 69.503 97.8909 68.6668 97.8909 67.6353C97.8909 66.6039 98.7266 65.7677 99.7576 65.7677Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M66.9037 98.2644C67.9346 98.2644 68.7704 99.1005 68.7704 100.132C68.7704 101.163 67.9346 102 66.9037 102C65.8727 102 65.037 101.163 65.037 100.132C65.037 99.1005 65.8727 98.2644 66.9037 98.2644Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M66.9037 49.3322C67.9346 49.3322 68.7704 50.1684 68.7704 51.1998C68.7704 52.2313 67.9346 53.0675 66.9037 53.0675C65.8727 53.0675 65.037 52.2313 65.037 51.1998C65.037 50.1684 65.8727 49.3322 66.9037 49.3322Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M83.3307 98.2644C84.3616 98.2644 85.1974 99.1005 85.1974 100.132C85.1974 101.163 84.3616 102 83.3307 102C82.2997 102 81.464 101.163 81.464 100.132C81.464 99.1005 82.2997 98.2644 83.3307 98.2644Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M83.3307 49.3322C84.3616 49.3322 85.1974 50.1684 85.1974 51.1998C85.1974 52.2313 84.3616 53.0675 83.3307 53.0675C82.2997 53.0675 81.464 52.2313 81.464 51.1998C81.464 50.1684 82.2997 49.3322 83.3307 49.3322Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M99.7576 98.2644C100.789 98.2644 101.624 99.1005 101.624 100.132C101.624 101.163 100.789 102 99.7576 102C98.7266 102 97.8909 101.163 97.8909 100.132C97.8909 99.1005 98.7266 98.2644 99.7576 98.2644Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                                <path
                                    d="M99.7576 49.3322C100.789 49.3322 101.624 50.1684 101.624 51.1998C101.624 52.2313 100.789 53.0675 99.7576 53.0675C98.7266 53.0675 97.8909 52.2313 97.8909 51.1998C97.8909 50.1684 98.7266 49.3322 99.7576 49.3322Z"
                                    fill="white"
                                    fill-opacity="0.08"
                                ></path>
                            </svg>
                        </span>
                    </div>
                </footer>
                {/* End of Footer */}

                <a
                    href="javascript:void(0)"
                    className="back-to-top hover:bg-dark fixed right-8 bottom-8 left-auto z-999 hidden h-10 w-10 items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out"
                >
                    <span className="mt-[6px] h-3 w-3 rotate-45 border-t border-l border-white"></span>
                </a>
            </div>
        </>
    );
}
