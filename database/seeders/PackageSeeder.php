<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Free',
                'description' => 'Free tier with basic features',
                'price' => 0.00,
                'features' => [
                    'products' => true,
                    'transactions' => true,
                    'reports' => false,
                    'hpp' => false,
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Basic',
                'description' => 'Basic plan for small businesses',
                'price' => 29.00,
                'features' => [
                    'products' => true,
                    'transactions' => true,
                    'reports' => true,
                    'hpp' => true,
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'description' => 'Pro plan with advanced features',
                'price' => 99.00,
                'features' => [
                    'products' => true,
                    'transactions' => true,
                    'reports' => true,
                    'hpp' => true,
                    'priority_support' => true,
                ],
                'is_active' => true,
            ],
        ];

        foreach ($packages as $pkg) {
            Package::create($pkg);
        }
    }
}
