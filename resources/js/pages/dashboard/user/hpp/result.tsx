import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface HasilData {
    total: number;
    hppSatuan: number;
    hargaJual: number;
    ringkasan: Record<string, number>;
    jumlahProduksi: number;
}

export default function HppHasil() {
    const [hasil, setHasil] = useState<HasilData | null>(null);

    useEffect(() => {
        const data = localStorage.getItem('hpp_result');
        if (data) {
            setHasil(JSON.parse(data));
        }
    }, []);

    return (
        <AppLayout>
            <Head title="Hasil Perhitungan HPP" />
            <div className="mx-auto max-w-4xl p-6">
                <div className="rounded-lg bg-white p-8 shadow-xl">
                    <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Hasil Perhitungan HPP & Harga Jual</h1>

                    {!hasil ? (
                        <p className="text-center font-semibold text-red-600">Data tidak ditemukan. Silakan isi formulir terlebih dahulu.</p>
                    ) : (
                        <div className="space-y-4 text-lg text-gray-700">
                            <p>
                                <strong>Total HPP:</strong> Rp {hasil.total.toLocaleString('id-ID')}
                            </p>
                            <p>
                                <strong>HPP per Unit:</strong> Rp {hasil.hppSatuan.toLocaleString('id-ID')}
                            </p>
                            <p>
                                <strong>Harga Jual per Unit:</strong> Rp {hasil.hargaJual.toLocaleString('id-ID')}
                            </p>
                            <p className="font-bold text-green-700">
                                <strong>Perkiraan Profit:</strong> Rp{' '}
                                {(hasil.hppSatuan * hasil.jumlahProduksi * (hasil.hargaJual / hasil.hppSatuan - 1)).toLocaleString('id-ID')}
                            </p>

                            <hr className="my-4" />

                            <h2 className="mb-2 text-xl font-semibold text-gray-800">Ringkasan Komponen:</h2>
                            <ul className="list-inside list-disc space-y-1">
                                {Object.entries(hasil.ringkasan).map(([komp, nilai]) => (
                                    <li key={komp}>
                                        {komp}: Rp {nilai.toLocaleString('id-ID')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-8 flex justify-center">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href={route('hpp.index')}>Kembali ke form HPP</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
