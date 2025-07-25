// ResultDialog.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HppResultData } from './types';
import { formatRupiah } from './utils';

interface Props {
    open: boolean;
    data: HppResultData | null;
    onClose: () => void;
    onSave: (data: HppResultData) => void;
}

export default function ResultDialog({ open, data, onClose, onSave }: Props) {
    if (!data) return null;

    const { total, hppSatuan, hargaJual, ringkasan, jumlahProduksi } = data;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hasil Perhitungan HPP</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 text-sm text-gray-700 dark:text-white/90">
                    <p>
                        <strong>Jumlah Produksi:</strong> {jumlahProduksi}
                    </p>
                    {Object.entries(ringkasan).map(([key, value]) => (
                        <p key={key}>
                            <strong>{key}:</strong> {formatRupiah(value)}
                        </p>
                    ))}
                    <hr />
                    <p>
                        <strong>Total Biaya Produksi:</strong> {formatRupiah(total)}
                    </p>
                    <p>
                        <strong>HPP per Unit:</strong> {formatRupiah(hppSatuan)}
                    </p>
                    <p>
                        <strong>Harga Jual Disarankan:</strong> {formatRupiah(hargaJual)}
                    </p>
                </div>

                <DialogFooter className="mt-4 flex justify-between">
                    <Button variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                    <Button onClick={() => onSave(data)}>Simpan HPP</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
