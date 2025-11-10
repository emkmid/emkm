# Fix Audit Logs Issue - auditable_id Type Mismatch

## Masalah

Ketika menambahkan produk baru atau transaksi baru, muncul error:

```
SQLSTATE[22007]: Invalid datetime format: 1366 Incorrect integer value: 'R5Qxj7L469' 
for column `u142294772_emkm`.`audit_logs`.`auditable_id` at row 1
```

### Penyebab

- Kolom `auditable_id` di tabel `audit_logs` memiliki tipe data `BIGINT UNSIGNED`
- Model `Product`, `Income`, `Expense`, dan `Debt` menggunakan **Hashids** yang menghasilkan ID berbentuk string (contoh: 'R5Qxj7L469')
- Ketika sistem audit mencoba menyimpan string ID ke kolom integer, terjadi error

### Model yang Terpengaruh

1. **Product** - menggunakan Hashids
2. **Income** - menggunakan Hashids  
3. **Expense** - menggunakan Hashids
4. **Debt** - menggunakan Hashids

## Solusi

### Opsi 1: Jalankan SQL Langsung di Production Database (RECOMMENDED - PALING CEPAT)

Jalankan query SQL berikut di phpMyAdmin atau MySQL client production:

```sql
ALTER TABLE audit_logs MODIFY COLUMN auditable_id VARCHAR(255);
```

**Keuntungan:**
- ✅ Cepat dan langsung
- ✅ Tidak perlu deploy ulang
- ✅ Tidak ada downtime
- ✅ Tidak mempengaruhi data yang sudah ada

**Cara:**
1. Login ke cPanel hosting production
2. Buka phpMyAdmin
3. Pilih database `u142294772_emkm`
4. Buka tab SQL
5. Paste dan jalankan query di atas
6. Selesai!

### Opsi 2: Jalankan Migration di Production

Jika Anda punya akses SSH ke production server:

```bash
# SSH ke server production
ssh user@your-server

# Masuk ke direktori project
cd /path/to/emkm

# Jalankan migration
php artisan migrate
```

Migration yang sudah disiapkan: `2025_11_10_072454_alter_audit_logs_auditable_id_to_string.php`

## Verifikasi Setelah Fix

Setelah menjalankan salah satu opsi di atas:

1. **Coba tambah produk baru** - seharusnya berhasil tanpa error
2. **Coba input transaksi baru** - seharusnya berhasil tanpa error
3. **Periksa audit logs** - data audit seharusnya tersimpan dengan benar

Anda bisa verifikasi di database dengan query:

```sql
-- Cek tipe data kolom auditable_id
DESCRIBE audit_logs;

-- Seharusnya menampilkan:
-- Field: auditable_id
-- Type: varchar(255)

-- Cek data audit logs terbaru
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5;
```

## File yang Sudah Diperbaiki

1. ✅ `database/migrations/2025_11_10_072454_alter_audit_logs_auditable_id_to_string.php`
   - Migration untuk mengubah tipe kolom dari `BIGINT` ke `VARCHAR(255)`
   - Support untuk MySQL dan SQLite

2. ✅ `fix_audit_logs_column.sql`
   - SQL script siap pakai untuk production
   - Bisa dijalankan langsung di phpMyAdmin

## Catatan Penting

- ⚠️ **Perubahan ini AMAN** untuk data yang sudah ada
- ⚠️ Data audit logs dengan ID integer akan tetap berfungsi normal
- ⚠️ Perubahan ini diperlukan karena sistem menggunakan Hashids untuk beberapa model
- ✅ Tidak ada data yang akan hilang
- ✅ Index pada kolom ini tetap berfungsi normal

## Testing di Local (Optional)

Jika ingin test di environment local terlebih dahulu:

```bash
# Rollback migration (optional)
php artisan migrate:rollback --step=1

# Jalankan migration lagi
php artisan migrate

# Test tambah produk
# Test input transaksi
```

## Follow-up Actions

Setelah fix ini diterapkan:

1. ✅ Monitor error logs untuk memastikan tidak ada error serupa
2. ✅ Test semua fitur yang menggunakan audit trail:
   - Create/Update/Delete Product
   - Create/Update/Delete Transaction (Income, Expense)
   - Create/Update/Delete Debt
3. ✅ Pastikan audit logs tersimpan dengan benar

## Kontak Support

Jika masih ada masalah setelah menjalankan fix ini, hubungi developer dengan informasi:
- Screenshot error (jika masih terjadi)
- Query `DESCRIBE audit_logs` dari database production
- Sample data dari `audit_logs` terbaru
