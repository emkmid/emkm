<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\PackageFeature;
use Illuminate\Database\Seeder;

class PackageFeatureSeeder extends Seeder
{
    public function run(): void
    {
        // Define all available features
        $features = [
            // Accounting Features
            [
                'feature_key' => 'accounting.transactions',
                'feature_name' => 'Transaksi Keuangan',
                'description' => 'Catat pemasukan dan pengeluaran',
                'category' => 'accounting',
                'limit_type' => 'boolean',
                'sort_order' => 1,
            ],
            [
                'feature_key' => 'accounting.max_transactions',
                'feature_name' => 'Maksimal Transaksi per Bulan',
                'description' => 'Batas jumlah transaksi yang dapat dibuat per bulan',
                'category' => 'accounting',
                'limit_type' => 'numeric',
                'sort_order' => 2,
            ],
            [
                'feature_key' => 'accounting.reports',
                'feature_name' => 'Laporan Keuangan',
                'description' => 'Akses laporan keuangan lengkap',
                'category' => 'accounting',
                'limit_type' => 'boolean',
                'sort_order' => 3,
            ],
            [
                'feature_key' => 'accounting.journal',
                'feature_name' => 'Jurnal Akuntansi',
                'description' => 'Buat jurnal dan buku besar',
                'category' => 'accounting',
                'limit_type' => 'boolean',
                'sort_order' => 4,
            ],

            // Articles Features
            [
                'feature_key' => 'articles.create',
                'feature_name' => 'Buat Artikel',
                'description' => 'Kemampuan membuat artikel edukasi',
                'category' => 'articles',
                'limit_type' => 'boolean',
                'sort_order' => 10,
            ],
            [
                'feature_key' => 'articles.max_count',
                'feature_name' => 'Maksimal Artikel',
                'description' => 'Batas jumlah artikel yang dapat dibuat',
                'category' => 'articles',
                'limit_type' => 'numeric',
                'sort_order' => 11,
            ],
            [
                'feature_key' => 'articles.images',
                'feature_name' => 'Upload Gambar Artikel',
                'description' => 'Upload gambar dalam artikel',
                'category' => 'articles',
                'limit_type' => 'boolean',
                'sort_order' => 12,
            ],

            // Invoice Features
            [
                'feature_key' => 'invoices.create',
                'feature_name' => 'Buat Invoice',
                'description' => 'Kemampuan membuat invoice',
                'category' => 'invoices',
                'limit_type' => 'boolean',
                'sort_order' => 20,
            ],
            [
                'feature_key' => 'invoices.max_count',
                'feature_name' => 'Maksimal Invoice per Bulan',
                'description' => 'Batas jumlah invoice per bulan',
                'category' => 'invoices',
                'limit_type' => 'numeric',
                'sort_order' => 21,
            ],
            [
                'feature_key' => 'invoices.pdf_export',
                'feature_name' => 'Export Invoice ke PDF',
                'description' => 'Download invoice dalam format PDF',
                'category' => 'invoices',
                'limit_type' => 'boolean',
                'sort_order' => 22,
            ],
            [
                'feature_key' => 'invoices.email_send',
                'feature_name' => 'Kirim Invoice via Email',
                'description' => 'Kirim invoice langsung ke customer via email',
                'category' => 'invoices',
                'limit_type' => 'boolean',
                'sort_order' => 23,
            ],

            // Customer Features
            [
                'feature_key' => 'customers.create',
                'feature_name' => 'Kelola Customer',
                'description' => 'Kemampuan mengelola data customer',
                'category' => 'customers',
                'limit_type' => 'boolean',
                'sort_order' => 30,
            ],
            [
                'feature_key' => 'customers.max_count',
                'feature_name' => 'Maksimal Customer',
                'description' => 'Batas jumlah customer yang dapat disimpan',
                'category' => 'customers',
                'limit_type' => 'numeric',
                'sort_order' => 31,
            ],

            // Business Profile
            [
                'feature_key' => 'business_profile',
                'feature_name' => 'Profil Bisnis',
                'description' => 'Buat profil bisnis dengan logo',
                'category' => 'branding',
                'limit_type' => 'boolean',
                'sort_order' => 40,
            ],

            // Advanced Features
            [
                'feature_key' => 'notifications',
                'feature_name' => 'Notifikasi',
                'description' => 'Terima notifikasi penting',
                'category' => 'advanced',
                'limit_type' => 'boolean',
                'sort_order' => 50,
            ],
            [
                'feature_key' => 'backup',
                'feature_name' => 'Backup Data',
                'description' => 'Backup dan restore data',
                'category' => 'advanced',
                'limit_type' => 'boolean',
                'sort_order' => 51,
            ],
            [
                'feature_key' => 'audit_log',
                'feature_name' => 'Audit Log',
                'description' => 'Riwayat aktivitas pengguna',
                'category' => 'advanced',
                'limit_type' => 'boolean',
                'sort_order' => 52,
            ],
            [
                'feature_key' => 'api_access',
                'feature_name' => 'API Access',
                'description' => 'Akses API untuk integrasi',
                'category' => 'advanced',
                'limit_type' => 'boolean',
                'sort_order' => 53,
            ],

            // Support Features
            [
                'feature_key' => 'support.priority',
                'feature_name' => 'Priority Support',
                'description' => 'Dukungan prioritas dari tim',
                'category' => 'support',
                'limit_type' => 'boolean',
                'sort_order' => 60,
            ],
        ];

        foreach ($features as $feature) {
            PackageFeature::create($feature);
        }

        // Setup package limits
        $this->setupPackageLimits();
    }

