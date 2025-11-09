# 🧰 Webhook Testing Tools

Kumpulan tools untuk memudahkan testing webhook payment gateway di local development dengan ngrok.

## 📁 File-file yang Tersedia

### 1. 📘 Dokumentasi

| File | Deskripsi |
|------|-----------|
| `WEBHOOK_NGROK_GUIDE.md` | Panduan lengkap step-by-step testing webhook dengan ngrok |
| `WEBHOOK_QUICK_REF.md` | Quick reference card untuk command dan troubleshooting |

### 2. 🚀 Automation Scripts

#### Windows PowerShell
```powershell
# File: start-webhook-test.ps1
.\start-webhook-test.ps1
```
**Fitur:**
- ✅ Auto-start Laravel server
- ✅ Auto-start ngrok tunnel
- ✅ Auto-copy webhook URL ke clipboard
- ✅ Auto-open browser tabs (ngrok inspector & Midtrans dashboard)
- ✅ Display URLs yang dibutuhkan

#### Linux / Git Bash
```bash
# File: start-webhook-test.sh
chmod +x start-webhook-test.sh
./start-webhook-test.sh
```
**Fitur:**
- ✅ Auto-start Laravel server
- ✅ Auto-start ngrok tunnel
- ✅ Auto-copy webhook URL ke clipboard (jika xclip/pbcopy/clip.exe tersedia)
- ✅ Display URLs yang dibutuhkan
- ✅ Cleanup on exit

### 3. 🧪 Testing Scripts

#### Test Webhook Simulator
```bash
# File: test-webhook-local.php
php test-webhook-local.php
```
**Fitur:**
- ✅ Auto-detect ngrok URL dari API
- ✅ Auto-load MIDTRANS_SERVER_KEY dari .env
- ✅ Interactive scenario selection
- ✅ Auto-generate valid signature
- ✅ Test scenarios: success, pending, expired

**Test Scenarios:**
1. **Success Settlement** - Simulasi pembayaran berhasil
2. **Pending** - Simulasi pembayaran pending
3. **Expired** - Simulasi pembayaran expired

### 4. 📊 Monitoring Tools

#### Webhook Monitor Dashboard
```bash
# File: monitor-webhook.sh
chmod +x monitor-webhook.sh
./monitor-webhook.sh
```
**Fitur:**
- ✅ Display webhook statistics
- ✅ Show recent webhooks dari database
- ✅ Show recent subscriptions
- ✅ Tail Laravel logs dengan syntax highlighting
- ✅ Interactive menu

---

## 🎯 Quick Start Guide

### Persiapan Awal (Sekali saja)

1. **Install ngrok**
   ```bash
   # Download dari https://ngrok.com/download
   # Extract dan tambahkan ke PATH
   ```

2. **Setup ngrok auth**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

3. **Cek .env sudah ada Midtrans keys**
   ```env
   MIDTRANS_SERVER_KEY=Mid-server-xxxxx
   MIDTRANS_CLIENT_KEY=Mid-client-xxxxx
   MIDTRANS_IS_PRODUCTION=false
   ```

### Testing Workflow

#### Cara 1: Menggunakan Automation Script (Recommended)

**Windows:**
```powershell
.\start-webhook-test.ps1
```

**Linux/Mac/Git Bash:**
```bash
./start-webhook-test.sh
```

Script akan otomatis:
1. Start Laravel server
2. Start ngrok tunnel
3. Copy webhook URL ke clipboard
4. Open browser tabs

Selanjutnya:
1. Paste URL di Midtrans Dashboard → Settings → Configuration
2. Test dengan `php test-webhook-local.php`
3. Atau test dengan payment real di browser

#### Cara 2: Manual

**Terminal 1 - Laravel:**
```bash
php artisan serve
```

**Terminal 2 - ngrok:**
```bash
ngrok http 8000
```

**Terminal 3 - Test:**
```bash
# Test webhook
php test-webhook-local.php

# Atau monitor logs
tail -f storage/logs/laravel.log
```

---

## 📝 Usage Examples

### Example 1: Full Test Flow

```bash
# 1. Start services (otomatis)
./start-webhook-test.sh

# 2. Di browser, paste webhook URL ke Midtrans Dashboard

# 3. Test webhook
php test-webhook-local.php
# Pilih: 1 (success_settlement)

# 4. Monitor hasil
./monitor-webhook.sh
# Pilih: 1 (Display statistics)
```

### Example 2: Test Multiple Scenarios

```bash
# Test success
php test-webhook-local.php
# Input: 1

# Test pending
php test-webhook-local.php
# Input: 2

# Test expired
php test-webhook-local.php
# Input: 3

# Cek hasilnya
./monitor-webhook.sh
# Pilih: 2 (Show recent webhooks)
```

### Example 3: Real Payment Test

```bash
# 1. Start services
./start-webhook-test.sh

# 2. Buka browser: http://localhost:8000/packages

# 3. Pilih package dan checkout

# 4. Gunakan test card Midtrans:
# Card: 4811 1111 1111 1114
# CVV: 123
# Exp: 01/25
# OTP: 112233

# 5. Monitor di terminal lain
./monitor-webhook.sh
# Pilih: 4 (Tail Laravel logs)
```

