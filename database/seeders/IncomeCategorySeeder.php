<?php

namespace Database\Seeders;

use App\Models\IncomeCategory;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IncomeCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // PERBAIKAN: Cari pengguna 'Test User' yang dibuat oleh DatabaseSeeder
        $user = User::where('email', 'test@example.com')->first();

        // Jika pengguna ditemukan, buat kategori untuknya
        if ($user) {
            $categories = [
                ['name' => 'Gaji', 'user_id' => $user->id],
                ['name' => 'Penjualan Produk', 'user_id' => $user->id],
                ['name' => 'Bonus', 'user_id' => $user->id],
                ['name' => 'Freelance', 'user_id' => $user->id],
                ['name' => 'Lainnya', 'user_id' => $user->id],
            ];

            // Masukkan data kategori ke dalam database
            foreach ($categories as $category) {
                IncomeCategory::create($category);
            }
        }
    }
}
