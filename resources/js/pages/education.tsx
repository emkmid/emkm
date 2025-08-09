import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function Education() {
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        const handleScroll = () => {
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
            <Head title="Education" />
            <div className="min-h-screen bg-background text-foreground">
                {/* Navbar */}
                <Navbar auth={auth} className="sticky top-0 z-40 bg-[#23627C] text-white">
                    <Link href="/">Home</Link>
                    <Link href="/courses">Courses</Link>
                    <Link href="/teachers">Teachers</Link>
                    <Link href="/contact">Kontak</Link>
                </Navbar>

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#D3EDFF] py-20 md:py-28">
                    <div className="container mx-auto max-w-screen-xl px-4 text-center">
                        <h2 className="reveal mb-4 text-4xl font-bold text-[#23627C] opacity-0 transition-all duration-700 md:text-5xl">
                            Belajar Digitalisasi UMKM
                        </h2>
                        <p className="reveal mx-auto mb-6 max-w-2xl text-lg text-[#23627C] opacity-0 transition-all delay-100 duration-700">
                            Raih potensi maksimal bisnis Anda melalui pembelajaran online gratis & bersertifikat
                        </p>
                        <div className="reveal flex justify-center gap-4 opacity-0 transition-all delay-200 duration-700">
                            <Button size="lg" variant="blue">
                                Mulai Belajar
                            </Button>
                            <Button size="lg" variant="outline">
                                Jelajahi Kursus
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Stat Bar */}
                <section className="border-y bg-white py-10">
                    <div className="container mx-auto grid max-w-screen-xl grid-cols-2 gap-6 px-4 text-center md:grid-cols-4">
                        {[
                            ['100+', 'Kursus UMKM Digital'],
                            ['Sertifikat', 'Diakui Nasional'],
                            ['Gratis', 'Akses Selamanya'],
                            ['Komunitas', 'Pendamping UMKM'],
                        ].map(([val, label], idx) => (
                            <div key={idx} className="reveal opacity-0 transition-all duration-700">
                                <p className="text-2xl font-extrabold text-[#23BBB7]">{val}</p>
                                <p className="text-sm text-[#23627C]">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Kursus Populer */}
                <section className="bg-[#D3EDFF] py-16">
                    <div className="container mx-auto max-w-screen-xl px-4">
                        <h2 className="reveal mb-10 text-center text-3xl font-bold text-[#23627C] opacity-0 transition-all duration-700">
                            Kursus Populer
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                            {[
                                ['Strategi Digital UMKM', 'Dina Yuliani'],
                                ['Dasar Pemasaran Online', 'Arief Hakim'],
                                ['Desain Produk Menarik', 'Nia Pratiwi'],
                                ['Pembukuan Sederhana', 'Rudi Saputra'],
                            ].map(([judul, pengajar], idx) => (
                                <Card key={idx} className="reveal translate-y-10 bg-white opacity-0 transition-all duration-300 hover:-translate-y-2">
                                    <div className="h-36 rounded-t-md bg-[#23BBB7] opacity-10" />
                                    <CardHeader>
                                        <p className="mb-1 text-sm font-semibold text-[#23BBB7]">Gratis</p>
                                        <CardTitle className="text-base text-[#23627C]">{judul}</CardTitle>
                                        <CardDescription className="text-sm text-gray-600">{pengajar}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#23627C] py-6 text-center text-[#D3EDFF]">
                    &copy; {new Date().getFullYear()} E-MKM. Seluruh hak cipta dilindungi.
                </footer>
            </div>

            {/* Reveal Animation */}
            <style>
                {`
                .reveal { opacity: 0; transform: translateY(20px); }
                .reveal.active { opacity: 1; transform: translateY(0); transition: all 0.6s ease-out; }
                `}
            </style>
        </>
    );
}
