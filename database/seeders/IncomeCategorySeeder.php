<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\IncomeCategory;

class IncomeCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Daftar kategori pemasukan default yang akan dimasukkan
        $categories = [
            'Gaji',
            'Penjualan Produk',
            'Jasa',
            'Bonus',
            'Sewa',
            'Investasi',
            'Pendapatan Lain-lain',
        ];

        // Looping untuk memasukkan setiap kategori ke dalam tabel 'income_categories'
        foreach ($categories as $name) {
            IncomeCategory::create([
                'name' => $name,
                'user_id' => null, // Kategori ini bersifat global (bisa dipakai semua user)
            ]);
        }
    }
}
