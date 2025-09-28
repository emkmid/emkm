<?php

namespace Database\Seeders;

use App\Models\ChartOfAccount;
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
        $categories = [
            ['name' => 'Penjualan Produk', 'coa_code' => '401'],
            ['name' => 'Penjualan Jasa',   'coa_code' => '401'],
            ['name' => 'Pendapatan Sewa',  'coa_code' => '402'],
            ['name' => 'Pendapatan Lain-lain', 'coa_code' => '402'],
        ];

        foreach ($categories as $cat) {
            $account = ChartOfAccount::where('code', $cat['coa_code'])->firstOrFail();

            IncomeCategory::updateOrCreate(
                ['name' => $cat['name']],
                ['account_id' => $account->id]
            );
        }
    }
}
