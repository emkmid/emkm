<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ExpenseCategory;

class ExpenseCategorySeeder extends Seeder
{

    public function run(): void
    {
        $globalCategories = ['Makanan', 'Transportasi', 'Listrik', 'Internet', 'Kesehatan', 'lainnya'];
        foreach ($globalCategories as $name) {
            ExpenseCategory::create([
                'name' => $name,
                'user_id' => null,
            ]);
        }
    }
}
