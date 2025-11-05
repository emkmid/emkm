# Business Profile Feature

## Overview
Fitur Business Profile memungkinkan pengguna untuk mengelola informasi bisnis mereka, yang nantinya akan digunakan untuk invoice dan branding.

## Features Implemented

### 1. Database & Model
- **Migration**: `2025_11_05_050407_create_business_profiles_table.php`
  - Tabel dengan 15 kolom untuk menyimpan informasi bisnis lengkap
  - Constraint unique pada `user_id` (satu user = satu profil)
  - Kolom logo_path untuk menyimpan path logo

- **Model**: `app/Models/BusinessProfile.php`
  - Computed attribute `logo_url` untuk generate URL logo dari storage
  - Computed attribute `full_address` untuk format alamat lengkap
  - Relasi dengan User model (belongsTo)

### 2. Controller
- **BusinessProfileController**: `app/Http/Controllers/BusinessProfileController.php`
  - `index()`: Menampilkan profil bisnis user
  - `create()`: Form untuk membuat profil baru
  - `store()`: Menyimpan profil baru dengan upload logo
  - `edit()`: Form untuk edit profil
  - `update()`: Update profil dengan dukungan replace logo
  - `destroy()`: Hapus profil beserta logo file

### 3. Frontend Pages
- **index.tsx**: Halaman tampilan profil bisnis
  - Menampilkan semua informasi bisnis dengan layout yang rapi
  - Logo, info dasar, kontak, alamat, dan deskripsi
  - Button untuk create/edit profil
  - Empty state yang user-friendly

- **create.tsx**: Form untuk membuat profil baru
  - Upload logo dengan preview
  - Form lengkap dengan validasi
  - Grouped fields (Basic Info, Contact, Address)
  - Select dropdown untuk business type
  - Support untuk semua field termasuk NPWP

- **edit.tsx**: Form untuk edit profil
  - Menampilkan data existing
  - Replace logo dengan preview
  - Button hapus profil dengan confirmation dialog
  - Update semua field

### 4. Routes
Routes yang ditambahkan di `routes/web.php`:
```php
Route::get('business-profile', [BusinessProfileController::class, 'index'])->name('business-profile.index');
Route::get('business-profile/create', [BusinessProfileController::class, 'create'])->name('business-profile.create');
Route::post('business-profile', [BusinessProfileController::class, 'store'])->name('business-profile.store');
Route::get('business-profile/edit', [BusinessProfileController::class, 'edit'])->name('business-profile.edit');
Route::post('business-profile/update', [BusinessProfileController::class, 'update'])->name('business-profile.update');
Route::delete('business-profile', [BusinessProfileController::class, 'destroy'])->name('business-profile.destroy');
```

### 5. Navigation
- Menu item ditambahkan di sidebar (`app-sidebar.tsx`)
- Icon: Building2 dari lucide-react
- Accessible untuk user role only
- Positioned antara "Hitung HPP" dan "Paket"

## Data Fields

### Required Fields
- `business_name`: Nama bisnis (required)

### Optional Fields
- `owner_name`: Nama pemilik
- `email`: Email bisnis
- `phone`: Nomor telepon
- `website`: Website URL
- `address`: Alamat lengkap
- `city`: Kota
- `state`: Provinsi
- `postal_code`: Kode pos
- `country`: Negara (default: Indonesia)
- `tax_number`: NPWP
- `business_type`: Jenis bisnis (retail, wholesale, service, etc.)
- `description`: Deskripsi bisnis
- `logo`: Logo bisnis (max 2MB, image only)

## Storage
- Logo disimpan di `storage/app/public/business-logos/`
- Symbolic link sudah dibuat dengan `php artisan storage:link`
- Logo accessible via `/storage/business-logos/filename.jpg`

## Business Types Supported
1. Retail
2. Wholesale
3. Jasa (Service)
4. Manufaktur (Manufacturing)
5. Makanan & Minuman (Food & Beverage)
6. Teknologi (Technology)
7. Lainnya (Other)

## UI/UX Features
- Card-based layout dengan sections
- Logo preview saat upload
- Form validation dengan error messages
- Responsive design (mobile-friendly)
- Empty state dengan call-to-action
- Confirmation dialog untuk delete
- Loading states saat processing

## Next Steps (untuk Invoice Generator)
Data business profile ini akan digunakan untuk:
1. Header invoice (logo + business info)
2. Footer invoice (contact info)
3. Branding pada dokumen lainnya
4. Email templates dengan business info

## Testing Checklist
✅ Database migration berhasil
✅ Model created dengan relations
✅ Controller dengan full CRUD
✅ Routes terintegrasi
✅ Frontend forms completed
✅ Storage link created
✅ Menu item added to sidebar
✅ Logo upload & delete working
✅ Validation implemented
✅ Empty state & error handling

## Status
**COMPLETED** ✅

Fitur Business Profile sudah lengkap dan siap digunakan!
