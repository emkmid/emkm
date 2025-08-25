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
            // Aset
            ['code' => '101', 'name' => 'Kas', 'type' => 'aset'],
            ['code' => '102', 'name' => 'Bank', 'type' => 'aset'],
            ['code' => '103', 'name' => 'Piutang Usaha', 'type' => 'aset'],

            // Liabilitas
            ['code' => '201', 'name' => 'Utang Usaha', 'type' => 'liabilitas'],

            // Ekuitas
            ['code' => '301', 'name' => 'Modal Pemilik', 'type' => 'ekuitas'],

            // Pendapatan
            ['code' => '401', 'name' => 'Pendapatan Penjualan', 'type' => 'pendapatan'],
            ['code' => '402', 'name' => 'Pendapatan Lain-lain', 'type' => 'pendapatan'],

            // Biaya
            ['code' => '501', 'name' => 'Biaya Utilitas (Listrik, Internet, Air, Dll)', 'type' => 'biaya'],
            ['code' => '502', 'name' => 'Biaya Transportasi', 'type' => 'biaya'],
            ['code' => '503', 'name' => 'Biaya Sewa', 'type' => 'biaya'],
            ['code' => '504', 'name' => 'Biaya Gaji', 'type' => 'biaya'],
        ];

        foreach($accounts as $account) {
            ChartOfAccount::create($account);
        }
    }
}