---

## 🔍 Monitoring & Debugging

### Monitor Webhook Activity

```bash
# Dashboard interaktif
./monitor-webhook.sh

# Atau manual query database
sqlite3 database/database.sqlite

SELECT * FROM payment_notifications 
ORDER BY created_at DESC 
LIMIT 10;
```

### Monitor Laravel Logs

```bash
# Linux/Mac/Git Bash
tail -f storage/logs/laravel.log

# Windows PowerShell
Get-Content storage/logs/laravel.log -Wait -Tail 50

# Atau gunakan monitor script
./monitor-webhook.sh
# Pilih: 4 (Tail Laravel logs)
```

### Monitor ngrok Traffic

Buka browser:
```
http://localhost:4040
```

Fitur:
- Inspect all HTTP requests
- Replay requests
- View request/response headers & body

---

## 🐛 Troubleshooting

### Problem: ngrok URL tidak terdeteksi

**Solusi:**
```bash
# Cek ngrok API
curl http://localhost:4040/api/tunnels

# Jika tidak ada output, restart ngrok
pkill ngrok
ngrok http 8000
```

### Problem: Invalid signature error

**Solusi:**
```bash
# Cek server key di .env
cat .env | grep MIDTRANS_SERVER_KEY

# Pastikan tidak ada extra space atau newline
# Restart Laravel setelah edit .env
php artisan config:clear
```

### Problem: Webhook tidak masuk

**Checklist:**
1. ✅ Laravel running: `curl http://localhost:8000`
2. ✅ ngrok running: `curl http://localhost:4040/api/tunnels`
3. ✅ URL correct di Midtrans: Check dashboard
4. ✅ Route exists: `php artisan route:list | grep webhook`

### Problem: Database locked

**Solusi:**
```bash
# Stop semua proses yang akses database
pkill php

# Restart Laravel
php artisan serve
```

---

## 📊 Expected Outputs

### Successful Test

```bash
$ php test-webhook-local.php

✓ Auto-detected ngrok URL: https://abc123.ngrok-free.app

Available test scenarios:
1. success_settlement - Pembayaran berhasil (Settlement)
2. pending - Pembayaran pending
3. expired - Pembayaran expired

Enter scenario number (1-3) [default: 1]: 1

========================================
TESTING WEBHOOK LOCALLY WITH NGROK
========================================
Scenario: success_settlement
Webhook URL: https://abc123.ngrok-free.app/webhooks/midtrans
Order ID: ORDER-1699520400
Transaction Status: settlement
========================================

Response Code: 200
Response Body:
{
    "status": "ok",
    "subscription_id": 123,
    "subscription_status": "active"
}

========================================
Test selesai!
Cek log Laravel di storage/logs/laravel.log
========================================
```

### Monitor Output

```bash
$ ./monitor-webhook.sh

========================================
   WEBHOOK MONITORING DASHBOARD
========================================

📊 Webhook Statistics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total webhooks today: 15
Processed: 14 | Unprocessed: 1
Active subscriptions: 8

📥 Recent Webhooks (Last 10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
order_id              provider   processed  received_at
ORDER-1699520400      midtrans   ✓          2025-11-09 14:30:25
ORDER-1699520350      midtrans   ✓          2025-11-09 14:28:15
```

---

## 🚀 Tips & Best Practices

### 1. Keep ngrok Running
```bash
# Gunakan screen atau tmux untuk persistent session
screen -S ngrok
ngrok http 8000
# CTRL+A+D untuk detach
```

### 2. Auto-restart on Change
```bash
# Install nodemon untuk auto-restart Laravel
npm install -g nodemon

# Run dengan auto-restart
nodemon --exec "php artisan serve" --watch app --watch routes
```

### 3. Log Rotation
```bash
# Prevent log files dari terlalu besar
# Edit config/logging.php
'daily' => [
    'driver' => 'daily',
    'path' => storage_path('logs/laravel.log'),
    'level' => 'debug',
    'days' => 14,
],
```

### 4. Database Backup Before Testing
```bash
# Backup database sebelum testing
cp database/database.sqlite database/database.sqlite.backup

# Restore jika perlu
cp database/database.sqlite.backup database/database.sqlite
```

---

## 📚 Additional Resources

- **Midtrans Documentation**: https://docs.midtrans.com/
- **ngrok Documentation**: https://ngrok.com/docs
- **Laravel Documentation**: https://laravel.com/docs

---

## 🎓 Learning Path

1. ✅ Read `WEBHOOK_NGROK_GUIDE.md` untuk understanding
2. ✅ Run automation script untuk quick setup
3. ✅ Test dengan `test-webhook-local.php`
4. ✅ Monitor dengan `monitor-webhook.sh`
5. ✅ Test real payment di browser
6. ✅ Debug dengan ngrok inspector dan Laravel logs
7. ✅ Review `WEBHOOK_QUICK_REF.md` untuk reference

---

**Last Updated**: November 2025

**Version**: 1.0.0
