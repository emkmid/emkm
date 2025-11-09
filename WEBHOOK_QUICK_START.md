# 🚀 Quick Start - Webhook Testing dengan ngrok

**Otomatis aktifkan subscription setelah pembayaran selesai**

## ⚡ Super Quick Start (5 Menit)

### Windows PowerShell
```powershell
# 1. Jalankan automation script
.\start-webhook-test.ps1

# 2. URL webhook otomatis di-copy, paste di:
# https://dashboard.sandbox.midtrans.com/settings/vtweb_configuration

# 3. Test
php test-webhook-local.php
```

### Git Bash / Linux
```bash
# 1. Jalankan automation script
chmod +x start-webhook-test.sh
./start-webhook-test.sh

# 2. URL webhook otomatis di-copy, paste di:
# https://dashboard.sandbox.midtrans.com/settings/vtweb_configuration

# 3. Test
php test-webhook-local.php
```

---

## 📋 Persiapan (Sekali Saja)

### 1. Install ngrok
```bash
# Download: https://ngrok.com/download
# Extract ke C:\ngrok atau folder lain
```

### 2. Setup ngrok Auth
```bash
# Daftar di: https://dashboard.ngrok.com/signup
# Copy token dari: https://dashboard.ngrok.com/get-started/your-authtoken

ngrok config add-authtoken YOUR_TOKEN_HERE
```

### 3. Cek .env
Pastikan ada:
```env
MIDTRANS_SERVER_KEY=Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxx
MIDTRANS_IS_PRODUCTION=false
```

✅ **Sudah siap!**

---

## 🧪 Testing

### Test 1: Simulasi Webhook
```bash
php test-webhook-local.php

# Pilih scenario:
# 1 = Success (subscription aktif)
# 2 = Pending (menunggu pembayaran)
# 3 = Expired (pembayaran gagal)
```

### Test 2: Payment Real (Sandbox)
```bash
# 1. Buka browser
http://localhost:8000/packages

# 2. Pilih package → Checkout

# 3. Gunakan test card:
Card Number : 4811 1111 1111 1114
CVV         : 123
Exp Date    : 01/25
OTP/3DS     : 112233

# 4. Subscription otomatis aktif!
```

---

## 📊 Monitoring

### Monitor Real-time
```bash
# Interactive dashboard
./monitor-webhook.sh

# Atau tail logs
tail -f storage/logs/laravel.log
```

### Cek Database
```bash
sqlite3 database/database.sqlite

# Cek webhooks
SELECT * FROM payment_notifications ORDER BY created_at DESC LIMIT 10;

# Cek subscriptions
SELECT id, user_id, status, activated_at FROM subscriptions ORDER BY created_at DESC LIMIT 10;
```

### ngrok Inspector
```
http://localhost:4040
```

---

## 📚 Dokumentasi Lengkap

| File | Deskripsi |
|------|-----------|
| `WEBHOOK_NGROK_GUIDE.md` | Panduan lengkap step-by-step |
| `WEBHOOK_QUICK_REF.md` | Quick reference & troubleshooting |
| `WEBHOOK_TESTING_TOOLS.md` | Penjelasan semua tools |

---

## ✅ Expected Result

Setelah pembayaran selesai:
- ✅ Webhook otomatis terkirim ke aplikasi
- ✅ Signature diverifikasi
- ✅ Subscription status → `active`
- ✅ `activated_at` terisi
- ✅ `expired_at` dihitung otomatis
- ✅ Email notifikasi terkirim (jika configured)

---

## 🐛 Troubleshooting

**ngrok URL berubah?**
- Free plan: URL berubah tiap restart
- Update di Midtrans Dashboard setiap restart

**Webhook tidak masuk?**
```bash
# Cek Laravel running
curl http://localhost:8000

# Cek ngrok running
curl http://localhost:4040/api/tunnels

# Cek route exists
php artisan route:list | grep webhook
```

**Invalid signature?**
```bash
# Clear cache
php artisan config:clear

# Cek server key
cat .env | grep MIDTRANS_SERVER_KEY
```

---

## 🎯 Next Steps

1. ✅ Test di local dengan ngrok (SEKARANG)
2. ✅ Deploy ke staging server
3. ✅ Test di staging environment  
4. ✅ Deploy ke production
5. ✅ Update webhook URL production di Midtrans

---

**Happy Testing! 🚀**

Need help? Check `WEBHOOK_NGROK_GUIDE.md` untuk panduan lengkap.
