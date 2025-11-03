# Implementasi Midtrans Payment Gateway untuk Subscription

## Overview
Implementasi payment gateway Midtrans untuk sistem berlangganan (subscription) pada aplikasi Laravel dengan frontend React/Inertia.js.

## Fitur yang Sudah Diimplementasikan

### 1. Backend Components

#### Services
- **`MidtransService`** (`app/Services/MidtransService.php`)
  - Membuat payment subscription
  - Memproses webhook notification
  - Mengelola aktivasi subscription
  - Cek subscription yang akan expired

#### Controllers
- **`SubscriptionController`** (`app/Http/Controllers/SubscriptionController.php`)
  - Menampilkan packages
  - Membuat checkout session
  - Handle callback success/error/pending
  - History subscription
  - Cancel subscription

- **`MidtransWebhookController`** (`app/Http/Controllers/MidtransWebhookController.php`)
  - Handle webhook dari Midtrans
  - Verifikasi signature
  - Update status subscription

#### Models
- **`Package`** - Support multiple duration options dan discount
- **`Subscription`** - Dengan field Midtrans
- **`PaymentNotification`** - Record webhook notifications

### 2. Database Schema

#### Packages Table
```sql
- duration_options (JSON) - ['1_month', '3_months', '6_months', '1_year']
- discount_percentage (DECIMAL) - Additional discount
- is_popular (BOOLEAN) - Mark popular packages
```

#### Subscriptions Table
```sql
- midtrans_order_id (STRING)
- midtrans_transaction_id (STRING) 
- midtrans_payment_type (STRING)
- status (ENUM: pending, active, expired, cancelled)
```

### 3. Frontend Components

#### Pages
- **`Subscription/Index.tsx`** - Halaman pilih paket
- **`Subscription/Success.tsx`** - Halaman sukses pembayaran
- **`Subscription/Error.tsx`** - Halaman error pembayaran
- **`Subscription/Pending.tsx`** - Halaman pending pembayaran
- **`Subscription/History.tsx`** - History subscription user

### 4. Routes

```php
// Subscription routes
GET /packages - List packages
POST /subscriptions/checkout - Create payment
GET /subscriptions/success - Payment success page
GET /subscriptions/error - Payment error page
GET /subscriptions/pending - Payment pending page
GET /subscriptions/history - User subscription history
POST /subscriptions/cancel - Cancel subscription

// Webhook routes
POST /webhooks/midtrans - Midtrans notification handler
```

### 5. Scheduled Jobs

```php
// app/Console/Commands/CheckSubscriptions.php
php artisan subscriptions:check

// Scheduled daily in Kernel.php
$schedule->command('subscriptions:check')->daily();
```

## Setup Instructions

### 1. Environment Configuration

Tambahkan ke `.env`:
```env
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true
```

### 2. Midtrans Dashboard Setup

1. Buat akun di [Midtrans Dashboard](https://dashboard.midtrans.com)
2. Dapatkan Server Key dan Client Key
3. Setup Notification URL: `https://yourdomain.com/webhooks/midtrans`
4. Enable payment methods yang diinginkan

### 3. Database Migration

```bash
php artisan migrate
php artisan db:seed --class=PackageSeeder
```

### 4. Webhook Configuration

Pastikan webhook URL dapat diakses public. Untuk development, gunakan ngrok:

```bash
ngrok http 8000
```

Kemudian update notification URL di Midtrans dashboard dengan URL ngrok.

## Payment Flow

### 1. User Flow
1. User memilih package dan duration
2. Klik "Berlangganan" 
3. Frontend call `/subscriptions/checkout`
4. Backend buat Midtrans Snap token
5. Frontend tampilkan Midtrans Snap popup
6. User melakukan pembayaran
7. Redirect ke success/error/pending page

### 2. Webhook Flow
1. Midtrans kirim notification ke `/webhooks/midtrans`
2. Webhook controller verifikasi signature
3. Update status subscription berdasarkan status payment
4. Send notification ke user (optional)

## Testing

### 1. Test API Endpoints

```bash
# Test packages
curl -X GET "http://localhost:8000/packages" -H "Accept: application/json"

# Test Midtrans config
curl -X GET "http://localhost:8000/test-midtrans" -H "Accept: application/json"
```

### 2. Test Payment (Sandbox)

Gunakan test cards dari [Midtrans Testing](https://docs.midtrans.com/en/technical-reference/sandbox-test):

- **Success**: 4811111111111114
- **Failure**: 4911111111111113  
- **Challenge**: 4411111111111118

### 3. Test Webhook

Gunakan ngrok untuk expose localhost:

```bash
ngrok http 8000
# Update webhook URL di Midtrans dashboard
```

## Monitoring & Maintenance

### 1. Logs
- Webhook notifications: `storage/logs/laravel.log`
- Payment notifications stored in `payment_notifications` table

### 2. Subscription Management
- Daily check for expired subscriptions
- Email notifications untuk subscription yang akan expired
- Admin panel untuk manage subscriptions

### 3. Error Handling
- Signature verification untuk webhook
- Idempotency check untuk avoid duplicate processing
- Graceful error handling di frontend

## Security Considerations

1. **Webhook Signature Verification** - Semua webhook diverifikasi signature-nya
2. **CSRF Protection** - Frontend menggunakan CSRF token
3. **Input Validation** - Semua input divalidasi
4. **Environment Variables** - Sensitive data disimpan di .env
5. **HTTPS Required** - Production harus menggunakan HTTPS

## Customization Options

### 1. Payment Methods
Edit `enabled_payments` di `SubscriptionController::createCheckout()`:

```php
'enabled_payments' => [
    'dana', 'gopay', 'ovo', 'shopeepay', 'linkaja',
    'credit_card', 'permata_va', 'bca_va', 'bni_va', 'bri_va'
]
```

### 2. Duration & Pricing
Update `PackageSeeder` untuk menambah/edit packages dan duration options.

### 3. Discount Logic
Modify `Package::calculatePrice()` untuk custom discount logic.

### 4. Notification Templates
Customize email templates di `resources/views/emails/`.

## Troubleshooting

### Common Issues

1. **Webhook tidak terpanggil**
   - Pastikan URL public accessible
   - Check Midtrans dashboard notification URL
   - Verify ngrok atau domain configuration

2. **Signature verification failed**
   - Pastikan `MIDTRANS_SERVER_KEY` benar
   - Check webhook payload format

3. **Payment tidak update status**
   - Check logs untuk error pada webhook processing
   - Verify payment notification table

4. **Frontend error saat payment**
   - Pastikan `MIDTRANS_CLIENT_KEY` benar
   - Check browser console untuk error Snap.js

### Debug Commands

```bash
# Check logs
tail -f storage/logs/laravel.log

# Check subscriptions
php artisan tinker
>>> App\Models\Subscription::latest()->get()

# Check payment notifications  
>>> App\Models\PaymentNotification::latest()->get()

# Manual subscription check
php artisan subscriptions:check
```

## Next Steps / Improvements

1. **Recurring Payment** - Implement auto-renewal
2. **Proration** - Handle upgrade/downgrade mid-cycle
3. **Invoice Generation** - Generate PDF invoices
4. **Advanced Analytics** - Payment analytics dashboard
5. **Multi-tenancy** - Support untuk multiple merchants
6. **Mobile App** - Mobile SDK integration