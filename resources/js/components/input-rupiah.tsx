import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

// Definisikan props untuk komponen, termasuk `id`
interface InputRupiahProps {
    id?: string;
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
}

export default function InputRupiah({ id, value, onChange, placeholder, className }: InputRupiahProps) {
    // State untuk menyimpan nilai yang akan ditampilkan (dalam format string "Rp 1.000.000")
    const [displayValue, setDisplayValue] = useState('Rp 0');

    // PERBAIKAN: Fungsi format yang lebih sederhana dan andal
    const toRupiah = (num: number) => {
        // Gunakan toLocaleString untuk pemformatan yang benar sesuai standar Indonesia
        return 'Rp ' + num.toLocaleString('id-ID');
    };

    // useEffect untuk memperbarui tampilan jika nilai dari parent (form) berubah
    useEffect(() => {
        // Hanya update jika nilai angka sebenarnya berbeda, untuk menghindari loop tak terbatas
        const currentNumericValue = parseInt(displayValue.replace(/[^0-9]/g, ''), 10) || 0;
        if (value !== currentNumericValue) {
            setDisplayValue(toRupiah(value));
        }
    }, [value]); // Dijalankan setiap kali `value` dari parent berubah

    // Fungsi untuk menangani perubahan pada input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 1. Ambil hanya digit dari input pengguna
        const digits = e.target.value.replace(/[^0-9]/g, '');

        // 2. Ubah menjadi angka untuk menghilangkan angka nol di depan secara otomatis
        const numericValue = parseInt(digits, 10) || 0;

        // 3. Perbarui state di parent component (form) dengan nilai angka yang bersih
        onChange(numericValue);

        // 4. Perbarui tampilan di input ini dengan nilai yang sudah diformat dengan benar
        setDisplayValue(toRupiah(numericValue));
    };

    return (
        <Input
            id={id}
            type="text"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder || 'Rp 0'}
            className={className}
        />
    );
}
