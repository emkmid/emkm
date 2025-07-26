import InputRupiah from '@/components/input-rupiah';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const komponen = ['Bahan Baku', 'Tenaga Kerja Langsung', 'Overhead Pabrik'];
const satuan = ['pcs', 'kg', 'liter', 'meter', 'bungkus', 'unit'];
const MAX_ITEM = 30;

interface Item {
    name: string;
    qty: number;
    unit: string;
    price: number;
}

interface KomponenForm {
    [key: string]: Item[];
}

export default function HppForm() {
    const [jumlahProduksi, setJumlahProduksi] = useState<string>('1');
    const [kategori, setKategori] = useState('');
    const [markup, setMarkup] = useState(30);
    const [markupInfo, setMarkupInfo] = useState('');
    const [formData, setFormData] = useState<KomponenForm>({});

    useEffect(() => {
        const initialForm: KomponenForm = {};
        komponen.forEach((k) => {
            initialForm[k] = k === 'Bahan Baku' ? [{ name: '', qty: 0, unit: 'pcs', price: 0 }] : [];
        });
        setFormData(initialForm);
    }, []);

    useEffect(() => {
        const rekomendasi: Record<string, { info: string; value: number }> = {
            makanan_berat: { info: 'Rekomendasi: 100% – 200%', value: 150 },
            camilan: { info: 'Rekomendasi: 150% – 300%', value: 200 },
            minuman: { info: 'Rekomendasi: 200% – 400%', value: 250 },
            frozen: { info: 'Rekomendasi: 30% – 100%', value: 50 },
            roti: { info: 'Rekomendasi: 100% – 250%', value: 150 },
            catering: { info: 'Rekomendasi: 50% – 150%', value: 100 },
        };
        const data = rekomendasi[kategori];
        if (data) {
            setMarkupInfo(data.info);
            setMarkup(data.value);
        }
    }, [kategori]);

    const handleItemChange = (komp: string, index: number, field: keyof Item, value: string | number) => {
        const updated = [...formData[komp]];
        updated[index] = {
            ...updated[index],
            [field]: field === 'price' || field === 'qty' ? Number(value) : value,
        };
        setFormData({ ...formData, [komp]: updated });
    };

    const addItem = (komp: string) => {
        if (formData[komp].length >= MAX_ITEM) return alert(`Maksimal ${MAX_ITEM} item untuk ${komp}`);
        const unit = komp === 'Bahan Baku' ? 'pcs' : komp === 'Tenaga Kerja Langsung' ? 'orang' : 'buah';
        setFormData({
            ...formData,
            [komp]: [...formData[komp], { name: '', qty: 0, unit, price: 0 }],
        });
    };

    const removeItem = (komp: string, index: number) => {
        const updated = [...formData[komp]];
        updated.splice(index, 1);
        setFormData({ ...formData, [komp]: updated });
    };

    const handleHitung = () => {
        if (!jumlahProduksi || Number(jumlahProduksi) <= 0) return alert('Jumlah produksi harus diisi dan lebih dari 0');
        if (!kategori) return alert('Kategori harus dipilih');

        for (const komp of komponen) {
            for (let i = 0; i < formData[komp].length; i++) {
                const item = formData[komp][i];
                if (!item.name.trim()) return alert(`Nama item pada ${komp} ke-${i + 1} harus diisi`);
                if (!item.qty || item.qty <= 0) return alert(`Qty pada ${komp} ke-${i + 1} harus lebih dari 0`);
                if (!item.price || item.price <= 0) return alert(`Harga pada ${komp} ke-${i + 1} harus lebih dari 0`);
                if (komp === 'Bahan Baku' && !item.unit) return alert(`Satuan pada ${komp} ke-${i + 1} harus dipilih`);
            }
        }

        const produksi = Number(jumlahProduksi);
        if (isNaN(produksi) || produksi <= 0 || produksi > 500) return alert('Jumlah produksi tidak valid (maks 500)');
        if (!formData['Bahan Baku'] || formData['Bahan Baku'].length === 0) return alert('Mohon isi setidaknya satu bahan baku');

        let total = 0;
        const ringkasan: Record<string, number> = {};
        for (const komp of komponen) {
            const subtotal = formData[komp].reduce((sum, item) => sum + item.qty * item.price, 0);
            ringkasan[komp] = subtotal;
            total += subtotal;
        }

        const hppSatuan = total / produksi;
        const hargaJual = hppSatuan * (1 + markup / 100);

        localStorage.setItem('hpp_result', JSON.stringify({ total, hppSatuan, hargaJual, ringkasan, jumlahProduksi: produksi }));

        router.visit('/dashboard/hpp/hasil');
    };

    const renderInputProduksi = () => (
        <div className="mb-6">
            <Label htmlFor="jumlahProduksi">Jumlah Unit Produksi (maksimal 500):</Label>
            <Input
                id="jumlahProduksi"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={jumlahProduksi}
                onChange={(e) => setJumlahProduksi(e.target.value.replace(/\D/g, ''))}
            />
        </div>
    );

    const renderKomponenSection = () =>
        komponen.map((komp) => (
            <div className="mb-6" key={komp}>
                <h2 className="form-label">{komp}</h2>
                <div className="mb-2 space-y-2">
                    {formData[komp]?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <Input
                                placeholder="Nama Item"
                                value={item.name}
                                onChange={(e) => handleItemChange(komp, idx, 'name', e.target.value)}
                                className="w-48"
                            />
                            <Input
                                type="number"
                                placeholder="Qty"
                                min={0}
                                value={item.qty === 0 ? '' : item.qty}
                                onChange={(e) => handleItemChange(komp, idx, 'qty', e.target.value)}
                                className="w-24"
                            />
                            {komp === 'Bahan Baku' ? (
                                <Select value={item.unit} onValueChange={(val) => handleItemChange(komp, idx, 'unit', val)}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue placeholder="Satuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {satuan.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <span className="text-sm text-gray-500">/ {komp === 'Tenaga Kerja Langsung' ? 'orang' : 'buah'}</span>
                            )}
                            <InputRupiah value={item.price} onChange={(val) => handleItemChange(komp, idx, 'price', val)} className="w-36" />
                            <Button type="button" onClick={() => removeItem(komp, idx)} variant="destructive">
                                Hapus
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" onClick={() => addItem(komp)}>
                    + Tambah Item
                </Button>
            </div>
        ));

    const renderKategoriSection = () => (
        <div className="mb-6">
            <Label>Kategori Produk:</Label>
            <Select value={kategori} onValueChange={setKategori}>
                <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="makanan_berat">Makanan Berat</SelectItem>
                    <SelectItem value="camilan">Camilan / Snack</SelectItem>
                    <SelectItem value="minuman">Minuman</SelectItem>
                    <SelectItem value="frozen">Frozen Food</SelectItem>
                    <SelectItem value="roti">Roti / Kue</SelectItem>
                    <SelectItem value="catering">Catering / Pesanan Khusus</SelectItem>
                </SelectContent>
            </Select>
            {markupInfo && <p className="mt-1 text-sm text-gray-500">{markupInfo}</p>}
        </div>
    );

    const renderMarkupSection = () => (
        <div className="mb-6">
            <Label>Markup (%):</Label>
            <Input type="number" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} />
        </div>
    );

    return (
        <AppLayout>
            <Head title="HPP" />
            <div className="mx-auto max-w-5xl p-6">
                <div className="card">
                    <h1 className="mb-6 text-center text-2xl font-bold">Form Perhitungan HPP Produk</h1>
                    {renderInputProduksi()}
                    {renderKomponenSection()}
                    {renderKategoriSection()}
                    {renderMarkupSection()}
                    <Button onClick={handleHitung} className="bg-blue-500 text-white hover:bg-blue-600">
                        Hitung HPP & Harga Jual
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
