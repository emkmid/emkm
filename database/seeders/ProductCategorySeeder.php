<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductCategory;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Makanan Berat',
            'Camilan / Snack',
            'Minuman',
            'Frozen Food',
            'Roti / Kue',
            'Catering / Pesanan Khusus',
        ];

        foreach ($categories as $name) {
            ProductCategory::create([
                'name' => $name,
                'user_id' => null, // Kategori global
            ]);
        }
    }
}
