# Feature Management System - E-MKM

## 📋 Overview

Sistem pembatasan fitur berdasarkan paket langganan yang **dinamis** dan dapat diatur oleh admin.

## 🎯 Paket yang Tersedia

### 1. **Free** (Gratis)
- Transaksi keuangan: Maksimal 50/bulan
- Artikel: Maksimal 5 artikel
- ❌ Tidak ada invoice
- ❌ Tidak ada customer management
- ❌ Tidak ada profil bisnis
- ✅ Notifikasi dasar

### 2. **Basic** (Rp 29.000/bulan)
- Transaksi keuangan: Maksimal 200/bulan
- ✅ Laporan keuangan
- ✅ Jurnal akuntansi
- Artikel: Maksimal 50 artikel dengan gambar
- Invoice: Maksimal 50/bulan
- ✅ Export PDF invoice
- Customer: Maksimal 100
- ✅ Profil bisnis dengan logo
- ✅ Backup data
- ✅ Notifikasi

### 3. **Pro** (Rp 59.000/bulan)
- ✅ **UNLIMITED** transaksi
- ✅ **UNLIMITED** artikel
- ✅ **UNLIMITED** invoice
- ✅ **UNLIMITED** customer
- ✅ Kirim invoice via email
- ✅ Audit log lengkap
- ✅ API Access
- ✅ Priority Support
- ✅ Semua fitur Basic

## 💻 Cara Penggunaan

### 1. **Cek Akses Fitur di Controller**

```php
use App\Services\FeatureService;

class InvoiceController extends Controller
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }

    public function create()
    {
        $user = auth()->user();
        
        // Cek apakah user bisa membuat invoice
        if (!$this->featureService->hasAccess($user, 'invoices.create')) {
            return redirect()->back()->with('error', 
                'Upgrade ke paket Basic untuk membuat invoice.'
            );
        }

        // Cek apakah sudah mencapai limit
        $invoiceCount = $user->invoices()->count();
        if ($this->featureService->hasReachedLimit($user, 'invoices.max_count', $invoiceCount)) {
            $limit = $this->featureService->getLimit($user, 'invoices.max_count');
            return redirect()->back()->with('error', 
                "Anda telah mencapai batas {$limit} invoice. Upgrade untuk unlimited invoice."
            );
        }

        return view('invoices.create');
    }
}
```

### 2. **Gunakan Middleware di Routes**

```php
// Proteksi route dengan feature check
Route::middleware(['auth', 'feature:invoices.create'])->group(function () {
    Route::get('/invoices/create', [InvoiceController::class, 'create']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
});

Route::middleware(['auth', 'feature:business_profile'])->group(function () {
    Route::resource('business-profile', BusinessProfileController::class);
});
```

### 3. **Cek di Blade View**

```blade
@canFeature('invoices.create')
    <a href="{{ route('invoices.create') }}">Buat Invoice</a>
@else
    <button disabled>Buat Invoice (Upgrade Required)</button>
@endcanFeature

@canFeature('articles.max_count')
    <p>Limit artikel Anda: @featureLimit('articles.max_count')</p>
@endcanFeature
```

### 4. **Cek di React/Inertia**

Tambahkan ke `HandleInertiaRequests.php`:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'userFeatures' => $request->user() 
            ? app(FeatureService::class)->getUserFeatures($request->user())
            : [],
    ];
}
```

Gunakan di komponen React:

```tsx
import { usePage } from '@inertiajs/react';

export default function InvoiceCreate() {
    const { userFeatures } = usePage().props;
    
    const canCreateInvoice = userFeatures.invoices?.some(
        f => f.key === 'invoices.create' && f.is_enabled
    );
    
    const invoiceLimit = userFeatures.invoices?.find(
        f => f.key === 'invoices.max_count'
    )?.numeric_limit;
    
    return (
        <div>
            {canCreateInvoice ? (
                <button>Buat Invoice</button>
            ) : (
                <button disabled>Upgrade untuk Invoice</button>
            )}
            
            {invoiceLimit === -1 ? (
                <p>Unlimited invoices</p>
            ) : (
                <p>Limit: {invoiceLimit} invoices/bulan</p>
            )}
        </div>
    );
}
```

### 5. **Service Methods**

```php
$featureService = app(FeatureService::class);
$user = auth()->user();

