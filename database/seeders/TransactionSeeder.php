<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Debt;
use App\Models\Receivable;
use App\Models\ExpenseCategory;
use App\Models\IncomeCategory;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Seed realistic transaction data for analysis
     * Scenario: E-commerce & Retail Business (Toko Online)
     */
    public function run(): void
    {
        // Only seed for user ID 3 (andi aryanto)
        $user = User::find(3);
        if (!$user) {
            return;
        }

        // Get categories
        $expenseCategories = ExpenseCategory::all()->keyBy('name');
        $incomeCategories = IncomeCategory::all()->keyBy('name');

        $startDate = Carbon::now()->subMonths(3);
        $endDate = Carbon::now();

        // ============================================
        // INCOME DATA - Penjualan dan Pendapatan
        // ============================================
        $incomeData = [
            // OKTOBER - Awal bisnis
            ['date' => $startDate->copy()->setMonth(10)->setDay(5), 'category' => 'Penjualan Produk', 'amount' => 1500000, 'desc' => 'Penjualan Kaos (50 pcs @ Rp30.000)'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(8), 'category' => 'Penjualan Produk', 'amount' => 2400000, 'desc' => 'Penjualan Celana (40 pcs @ Rp60.000)'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(12), 'category' => 'Penjualan Produk', 'amount' => 3000000, 'desc' => 'Penjualan Sepatu (30 pcs @ Rp100.000)'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(15), 'category' => 'Penjualan Jasa', 'amount' => 500000, 'desc' => 'Jasa Konsultasi Mode'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(20), 'category' => 'Penjualan Produk', 'amount' => 1800000, 'desc' => 'Penjualan Aksesoris (60 pcs @ Rp30.000)'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(25), 'category' => 'Penjualan Produk', 'amount' => 2200000, 'desc' => 'Penjualan Jaket (25 pcs @ Rp88.000)'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(28), 'category' => 'Pendapatan Lain-lain', 'amount' => 300000, 'desc' => 'Komisi Affiliate'],

            // NOVEMBER - Growth
            ['date' => $startDate->copy()->setMonth(11)->setDay(2), 'category' => 'Penjualan Produk', 'amount' => 4500000, 'desc' => 'Penjualan Musiman Ramadhan Bundle (90 pcs)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(5), 'category' => 'Penjualan Produk', 'amount' => 3200000, 'desc' => 'Penjualan Kaos (80 pcs @ Rp40.000)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(10), 'category' => 'Penjualan Jasa', 'amount' => 750000, 'desc' => 'Jasa Custom Design Baju (10 pcs)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(12), 'category' => 'Penjualan Produk', 'amount' => 2800000, 'desc' => 'Penjualan Celana (35 pcs @ Rp80.000)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(15), 'category' => 'Pendapatan Sewa', 'amount' => 2000000, 'desc' => 'Sewa Ruang Toko (Rp2.000.000/bulan)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(18), 'category' => 'Penjualan Produk', 'amount' => 3500000, 'desc' => 'Penjualan Sepatu (35 pcs @ Rp100.000)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(22), 'category' => 'Penjualan Produk', 'amount' => 2100000, 'desc' => 'Penjualan Aksesoris (70 pcs @ Rp30.000)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(25), 'category' => 'Penjualan Jasa', 'amount' => 500000, 'desc' => 'Jasa Fotografi Produk'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(28), 'category' => 'Pendapatan Lain-lain', 'amount' => 400000, 'desc' => 'Bonus Affiliate Program'],

            // DESEMBER - Peak Season
            ['date' => $startDate->copy()->setMonth(12)->setDay(1), 'category' => 'Penjualan Produk', 'amount' => 6000000, 'desc' => 'Penjualan Akhir Tahun (150 pcs various)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(3), 'category' => 'Penjualan Produk', 'amount' => 5200000, 'desc' => 'Penjualan Promo Diskon 20% (200 pcs)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(7), 'category' => 'Penjualan Produk', 'amount' => 4800000, 'desc' => 'Penjualan Flash Sale (120 pcs)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(10), 'category' => 'Penjualan Jasa', 'amount' => 1000000, 'desc' => 'Jasa Custom & Design (20 pcs)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(12), 'category' => 'Penjualan Produk', 'amount' => 3900000, 'desc' => 'Penjualan Regular (130 pcs)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(15), 'category' => 'Pendapatan Sewa', 'amount' => 2000000, 'desc' => 'Sewa Ruang Toko (Rp2.000.000/bulan)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(18), 'category' => 'Penjualan Produk', 'amount' => 4500000, 'desc' => 'Penjualan Korporat (Gift Bundling)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(22), 'category' => 'Penjualan Produk', 'amount' => 3200000, 'desc' => 'Penjualan Natal Bundle (80 pcs)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(25), 'category' => 'Penjualan Produk', 'amount' => 2500000, 'desc' => 'Penjualan Hari Raya Natal'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(28), 'category' => 'Pendapatan Lain-lain', 'amount' => 600000, 'desc' => 'Bonus Performa & Komisi'],

            // JANUARI 2025
            ['date' => Carbon::now()->setMonth(1)->setDay(2), 'category' => 'Penjualan Produk', 'amount' => 3800000, 'desc' => 'Penjualan Tahun Baru (95 pcs)'],
            ['date' => Carbon::now()->setMonth(1)->setDay(5), 'category' => 'Penjualan Produk', 'amount' => 3000000, 'desc' => 'Penjualan Regular (100 pcs)'],
            ['date' => Carbon::now()->setMonth(1)->setDay(8), 'category' => 'Penjualan Jasa', 'amount' => 600000, 'desc' => 'Jasa Konsultasi & Design'],
            ['date' => Carbon::now()->setMonth(1)->setDay(12), 'category' => 'Penjualan Produk', 'amount' => 2800000, 'desc' => 'Penjualan (70 pcs)'],
            ['date' => Carbon::now()->setMonth(1)->setDay(15), 'category' => 'Pendapatan Sewa', 'amount' => 2000000, 'desc' => 'Sewa Ruang Toko (Rp2.000.000/bulan)'],
            ['date' => Carbon::now()->setMonth(1)->setDay(18), 'category' => 'Penjualan Produk', 'amount' => 3500000, 'desc' => 'Penjualan (105 pcs)'],
            ['date' => Carbon::now()->setMonth(1)->setDay(22), 'category' => 'Penjualan Produk', 'amount' => 2600000, 'desc' => 'Penjualan (65 pcs)'],
            ['date' => Carbon::now()->setMonth(1)->setDay(25), 'category' => 'Penjualan Jasa', 'amount' => 750000, 'desc' => 'Jasa Custom Design (15 pcs)'],
            ['date' => Carbon::now()->setMonth(1)->setDay(28), 'category' => 'Pendapatan Lain-lain', 'amount' => 350000, 'desc' => 'Komisi & Bonus'],
        ];

        foreach ($incomeData as $data) {
            Income::create([
                'user_id' => $user->id,
                'income_category_id' => $incomeCategories[$data['category']]->id,
                'description' => $data['desc'],
                'amount' => $data['amount'],
                'date' => $data['date'],
            ]);
        }

        // ============================================
        // EXPENSE DATA - Pengeluaran Operasional
        // ============================================
        $expenseData = [
            // OKTOBER
            ['date' => $startDate->copy()->setMonth(10)->setDay(2), 'category' => 'Biaya Operasional', 'amount' => 800000, 'desc' => 'Listrik & Air (Rp800.000)'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(3), 'category' => 'Biaya Gaji & Tenaga Kerja', 'amount' => 3000000, 'desc' => 'Gaji Penjaga Toko (1 orang @ Rp3.000.000)'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(5), 'category' => 'Biaya Sewa', 'amount' => 5000000, 'desc' => 'Sewa Toko (Rp5.000.000/bulan)'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(6), 'category' => 'Biaya Peralatan & ATK', 'amount' => 450000, 'desc' => 'Beli Label, Kantong, & Tissue'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(8), 'category' => 'Biaya Transportasi', 'amount' => 600000, 'desc' => 'Ongkos Kirim ke Distributor (Rp600.000)'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(10), 'category' => 'Biaya Operasional', 'amount' => 300000, 'desc' => 'Internet & Hosting Website'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(15), 'category' => 'Biaya Lain-lain', 'amount' => 200000, 'desc' => 'Perlengkapan Kebersihan Toko'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(20), 'category' => 'Biaya Operasional', 'amount' => 250000, 'desc' => 'Maintenance Peralatan'],
            ['date' => $startDate->copy()->setMonth(10)->setDay(25), 'category' => 'Biaya Transportasi', 'amount' => 400000, 'desc' => 'Bensin & Transport (Rp400.000)'],

            // NOVEMBER
            ['date' => $startDate->copy()->setMonth(11)->setDay(1), 'category' => 'Biaya Operasional', 'amount' => 900000, 'desc' => 'Listrik & Air Meningkat musiman'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(3), 'category' => 'Biaya Gaji & Tenaga Kerja', 'amount' => 6000000, 'desc' => 'Gaji Tim (2 staff @ Rp3.000.000)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(5), 'category' => 'Biaya Sewa', 'amount' => 5000000, 'desc' => 'Sewa Toko (Rp5.000.000/bulan)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(6), 'category' => 'Biaya Peralatan & ATK', 'amount' => 1200000, 'desc' => 'Beli Label, Kantong Premium, Sticker Promo'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(8), 'category' => 'Biaya Transportasi', 'amount' => 1500000, 'desc' => 'Ongkos Kirim Barang (Multiple Supplier)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(10), 'category' => 'Biaya Operasional', 'amount' => 300000, 'desc' => 'Internet & Hosting'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(12), 'category' => 'Biaya Lain-lain', 'amount' => 500000, 'desc' => 'Iklan Facebook & Instagram (Promo Ramadhan)'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(15), 'category' => 'Biaya Operasional', 'amount' => 400000, 'desc' => 'Asuransi Barang & Toko'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(20), 'category' => 'Biaya Peralatan & ATK', 'amount' => 350000, 'desc' => 'Beli Rak & Dekorasi Toko'],
            ['date' => $startDate->copy()->setMonth(11)->setDay(25), 'category' => 'Biaya Transportasi', 'amount' => 600000, 'desc' => 'Bensin & Transport Staff'],

            // DESEMBER - Peak Season Expenses
            ['date' => $startDate->copy()->setMonth(12)->setDay(1), 'category' => 'Biaya Operasional', 'amount' => 1200000, 'desc' => 'Listrik, Air & Keamanan Tambahan'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(2), 'category' => 'Biaya Gaji & Tenaga Kerja', 'amount' => 9000000, 'desc' => 'Gaji Tim + Bonus Performance (3 staff)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(3), 'category' => 'Biaya Sewa', 'amount' => 5000000, 'desc' => 'Sewa Toko (Rp5.000.000/bulan)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(5), 'category' => 'Biaya Peralatan & ATK', 'amount' => 2500000, 'desc' => 'Kemasan Premium, Label, Box Hadiah'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(7), 'category' => 'Biaya Lain-lain', 'amount' => 1500000, 'desc' => 'Iklan Marketing (Social Media & Google Ads)'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(10), 'category' => 'Biaya Transportasi', 'amount' => 2500000, 'desc' => 'Ongkos Pengiriman Barang Besar'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(12), 'category' => 'Biaya Operasional', 'amount' => 800000, 'desc' => 'Internet, Hosting & Payment Gateway'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(15), 'category' => 'Biaya Lain-lain', 'amount' => 600000, 'desc' => 'Packaging & Gift Wrapping Service'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(18), 'category' => 'Biaya Peralatan & ATK', 'amount' => 400000, 'desc' => 'Tissue & Perlengkapan Toko'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(22), 'category' => 'Biaya Transportasi', 'amount' => 1200000, 'desc' => 'Pickup & Delivery ke Pelanggan'],
            ['date' => $startDate->copy()->setMonth(12)->setDay(25), 'category' => 'Biaya Lain-lain', 'amount' => 300000, 'desc' => 'Bonus Karyawan Natal'],

            // JANUARI 2025
            ['date' => Carbon::now()->setMonth(1)->setDay(1), 'category' => 'Biaya Operasional', 'amount' => 800000, 'desc' => 'Listrik & Air'],
            ['date' => Carbon::now()->setMonth(1)->setDay(3), 'category' => 'Biaya Gaji & Tenaga Kerja', 'amount' => 4500000, 'desc' => 'Gaji Tim (1.5 staff Rp3.000.000)'],
            ['date' => Carbon::now()->setMonth(1)->setDay(5), 'category' => 'Biaya Sewa', 'amount' => 5000000, 'desc' => 'Sewa Toko (Rp5.000.000/bulan)'],
            ['date' => Carbon::now()->setMonth(1)->setDay(7), 'category' => 'Biaya Peralatan & ATK', 'amount' => 600000, 'desc' => 'Kantong & Label Reguler'],
            ['date' => Carbon::now()->setMonth(1)->setDay(10), 'category' => 'Biaya Lain-lain', 'amount' => 400000, 'desc' => 'Iklan Digital Marketing'],
            ['date' => Carbon::now()->setMonth(1)->setDay(12), 'category' => 'Biaya Transportasi', 'amount' => 800000, 'desc' => 'Ongkos Kirim & Transport'],
            ['date' => Carbon::now()->setMonth(1)->setDay(15), 'category' => 'Biaya Operasional', 'amount' => 300000, 'desc' => 'Internet & Hosting'],
            ['date' => Carbon::now()->setMonth(1)->setDay(18), 'category' => 'Biaya Lain-lain', 'amount' => 200000, 'desc' => 'Perlengkapan Kebersihan'],
            ['date' => Carbon::now()->setMonth(1)->setDay(22), 'category' => 'Biaya Transportasi', 'amount' => 500000, 'desc' => 'Bensin & Transport'],
            ['date' => Carbon::now()->setMonth(1)->setDay(25), 'category' => 'Biaya Operasional', 'amount' => 250000, 'desc' => 'Maintenance Peralatan'],
        ];

        foreach ($expenseData as $data) {
            Expense::create([
                'user_id' => $user->id,
                'expense_category_id' => $expenseCategories[$data['category']]->id,
                'description' => $data['desc'],
                'amount' => $data['amount'],
                'date' => $data['date'],
            ]);
        }

        // ============================================
        // DEBT DATA - Hutang Bisnis
        // ============================================
        $debtData = [
            [
                'creditor' => 'PT Tekstil Nusantara (Supplier Utama)',
                'amount' => 15000000,
                'paid_amount' => 5000000,
                'due_date' => Carbon::now()->setMonth(11)->setDay(30),
                'desc' => 'Hutang Pembelian Barang - Term 30 hari - Invoice #INV-10001'
            ],
            [
                'creditor' => 'Supplier Fashion ABC',
                'amount' => 8000000,
                'paid_amount' => 0,
                'due_date' => Carbon::now()->setMonth(2)->setDay(5),
                'desc' => 'Hutang Pembelian Stok Celana & Jaket - Term 60 hari'
            ],
            [
                'creditor' => 'Bank BCA - Pinjaman Usaha',
                'amount' => 50000000,
                'paid_amount' => 5000000,
                'due_date' => Carbon::now()->addMonths(24)->setDay(15),
                'desc' => 'Kredit Modal Kerja - Tenor 24 bulan - Bunga 8% per tahun'
            ],
            [
                'creditor' => 'PT Jasa Logistik Express',
                'amount' => 3500000,
                'paid_amount' => 1500000,
                'due_date' => Carbon::now()->setMonth(1)->setDay(31),
                'desc' => 'Hutang Ongkos Pengiriman Kemarin - Invoice #LOG-5432'
            ],
            [
                'creditor' => 'Supplier Kemasan & Label',
                'amount' => 4200000,
                'paid_amount' => 0,
                'due_date' => Carbon::now()->setMonth(2)->setDay(10),
                'desc' => 'Pembelian Box, Kemasan & Label Premium'
            ],
        ];

        foreach ($debtData as $data) {
            Debt::create([
                'user_id' => $user->id,
                'creditor' => $data['creditor'],
                'amount' => $data['amount'],
                'paid_amount' => $data['paid_amount'],
                'due_date' => $data['due_date'],
                'description' => $data['desc'],
            ]);
        }

        // ============================================
        // RECEIVABLE DATA - Piutang Bisnis
        // ============================================
        $receivableData = [
            [
                'debtor' => 'Toko Fashion Solo - Owner Budi',
                'amount' => 12000000,
                'paid_amount' => 0,
                'due_date' => Carbon::now()->setMonth(2)->setDay(15),
                'desc' => 'Penjualan Barang Kulakan - Invoice #PO-2024-001 - Term 30 hari'
            ],
            [
                'debtor' => 'Reseller Bandung - Rina Handayani',
                'amount' => 7500000,
                'paid_amount' => 5000000,
                'due_date' => Carbon::now()->setMonth(1)->setDay(25),
                'desc' => 'Penjualan Stok Kaos & Celana - Pembayaran Terlambat'
            ],
            [
                'debtor' => 'Koperasi Karyawan PT Maju Jaya',
                'amount' => 18000000,
                'paid_amount' => 0,
                'due_date' => Carbon::now()->addMonths(2)->setDay(1),
                'desc' => 'Penjualan Seragam Korporat - PO Besar - Invoice #KOP-5001'
            ],
            [
                'debtor' => 'Rental Kostum Teater "Panggung Seni"',
                'amount' => 5000000,
                'paid_amount' => 2500000,
                'due_date' => Carbon::now()->setMonth(1)->setDay(30),
                'desc' => 'Penjualan Custom Kostum - Pembayaran Bertahap'
            ],
            [
                'debtor' => 'Restoran XYZ - Pembelian Uniform Staff',
                'amount' => 6500000,
                'paid_amount' => 0,
                'due_date' => Carbon::now()->addMonths(1)->setDay(15),
                'desc' => 'Penjualan Uniform Karyawan - Invoice #UNI-4456'
            ],
            [
                'debtor' => 'Sekolah Menengah Atas "Bina Bangsa"',
                'amount' => 25000000,
                'paid_amount' => 0,
                'due_date' => Carbon::now()->addMonths(3)->setDay(1),
                'desc' => 'Penjualan Seragam Sekolah - PO Tahunan - Pembayaran Bertahap'
            ],
        ];

        foreach ($receivableData as $data) {
            Receivable::create([
                'user_id' => $user->id,
                'debtor' => $data['debtor'],
                'amount' => $data['amount'],
                'paid_amount' => $data['paid_amount'],
                'due_date' => $data['due_date'],
                'description' => $data['desc'],
            ]);
        }
    }
}
