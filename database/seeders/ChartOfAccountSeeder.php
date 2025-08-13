<?php

namespace Database\Seeders;

use App\Models\ChartOfAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChartOfAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            ['code' => '101', 'name' => 'Kas', 'type' => 'aset'],
            ['code' => '102', 'name' => 'Bank', 'type' => 'aset'],
            ['code' => '201', 'name' => 'Utang Usaha', 'type' => 'liabilitas'],
            ['code' => '301', 'name' => 'Modal Pemilik', 'type' => 'ekuitas'],
            ['code' => '401', 'name' => 'Pendapatan Penjualan', 'type' => 'pendapatan'],
            ['code' => '501', 'name' => 'Biaya Listrik', 'type' => 'biaya'],
        ];

        foreach($accounts as $account) {
            ChartOfAccount::create($account);
        }
    }
}
