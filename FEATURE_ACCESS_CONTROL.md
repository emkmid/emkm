# Feature-Based Access Control

## Overview
Sistem ini memungkinkan kontrol akses berdasarkan paket subscription user. Setiap fitur dapat diaktifkan/nonaktifkan per paket melalui admin panel.

## Feature List

### Accounting Features
- `accounting.transactions` - Transaksi Keuangan (Enabled di Free)
- `accounting.max_transactions` - Maksimal Transaksi per Bulan
- `accounting.reports` - Laporan Keuangan ❌ (Disabled di Free)
- `accounting.journal` - Jurnal Akuntansi

### Articles Features
- `articles.create` - Buat Artikel ❌ (Disabled di Free)
- `articles.max_count` - Maksimal Artikel
- `articles.images` - Upload Gambar Artikel

### Branding Features
- `business_profile` - Profil Bisnis ❌ (Disabled di Free)

### Customer Features
- `customers.create` - Kelola Customer ❌ (Disabled di Free)
- `customers.max_count` - Maksimal Customer

### Invoice Features
- `invoices.create` - Buat Invoice ❌ (Disabled di Free)
- `invoices.max_count` - Maksimal Invoice per Bulan
- `invoices.pdf_export` - Export Invoice ke PDF
- `invoices.email_send` - Kirim Invoice via Email

### Advanced Features
- `notifications` - Notifikasi
- `backup` - Backup Data ❌ (Disabled di Free)
- `audit_log` - Audit Log
- `api_access` - API Access

### Support Features
- `support.priority` - Priority Support

## Backend Usage

### 1. Protect Routes with Middleware

```php
// Single route
Route::get('reports/ledger', [ReportController::class, 'ledger'])
    ->middleware(['feature:accounting.reports']);

// Route group
Route::middleware(['feature:invoices.create'])->group(function () {
    Route::resource('invoices', InvoiceController::class);
    Route::get('invoices-list', [InvoiceController::class, 'list']);
});
```

### 2. Check Access in Controller

```php
use App\Services\FeatureService;

class InvoiceController extends Controller
{
    public function __construct(
        protected FeatureService $featureService
    ) {}
    
    public function store(Request $request)
    {
        $user = $request->user();
        
        // Check if user has access
        if (!$this->featureService->hasAccess($user, 'invoices.create')) {
            return redirect()->route('dashboard.packages')
                ->with('error', 'Upgrade paket untuk membuat invoice.');
        }
        
        // Check limit
        $currentCount = $user->invoices()->count();
        if ($this->featureService->hasReachedLimit($user, 'invoices.max_count', $currentCount)) {
            return back()->with('error', 'Anda telah mencapai limit invoice untuk paket ini.');
        }
        
        // Create invoice...
    }
}
```

### 3. Use FeatureService Methods

```php
$featureService = app(FeatureService::class);

// Check access
$hasAccess = $featureService->hasAccess($user, 'accounting.reports');

// Get limit (-1 = unlimited, 0 = not allowed, n = specific limit)
$limit = $featureService->getLimit($user, 'accounting.max_transactions');

// Check if reached limit
$currentCount = $user->transactions()->count();
$reachedLimit = $featureService->hasReachedLimit($user, 'accounting.max_transactions', $currentCount);

// Get remaining quota
$remaining = $featureService->getRemainingQuota($user, 'accounting.max_transactions', $currentCount);

// Get all features for user
$features = $featureService->getUserFeatures($user);
```

## Frontend Usage

### 1. Use Hook to Check Feature Access

```tsx
import { useFeature, useFeatures } from '@/hooks/use-feature';

function InvoicePage() {
    const hasInvoiceAccess = useFeature('invoices.create');
    const hasPdfExport = useFeature('invoices.pdf_export');
    
    if (!hasInvoiceAccess) {
        return <FeatureLock 
            featureName="Invoice" 
            description="Buat dan kelola invoice pelanggan"
            requiredPlan="Basic"
        />;
    }
    
    return (
        <div>
            <h1>Kelola Invoice</h1>
            
            {hasPdfExport && (
                <Button onClick={exportPdf}>Export PDF</Button>
            )}
        </div>
    );
}
```

