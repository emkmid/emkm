export interface Item {
    name: string;
    qty: number;
    unit?: string;
    price: number;
}

export interface HppResultData {
    total: number;
    hppSatuan: number;
    hargaJual: number;
    ringkasan: Record<string, number>;
    jumlahProduksi: number;
}
