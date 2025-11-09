# 🚀 WEBHOOK TESTING - QUICK REFERENCE

## ⚡ Quick Start (3 Menit)

### Windows PowerShell
```powershell
# 1. Jalankan automation script
.\start-webhook-test.ps1

# URL webhook otomatis di-copy ke clipboard
# Paste di Midtrans Dashboard
```

### Git Bash / Linux
```bash
# 1. Make executable
chmod +x start-webhook-test.sh

# 2. Run script
./start-webhook-test.sh

# URL webhook otomatis di-copy ke clipboard
```

### Manual (Jika script gagal)
```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: ngrok
ngrok http 8000

# Copy URL dari output ngrok
# Tambahkan /webhooks/midtrans
```

---

## 📋 Checklist Cepat

### Setup Awal (Sekali saja)
- [ ] Install ngrok dari https://ngrok.com/download
- [ ] Daftar akun ngrok (gratis)
- [ ] Setup auth token: `ngrok config add-authtoken YOUR_TOKEN`

### Setiap Kali Testing
- [ ] Jalankan Laravel: `php artisan serve`
- [ ] Jalankan ngrok: `ngrok http 8000`
- [ ] Copy URL ngrok + `/webhooks/midtrans`
- [ ] Update di Midtrans Dashboard
- [ ] Test payment atau jalankan `test-webhook-local.php`

---

## 🎯 Testing Commands

### Test Webhook Manual
```bash
php test-webhook-local.php
```

### Monitor Logs Real-time
```bash
# Git Bash / Linux
tail -f storage/logs/laravel.log

# Windows PowerShell
Get-Content storage/logs/laravel.log -Wait -Tail 50
```

### Cek Database
```sql
-- Cek payment notifications
SELECT * FROM payment_notifications 
ORDER BY created_at DESC LIMIT 10;

-- Cek subscriptions terbaru
SELECT id, user_id, package_id, status, created_at, activated_at 
FROM subscriptions 
ORDER BY created_at DESC LIMIT 10;
```

---

## 🔗 URLs Penting

| Service | URL | Purpose |
|---------|-----|---------|
| Laravel | http://localhost:8000 | Local app |
| ngrok Inspector | http://localhost:4040 | Monitor webhooks |
| Midtrans Sandbox | https://dashboard.sandbox.midtrans.com | Configure webhook |
| Webhook Endpoint | `{ngrok-url}/webhooks/midtrans` | Paste di Midtrans |

---

## 💳 Test Payment Data (Midtrans Sandbox)

### Credit Card
```
Card Number : 4811 1111 1111 1114
CVV         : 123
Exp Date    : 01/25
OTP/3DS     : 112233
```

### Bank Transfer
- **BCA**: Auto-generate VA number
- **BNI**: Auto-generate VA number  
- **Mandiri**: Auto-generate Bill Payment

**Simulasi**: Klik tombol "Pay" di halaman Midtrans untuk simulasi pembayaran

---

## 🐛 Troubleshooting Cepat

### Laravel tidak bisa diakses
```bash
# Pastikan port 8000 free
netstat -ano | findstr :8000

# Kill process jika ada
taskkill /PID <PID> /F

# Restart Laravel
php artisan serve
```

### ngrok URL berubah
```bash
# Free plan: URL berubah setiap restart
# Solusi: Update di Midtrans Dashboard setiap restart

# Atau upgrade ke paid plan untuk static domain
```

### Webhook tidak terkirim
1. ✅ Cek ngrok masih running
2. ✅ Cek Laravel masih running  
3. ✅ Cek URL di Midtrans Dashboard benar
4. ✅ Cek logs: `tail -f storage/logs/laravel.log`
5. ✅ Cek ngrok inspector: http://localhost:4040

### Invalid Signature Error
```bash
# Cek .env
cat .env | grep MIDTRANS_SERVER_KEY

# Harus sama dengan di test file
# Pastikan tidak ada extra space/newline
```

---

## 📊 Expected Results

### Success Webhook (settlement)
```
✓ Status Code: 200
✓ Subscription status: active
✓ Payment notification logged
✓ activated_at filled
✓ expired_at calculated
```

### Pending Webhook
```
✓ Status Code: 200
✓ Subscription status: pending
✓ Waiting for payment
```

### Failed/Expired Webhook
```
✓ Status Code: 200
✓ Subscription status: expired/cancelled
✓ Payment cancelled
```

---

## 🔄 Workflow Lengkap

```
1. User checkout → Midtrans payment page
2. User bayar → Midtrans verify payment
3. Midtrans kirim webhook → ngrok → Laravel
4. Laravel verify signature → Process payment
5. Update subscription status → Activate service
6. Send notification → User notified
```

---

## 📞 Support Resources

- **Dokumentasi Lengkap**: `WEBHOOK_NGROK_GUIDE.md`
- **Laravel Logs**: `storage/logs/laravel.log`
- **ngrok Inspector**: http://localhost:4040
- **Midtrans Docs**: https://docs.midtrans.com/docs/http-notification

---

## ⚠️ Important Notes

1. **ngrok Free Plan**
   - URL berubah setiap restart
   - Max 40 connections/minute
   - Session 2 jam

2. **Production Deployment**
   - Gunakan domain tetap (bukan ngrok)
   - Setup SSL/HTTPS
   - Webhook URL di .env
   - Enable rate limiting

3. **Security**
   - Signature verification WAJIB
   - Log semua webhook
   - Prevent duplicate processing
   - Validate all input

---

**Last Updated**: November 2025
