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
            ['name' => 'Listrik',   'coa_code' => '501'],
            ['name' => 'Internet',  'coa_code' => '501'],
            ['name' => 'Air',       'coa_code' => '501'],
            ['name' => 'Bensin',    'coa_code' => '502'],
            ['name' => 'Parkir',    'coa_code' => '502'],
            ['name' => 'Sewa Kantor','coa_code' => '503'],
            ['name' => 'Gaji Karyawan','coa_code' => '504'],
            ['name' => 'ATK',       'coa_code' => '502'],
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
