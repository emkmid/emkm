import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect, useState } from 'react';

type Item = {
    name: string;
    qty: number;
    unit: string;
    price: number;
};

type Komponen = 'Bahan Baku' | 'Tenaga Kerja Langsung' | 'Overhead Pabrik';

const satuanUmum = ['pcs', 'kg', 'liter', 'meter', 'bungkus', 'unit'];

const HPPForm: React.FC = () => {
    const [jumlahProduksi, setJumlahProduksi] = useState(1);
    const [kategori, setKategori] = useState('');
    const [markup, setMarkup] = useState(30);
    const [rekomendasi, setRekomendasi] = useState('');
    const [data, setData] = useState<Record<Komponen, Item[]>>({
        'Bahan Baku': [],
        'Tenaga Kerja Langsung': [],
        'Overhead Pabrik': [],
    });

    const kategoriMap: Record<string, { rekom: string; markup: number }> = {
        makanan_berat: { rekom: '100% – 200%', markup: 150 },
        camilan: { rekom: '150% – 300%', markup: 200 },
        minuman: { rekom: '200% – 400%', markup: 250 },
        frozen: { rekom: '30% – 100%', markup: 50 },
        roti: { rekom: '100% – 250%', markup: 150 },
        catering: { rekom: '50% – 150%', markup: 100 },
    };

    useEffect(() => {
        if (kategori && kategoriMap[kategori]) {
            setRekomendasi(kategoriMap[kategori].rekom);
            setMarkup(kategoriMap[kategori].markup);
        }
    }, [kategori]);

    const tambahItem = (komponen: Komponen) => {
        setData((prev) => ({
            ...prev,
            [komponen]: [...prev[komponen], { name: '', qty: 1, unit: '', price: 0 }],
        }));
    };

    const hapusItem = (komponen: Komponen, index: number) => {
        setData((prev) => ({
            ...prev,
            [komponen]: prev[komponen].filter((_, i) => i !== index),
        }));
    };

    const updateItem = (komponen: Komponen, index: number, field: keyof Item, value: any) => {
        setData((prev) => {
            const updated = [...prev[komponen]];
            updated[index] = { ...updated[index], [field]: field === 'price' || field === 'qty' ? Number(value) : value };
            return { ...prev, [komponen]: updated };
        });
    };

    const formatRupiah = (value: number): string => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    const hitungHPP = () => {
        if (jumlahProduksi <= 0 || jumlahProduksi > 500) {
            alert('Jumlah produksi harus antara 1 - 500');
            return;
        }

        let total = 0;
        Object.values(data).forEach((items) => {
            items.forEach((item) => {
                total += item.qty * item.price;
            });
        });

        const hpp = total / jumlahProduksi;
        const hargaJual = hpp * (1 + markup / 100);

        alert(`Total Biaya: ${formatRupiah(total)}\nHPP Satuan: ${formatRupiah(hpp)}\nHarga Jual: ${formatRupiah(hargaJual)}`);
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="text-center text-2xl font-bold">Form Perhitungan HPP</h1>

            <div>
                <Label>Jumlah Produksi (maks 500)</Label>
                <Input type="number" min={1} max={500} value={jumlahProduksi} onChange={(e) => setJumlahProduksi(Number(e.target.value))} />
            </div>

            <div>
                <Label>Kategori Produk</Label>
                <Select onValueChange={(v) => setKategori(v)}>
                    <SelectTrigger>
                        <SelectValue placeholder="-- Pilih Kategori --" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(kategoriMap).map((key) => (
                            <SelectItem key={key} value={key}>
                                {key.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {rekomendasi && <p className="mt-1 text-sm text-gray-500">Rekomendasi: {rekomendasi}</p>}
            </div>

            <div>
                <Label>Markup (%)</Label>
                <Input type="number" min={0} value={markup} onChange={(e) => setMarkup(Number(e.target.value))} />
            </div>

            {(['Bahan Baku', 'Tenaga Kerja Langsung', 'Overhead Pabrik'] as Komponen[]).map((komponen) => (
                <div key={komponen} className="border-t pt-4">
                    <h2 className="mb-2 font-semibold">{komponen}</h2>
                    {data[komponen].map((item, i) => (
                        <div key={i} className="mb-2 flex flex-wrap items-end gap-2">
                            <Input placeholder="Nama" value={item.name} onChange={(e) => updateItem(komponen, i, 'name', e.target.value)} />
                            <Input
                                type="number"
                                placeholder="Qty"
                                className="w-24"
                                value={item.qty}
                                onChange={(e) => updateItem(komponen, i, 'qty', e.target.value)}
                            />
                            {komponen === 'Bahan Baku' ? (
                                <select
                                    className="rounded border px-2 py-1"
                                    value={item.unit}
                                    onChange={(e) => updateItem(komponen, i, 'unit', e.target.value)}
                                >
                                    <option value="">Pilih Satuan</option>
                                    {satuanUmum.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="text-sm text-gray-500">{komponen === 'Tenaga Kerja Langsung' ? '/ orang' : '/ buah'}</span>
                            )}
                            <Input
                                type="number"
                                placeholder="Harga Satuan"
                                className="w-36"
                                value={item.price}
                                onChange={(e) => updateItem(komponen, i, 'price', e.target.value)}
                            />
                            <Button variant="destructive" onClick={() => hapusItem(komponen, i)}>
                                Hapus
                            </Button>
                        </div>
                    ))}
                    <Button variant="secondary" size="sm" onClick={() => tambahItem(komponen)}>
                        + Tambah {komponen}
                    </Button>
                </div>
            ))}

            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={hitungHPP}>
                Hitung HPP & Harga Jual
            </Button>
        </div>
    );
};

export default HPPForm;
