# 🚀 Panduan Testing Webhook dengan ngrok

Panduan lengkap testing webhook payment Midtrans di localhost menggunakan ngrok.

---

## 📋 Tahapan Testing

### 1️⃣ Install ngrok

#### Cara 1: Manual Download (Recommended untuk Windows)

```bash
# Download dari website
# 1. Buka https://ngrok.com/download
# 2. Pilih Windows (64-bit)
# 3. Extract file zip ke folder (contoh: C:\ngrok)
# 4. (Opsional) Tambahkan ke PATH environment variable
```

#### Cara 2: Via Chocolatey

```bash
choco install ngrok
```

#### Cara 3: Via Scoop

```bash
scoop bucket add extras
scoop install ngrok
```

---

### 2️⃣ Setup ngrok Account & Auth Token

1. **Daftar Akun (Gratis)**
   - Kunjungi: https://dashboard.ngrok.com/signup
   - Daftar dengan email atau Google/GitHub

2. **Dapatkan Auth Token**
   - Login ke: https://dashboard.ngrok.com/get-started/your-authtoken
   - Copy token yang tersedia

3. **Setup Auth Token di Terminal**

```bash
# Jalankan command ini (hanya sekali)
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

**Contoh:**
```bash
ngrok config add-authtoken 2hKj8d9fNm1pQwE3rTy4uVb5nCx6
```

---

### 3️⃣ Jalankan Laravel Development Server

```bash
# Terminal 1 - Jalankan Laravel
cd d:/emkm
php artisan serve

# Output:
# Server started on http://127.0.0.1:8000
```

**Pastikan Laravel berjalan di port 8000** ✅

---

### 4️⃣ Jalankan ngrok Tunnel

```bash
# Terminal 2 - Jalankan ngrok
ngrok http 8000
```

**Output yang akan muncul:**

```
ngrok                                                                    

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.5.0
Region                        Asia Pacific (ap)
Latency                       50ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123xyz.ngrok-free.app -> http://localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

✅ **Copy URL ngrok Anda**: `https://abc123xyz.ngrok-free.app`

---

### 5️⃣ Setup Webhook di Dashboard Midtrans

1. **Login ke Midtrans Dashboard**
   - Sandbox: https://dashboard.sandbox.midtrans.com/
   - Production: https://dashboard.midtrans.com/

2. **Navigasi ke Settings**
   - Klik **Settings** → **Configuration**
   - Scroll ke bagian **Payment Notification URL**

3. **Input Webhook URL**

```
https://YOUR-NGROK-URL.ngrok-free.app/webhooks/midtrans
```

**Contoh:**
```
https://abc123xyz.ngrok-free.app/webhooks/midtrans
```

4. **Klik Save** ✅

---

### 6️⃣ Monitor Webhook dengan ngrok Web Interface

Buka di browser:
```
http://127.0.0.1:4040
```

**Fitur Web Interface:**
- ✅ Lihat semua request masuk
- ✅ Inspect payload webhook
- ✅ Replay request
- ✅ Response status

---

### 7️⃣ Test Webhook

#### Opsi A: Simulasi dari File PHP

```bash
# Edit file test-webhook-local.php
# 1. Ganti YOUR-NGROK-URL dengan URL ngrok Anda
# 2. Ganti YOUR_MIDTRANS_SERVER_KEY dengan server key dari .env

# Jalankan test
php test-webhook-local.php
```

#### Opsi B: Test dengan Payment Real (Sandbox)

1. **Buat Transaksi Test**
   ```bash
   # Akses halaman subscription
   http://localhost:8000/packages
   ```

2. **Pilih Package & Checkout**

3. **Gunakan Test Payment Midtrans**
   
   **Test Credit Card:**
   - Card Number: `4811 1111 1111 1114`
   - CVV: `123`
   - Exp: `01/25`
   - OTP: `112233`

   **Test Bank Transfer:**
   - Pilih bank (BCA/BNI/Mandiri)
   - Akan mendapat virtual account
   - Klik "Pay" di simulator Midtrans

4. **Webhook Otomatis Terkirim**
   - Cek di ngrok web interface: `http://127.0.0.1:4040`
   - Cek log Laravel: `storage/logs/laravel.log`

---

### 8️⃣ Monitor dan Debug

#### A. Lihat Request di ngrok Web Interface

```
http://127.0.0.1:4040/inspect/http
```

Anda bisa melihat:
- Request headers
- Request body (webhook payload)
- Response status
- Response body

#### B. Cek Log Laravel

```bash
# Windows (bash)
tail -f storage/logs/laravel.log

# Atau buka file langsung
storage/logs/laravel.log
```

#### C. Cek Database