// Cek akses boolean
$canCreate = $featureService->hasAccess($user, 'invoices.create'); // true/false

// Get limit angka
$limit = $featureService->getLimit($user, 'articles.max_count'); // 5, 50, atau -1 (unlimited)

// Cek apakah sudah mencapai limit
$currentCount = $user->articles()->count();
$reachedLimit = $featureService->hasReachedLimit($user, 'articles.max_count', $currentCount);

// Get sisa quota
$remaining = $featureService->getRemainingQuota($user, 'articles.max_count', $currentCount);

// Get semua fitur user (grouped by category)
$allFeatures = $featureService->getUserFeatures($user);
```

## 🔧 Admin: Mengelola Fitur Paket

### 1. **Tambah Fitur Baru**

```php
PackageFeature::create([
    'feature_key' => 'reports.advanced',
    'feature_name' => 'Laporan Lanjutan',
    'description' => 'Akses laporan cash flow dan profit/loss',
    'category' => 'accounting',
    'limit_type' => 'boolean',
    'sort_order' => 5,
]);
```

### 2. **Update Limit Paket**

```php
$proPackage = Package::where('name', 'Pro')->first();

// Aktifkan fitur dengan limit
$proPackage->featureLimits()->syncWithoutDetaching([
    $featureId => [
        'is_enabled' => true,
        'numeric_limit' => -1, // -1 = unlimited
    ]
]);
```

### 3. **Categories yang Tersedia**
- `accounting` - Fitur keuangan
- `articles` - Artikel edukasi
- `invoices` - Invoice & billing
- `customers` - Customer management
- `branding` - Profil bisnis
- `advanced` - Fitur lanjutan
- `support` - Dukungan

## 🎨 Feature Types

### Boolean (Ya/Tidak)
```php
'limit_type' => 'boolean'
// Contoh: invoices.create, business_profile
```

### Numeric (Batas Angka)
```php
'limit_type' => 'numeric'
// Contoh: articles.max_count, invoices.max_count
// -1 = unlimited, 0 = tidak diizinkan, > 0 = batas spesifik
```

### List (Pilihan)
```php
'limit_type' => 'list'
// Untuk fitur masa depan (e.g., report types, export formats)
```

## 📊 Database Schema

```
package_features
├── id
├── feature_key (unique)
├── feature_name
├── description
├── category
├── limit_type (boolean/numeric/list)
├── sort_order
└── is_active

package_feature_limits (pivot)
├── package_id
├── package_feature_id
├── is_enabled
├── numeric_limit
└── list_values (json)
```

## 🚀 Migration & Seeding

```bash
# Run migration
php artisan migrate

# Seed features
php artisan db:seed --class=PackageFeatureSeeder

# Atau refresh semua
php artisan migrate:fresh --seed
```

## 💡 Best Practices

1. **Always check limits before creating resources**
   ```php
   if ($featureService->hasReachedLimit($user, 'articles.max_count', $currentCount)) {
       // Show upgrade message
   }
   ```

2. **Cache user's package**
   - Sudah di-cache otomatis selama 10 menit
   - Clear cache saat subscription berubah

3. **Handle unlimited gracefully**
   ```php
   $limit = $featureService->getLimit($user, 'invoices.max_count');
   if ($limit === -1) {
       // Unlimited, don't show limit
   }
   ```

4. **Show upgrade prompts**
   - Jika fitur disabled → "Upgrade ke Basic"
   - Jika mencapai limit → "Upgrade ke Pro untuk unlimited"

## 🎯 Keuntungan Sistem Ini

✅ **Dinamis** - Admin bisa ubah limit kapan saja tanpa coding
✅ **Fleksibel** - Support boolean, numeric, dan list limits
✅ **Scalable** - Mudah tambah fitur baru
✅ **Performance** - Di-cache untuk kecepatan
✅ **User-friendly** - Clear error messages
✅ **Admin-friendly** - Easy management via admin panel

## 🔄 Update Package Prices

```php
// Update harga di database
Package::where('name', 'Basic')->update(['price' => 29000]);
Package::where('name', 'Pro')->update(['price' => 59000]);
```
