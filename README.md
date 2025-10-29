# E-MKM (UMKM)

**E-MKM (Electronic Mitra Kecil Menengah)** adalah platform web yang dirancang khusus untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) dalam memahami dan mengelola keuangan bisnis mereka dengan mudah.

## Project Information

- **Project Name:** E-MKM (KalkuUMKM)
- **Project Manager:** Sharla Nathania Madina

## Executive Summary

E-MKM hadir sebagai solusi digital yang fokus pada fungsi praktis dan edukatif, bertujuan menjadi mitra digital utama bagi UMKM Indonesia yang ingin naik kelas tanpa harus menguasai dunia akuntansi. Dengan tampilan antarmuka yang ramah pengguna dan aksesibilitas lintas perangkat, platform ini memberikan kemudahan sekaligus edukasi dalam pengelolaan keuangan.

## Vision & Objectives

- **Empowerment:** Memberdayakan UMKM melalui teknologi yang mudah diakses.
- **Efficiency:** Menyederhanakan proses keuangan agar pelaku usaha bisa fokus pada penjualan dan inovasi.
- **Inclusion:** Platform ini mendukung digitalisasi inklusif untuk seluruh pelaku UMKM Indonesia.

## Design Approach

### User Interface

- **Simplicity:** Desain antarmuka yang sederhana dan intuitif.
- **Accessibility:** Dapat digunakan di berbagai perangkat.

### Color Philosophy

- **Putih (Dasar):** Kesederhanaan & Kejelasan
- **Biru Muda (Aksen):** Kepercayaan & Profesionalisme
- **Toska (Elemen Penting):** Pertumbuhan & Inovasi
- **Oranye (Tombol/Highlight):** Semangat & Aksi

## Target User

Pelaku usaha mikro, kecil, dan menengah yang membutuhkan alat bantu keuangan digital yang:

- Mudah digunakan
- Tidak memerlukan keahlian akuntansi
- Dapat diakses dari berbagai perangkat

## Acknowledgement

Proyek ini merupakan kolaborasi lintas jurusan antara Informatika, Sistem Informasi, Akuntansi, dan Administrasi Bisnis yang diharapkan bisa berkontribusi nyata terhadap kemajuan UMKM dan peluang kerja mahasiswa.

## Setup & Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js & npm
- Database (SQLite, MySQL, PostgreSQL)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emkm
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Build Assets**
   ```bash
   npm run build
   ```

7. **Start the Application**
   ```bash
   php artisan serve
   ```

### Midtrans Payment Gateway Setup

E-MKM menggunakan Midtrans sebagai payment gateway untuk subscription. Ikuti langkah berikut untuk setup:

#### 1. Daftar Akun Midtrans

1. Kunjungi [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Daftar akun baru atau login jika sudah punya
3. Pilih environment Sandbox untuk development/testing

#### 2. Konfigurasi Environment Variables

Tambahkan konfigurasi berikut ke file `.env`:

```env
# Midtrans Payment Gateway Configuration
MIDTRANS_SERVER_KEY=SB-Mid-server-XXXXXXXXXXXXXXXXXXXX
MIDTRANS_CLIENT_KEY=SB-Mid-client-XXXXXXXXXXXXXXXXXXXX
MIDTRANS_IS_PRODUCTION=false
```

**Catatan:**
- Untuk **Sandbox/Development**: Gunakan `SB-Mid-server-` dan `SB-Mid-client-` keys
- Untuk **Production**: Gunakan production keys dan set `MIDTRANS_IS_PRODUCTION=true`
- Dapatkan keys dari Midtrans Dashboard → Settings → Access Keys

#### 3. Konfigurasi Webhook

1. Di Midtrans Dashboard, buka **Settings → Configuration**
2. Set **Payment Notification URL** ke:
   ```
   https://yourdomain.com/webhooks/midtrans
   ```
3. Pastikan webhook URL dapat diakses dari internet (gunakan ngrok untuk development lokal)

#### 4. Testing Payment

1. Jalankan aplikasi dan login sebagai user biasa
2. Akses halaman packages: `/dashboard/packages`
3. Klik "Subscribe" pada paket yang diinginkan
4. Akan diarahkan ke Midtrans Snap payment page
5. Gunakan kartu kredit test Midtrans untuk testing:
   - **Visa:** 4811 1111 1111 1114
   - **Mastercard:** 5211 1111 1111 1117
   - **CVV:** 123
   - **Expiry:** 01/25

#### 5. Production Deployment

Sebelum deploy ke production:

1. Ganti environment variables dengan production keys
2. Set `MIDTRANS_IS_PRODUCTION=true`
3. Update webhook URL ke domain production
4. Test dengan transaksi real (gunakan nominal kecil)

### Features Overview

- ✅ **User Management:** Registration, login, role-based access
- ✅ **Financial Management:** Income, expenses, debt, receivables tracking
- ✅ **Product Management:** Inventory and product catalog
- ✅ **Reporting:** Financial reports and analytics
- ✅ **Subscription System:** Midtrans payment integration
- ✅ **Education:** Articles and learning resources
- ✅ **Dashboard:** Visual analytics and insights

### Tech Stack

- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** React, Inertia.js, Tailwind CSS
- **Database:** SQLite/MySQL/PostgreSQL
- **Payment:** Midtrans Payment Gateway
- **Deployment:** Laravel Sail/Docker
