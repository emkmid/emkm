<?php

namespace Database\Seeders;

use App\Models\ChartOfAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ExpenseCategory;

class ExpenseCategorySeeder extends Seeder
{

    public function run(): void
    {
        $categories = [
            ['name' => 'Biaya Operasional',   'coa_code' => '501'],
            ['name' => 'Biaya Transportasi',  'coa_code' => '502'],
            ['name' => 'Biaya Sewa',          'coa_code' => '503'],
            ['name' => 'Biaya Gaji & Tenaga Kerja', 'coa_code' => '504'],
            ['name' => 'Biaya Peralatan & ATK','coa_code' => '502'],
            ['name' => 'Biaya Lain-lain',     'coa_code' => '502'],
        ];

        foreach ($categories as $cat) {
            $account = ChartOfAccount::where('code', $cat['coa_code'])->firstOrFail();

            ExpenseCategory::updateOrCreate(
                ['name' => $cat['name']],
                ['account_id' => $account->id]
            );
        }
    }
}