### 2. Conditional Menu Items

```tsx
const mainNavItems: MainNavItem[] = [
    {
        title: 'Invoices',
        icon: FileText,
        can: (user, features) => user?.role === 'user' && (features?.['invoices.create'] ?? false),
        href: '/dashboard/invoices',
    },
];
```

### 3. Use FeatureLock Component

```tsx
import { FeatureLock } from '@/components/feature-lock';

function ProfilePage() {
    const hasAccess = useFeature('business_profile');
    
    if (!hasAccess) {
        return <FeatureLock 
            featureName="Profil Bisnis"
            description="Kelola informasi bisnis Anda seperti logo, alamat, dan kontak"
            requiredPlan="Basic"
        />;
    }
    
    return <div>/* Profile content */</div>;
}
```

### 4. Feature Props Available in All Pages

```tsx
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

function MyComponent() {
    const { auth } = usePage<SharedData>().props;
    const features = auth.features;
    
    // features = {
    //   'accounting.reports': true,
    //   'invoices.create': false,
    //   ...
    // }
}
```

## Admin Panel

### Manage Features
1. Navigate to `/dashboard/admin/features`
2. Toggle feature enabled/disabled per package
3. Set numeric limits (unlimited = -1, disabled = leave empty)
4. Click on cell to edit inline
5. Changes saved automatically

### Feature Matrix Example

```
Feature                  | Free  | Basic | Pro
------------------------|-------|-------|-------
Transaksi Keuangan      | ✓     | ✓     | ✓
Laporan Keuangan        | ✗     | ✓     | ✓
Profil Bisnis           | ✗     | ✓     | ✓
Kelola Invoice          | ✗     | ✓     | ✓
Max Transaksi/bulan     | 50    | 200   | ∞
```

## Testing

### Test Feature Access

```php
// In tinker
$user = User::find(1);
$featureService = app(App\Services\FeatureService::class);

// Check access
$featureService->hasAccess($user, 'accounting.reports'); // true/false

// Check limit
$featureService->getLimit($user, 'accounting.max_transactions'); // -1, 0, or number
```

### Test Middleware Protection

1. Login dengan user Free package
2. Try access `/dashboard/reports/ledger`
3. Should redirect to `/dashboard/packages` with error message
4. Menu "Report" should not appear in sidebar

## Error Handling

### Backend
- Middleware redirects to `/dashboard/packages` with error message
- Error message: "Fitur ini tidak tersedia di paket Anda. Upgrade untuk mengaksesnya."

### Frontend
- FeatureLock component shows upgrade prompt
- Menu items hidden if user doesn't have access
- Buttons/features conditionally rendered based on feature flags

## Best Practices

1. **Always protect routes** - Don't rely only on frontend hiding
2. **Check limits** - Before creating records, check if user has reached limit
3. **Clear cache** - Call `$featureService->clearCache($user)` after subscription changes
4. **Feature keys** - Use consistent naming: `category.feature_name`
5. **UI feedback** - Always show why feature is locked and how to unlock

## Package Comparison

| Feature | Free | Basic | Pro |
|---------|------|-------|-----|
| Transaksi | ✓ (50/bln) | ✓ (200/bln) | ✓ (unlimited) |
| Laporan | ✗ | ✓ | ✓ |
| Invoice | ✗ | ✓ | ✓ |
| Profile | ✗ | ✓ | ✓ |
| Customer | ✗ | ✓ | ✓ |
| Backup | ✗ | ✗ | ✓ |

## Common Issues

### Issue: Feature not working after package update
**Solution**: Clear feature cache
```php
$featureService->clearCache($user);
```

### Issue: Frontend shows feature but backend blocks it
**Solution**: Make sure `HandleInertiaRequests` includes the feature in shared props

### Issue: Menu item not hiding
**Solution**: Check that `can` function includes feature check with proper key

## Support

For issues or questions:
1. Check admin panel `/dashboard/admin/features` for feature configuration
2. Verify user's active subscription and package
3. Check logs for middleware blocks
4. Test in tinker with FeatureService methods