```bash
# Masuk ke MySQL/PostgreSQL
mysql -u root -p

# Cek payment_notifications
SELECT * FROM payment_notifications ORDER BY created_at DESC LIMIT 10;

# Cek subscriptions
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 10;
```

---

## 🔧 Troubleshooting

### Issue 1: "Failed to complete tunnel connection"

**Solusi:**
```bash
# Pastikan tidak ada proses ngrok lain yang running
taskkill /F /IM ngrok.exe

# Jalankan ulang ngrok
ngrok http 8000
```

### Issue 2: "Invalid signature" di webhook

**Penyebab:** Server key tidak match

**Solusi:**
```bash
# Cek .env file
cat .env | grep MIDTRANS_SERVER_KEY

# Pastikan sama dengan yang di test-webhook-local.php
```

### Issue 3: Webhook tidak terkirim dari Midtrans

**Checklist:**
- ✅ URL ngrok masih aktif (cek terminal ngrok)
- ✅ URL webhook sudah save di dashboard Midtrans
- ✅ Laravel server masih running
- ✅ Route webhook sudah benar: `/webhooks/midtrans`

### Issue 4: "403 Forbidden" dari ngrok

**Penyebab:** ngrok free memblokir beberapa browser

**Solusi:**
```bash
# Tambahkan header di request
# Atau upgrade ke ngrok paid plan
```

---

## 📊 Test Scenarios

### Scenario 1: Settlement (Success)

```json
{
  "transaction_status": "settlement",
  "order_id": "ORDER-123456",
  "gross_amount": "100000.00",
  "payment_type": "bank_transfer"
}
```

**Expected Result:**
- ✅ Subscription status: `active`
- ✅ Payment notification logged
- ✅ Email notifikasi terkirim

### Scenario 2: Pending

```json
{
  "transaction_status": "pending",
  "order_id": "ORDER-123456",
  "gross_amount": "100000.00"
}
```

**Expected Result:**
- ✅ Subscription status: `pending`
- ✅ Menunggu pembayaran

### Scenario 3: Expire

```json
{
  "transaction_status": "expire",
  "order_id": "ORDER-123456"
}
```

**Expected Result:**
- ✅ Subscription status: `expired`
- ✅ Payment dibatalkan

---

## 🎯 Commands Cheat Sheet

```bash
# 1. Jalankan Laravel
php artisan serve

# 2. Jalankan ngrok (di terminal berbeda)
ngrok http 8000

# 3. Test webhook manual
php test-webhook-local.php

# 4. Monitor log Laravel
tail -f storage/logs/laravel.log

# 5. Clear cache Laravel (jika ada error)
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# 6. Lihat routes
php artisan route:list | grep webhook
```

---

## 📱 Tools Tambahan

### 1. ngrok Web Dashboard
```
http://127.0.0.1:4040
```

### 2. Laravel Telescope (Opsional)

```bash
# Install Telescope untuk monitoring
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Akses dashboard
http://localhost:8000/telescope
```

### 3. Postman Collection

Import collection untuk test webhook manual:

```json
{
  "name": "Midtrans Webhook Test",
  "request": {
    "method": "POST",
    "url": "https://YOUR-NGROK-URL.ngrok-free.app/webhooks/midtrans",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"order_id\": \"ORDER-123\",\n  \"status_code\": \"200\",\n  \"gross_amount\": \"100000.00\",\n  \"transaction_status\": \"settlement\",\n  \"signature_key\": \"GENERATED_SIGNATURE\"\n}"
    }
  }
}
```

---

## ⚠️ Important Notes

1. **ngrok URL berubah setiap restart** (free plan)
   - Harus update URL di Midtrans dashboard setiap kali restart ngrok
   - Solusi: Gunakan ngrok paid plan untuk fixed domain

2. **Rate Limiting**
   - Free plan: 40 connections/minute
   - Cukup untuk testing

3. **Session Timeout**
   - Free plan: 2 jam
   - Setelah itu harus restart ngrok

4. **Security**
   - Jangan expose credentials di log
   - Gunakan .env untuk sensitive data
   - Pastikan signature verification aktif

---

## 🎓 Next Steps

Setelah testing sukses di local:

1. ✅ Deploy ke staging server
2. ✅ Update webhook URL ke server staging
3. ✅ Test di staging environment
4. ✅ Deploy ke production
5. ✅ Update webhook URL ke production URL
6. ✅ Monitor production webhooks

---

## 📞 Support

Jika ada masalah:
- Cek log: `storage/logs/laravel.log`
- Cek ngrok inspector: `http://127.0.0.1:4040`
- Cek Midtrans dashboard logs

---

**Happy Testing! 🚀**
