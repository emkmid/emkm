import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface InputRupiahProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
}

export default function InputRupiah({ value, onChange, placeholder, className }: InputRupiahProps) {
    const [display, setDisplay] = useState('Rp. 0');

    useEffect(() => {
        setDisplay(formatRupiah(value));
    }, [value]);

    function formatRupiah(value: number | string): string {
        const angka = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) || 0 : value;
        return 'Rp. ' + angka.toLocaleString('id-ID');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, ''); // hapus semua non-digit
        const numeric = parseInt(raw || '0');
        setDisplay(formatRupiah(raw));
        onChange(numeric);
    };

    const handleBlur = () => {
        if (display === '') {
            setDisplay('Rp. 0');
        }
    };

    return (
        <Input type="text" value={display} onChange={handleChange} onBlur={handleBlur} placeholder={placeholder || 'Rp. 0'} className={className} />
    );
}
