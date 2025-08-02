<?php

namespace Database\Seeders;

use App\Models\IncomeCategory;
use App\Models\User;
use App\Policies\IncomePolicy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IncomeCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $globalCategories = ['Makanan', 'Transportasi', 'Listrik', 'Internet', 'Kesehatan', 'lainnya'];
        foreach ($globalCategories as $name) {
            IncomeCategory::create([
                'name' => $name,
                'user_id' => null,
            ]);
        }
    }
}
