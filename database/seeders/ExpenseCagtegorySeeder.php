<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ExpenseCategory;

class ExpenseCagtegorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $globalCategories = ['Makanan', 'Transportasi', 'Listrik', 'Internet', 'Kesehatan'];
        foreach ($globalCategories as $name) {
            ExpenseCategory::create([
                'name' => $name,
                'user_id' => null,
            ]);
        }
    }
}
