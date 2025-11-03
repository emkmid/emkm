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
                'duration_options' => ['1_month'],
                'discount_percentage' => 0,
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Basic',
                'description' => 'Basic plan for small businesses',
                'price' => 50000, // IDR 50,000
                'features' => [
                    'products' => true,
                    'transactions' => true,
                    'reports' => true,
                    'hpp' => true,
                    'max_products' => 100,
                    'max_transactions' => 500,
                ],
                'duration_options' => ['1_month', '3_months', '6_months', '1_year'],
                'discount_percentage' => 0,
                'is_popular' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'description' => 'Pro plan with advanced features',
                'price' => 100000, // IDR 100,000
                'features' => [
                    'products' => true,
                    'transactions' => true,
                    'reports' => true,
                    'hpp' => true,
                    'priority_support' => true,
                    'max_products' => 1000,
                    'max_transactions' => 5000,
                    'advanced_reports' => true,
                    'api_access' => true,
                ],
                'duration_options' => ['1_month', '3_months', '6_months', '1_year'],
                'discount_percentage' => 5, // 5% additional discount
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Enterprise',
                'description' => 'Enterprise plan for large businesses',
                'price' => 200000, // IDR 200,000
                'features' => [
                    'products' => true,
                    'transactions' => true,
                    'reports' => true,
                    'hpp' => true,
                    'priority_support' => true,
                    'max_products' => 'unlimited',
                    'max_transactions' => 'unlimited',
                    'advanced_reports' => true,
                    'api_access' => true,
                    'white_label' => true,
                    'custom_integration' => true,
                ],
                'duration_options' => ['1_month', '3_months', '6_months', '1_year'],
                'discount_percentage' => 10, // 10% additional discount
                'is_popular' => false,
                'is_active' => true,
            ],
        ];

        foreach ($packages as $pkg) {
            Package::updateOrCreate(['name' => $pkg['name']], $pkg);
        }
    }
}