    private function setupPackageLimits(): void
    {
        $packages = Package::all();
        $freePackage = $packages->where('name', 'Free')->first();
        $basicPackage = $packages->where('name', 'Basic')->first();
        $proPackage = $packages->where('name', 'Pro')->first();

        // FREE PACKAGE LIMITS
        if ($freePackage) {
            $freePackage->featureLimits()->attach([
                PackageFeature::where('feature_key', 'accounting.transactions')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'accounting.max_transactions')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => 50,
                ],
                PackageFeature::where('feature_key', 'accounting.reports')->first()->id => [
                    'is_enabled' => false,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'articles.create')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'articles.max_count')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => 5,
                ],
                PackageFeature::where('feature_key', 'invoices.create')->first()->id => [
                    'is_enabled' => false,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'customers.create')->first()->id => [
                    'is_enabled' => false,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'business_profile')->first()->id => [
                    'is_enabled' => false,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'notifications')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'backup')->first()->id => [
                    'is_enabled' => false,
                    'numeric_limit' => null,
                ],
            ]);
        }

        // BASIC PACKAGE LIMITS (29.000/bulan)
        if ($basicPackage) {
            $basicPackage->featureLimits()->attach([
                PackageFeature::where('feature_key', 'accounting.transactions')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'accounting.max_transactions')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => 200,
                ],
                PackageFeature::where('feature_key', 'accounting.reports')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'accounting.journal')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'articles.create')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'articles.max_count')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => 50,
                ],
                PackageFeature::where('feature_key', 'articles.images')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'invoices.create')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'invoices.max_count')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => 50,
                ],
                PackageFeature::where('feature_key', 'invoices.pdf_export')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'customers.create')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'customers.max_count')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => 100,
                ],
                PackageFeature::where('feature_key', 'business_profile')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'notifications')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'backup')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'audit_log')->first()->id => [
                    'is_enabled' => false,
                    'numeric_limit' => null,
                ],
            ]);
        }

        // PRO PACKAGE LIMITS (59.000/bulan)
        if ($proPackage) {
            $proPackage->featureLimits()->attach([
                PackageFeature::where('feature_key', 'accounting.transactions')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'accounting.max_transactions')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => -1,
                ],
                PackageFeature::where('feature_key', 'accounting.reports')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'accounting.journal')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'articles.create')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'articles.max_count')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => -1,
                ],
                PackageFeature::where('feature_key', 'articles.images')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'invoices.create')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'invoices.max_count')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => -1,
                ],
                PackageFeature::where('feature_key', 'invoices.pdf_export')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'invoices.email_send')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'customers.create')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'customers.max_count')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => -1,
                ],
                PackageFeature::where('feature_key', 'business_profile')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'notifications')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'backup')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'audit_log')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'api_access')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
                PackageFeature::where('feature_key', 'support.priority')->first()->id => [
                    'is_enabled' => true,
                    'numeric_limit' => null,
                ],
            ]);
        }
    }
}
