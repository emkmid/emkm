# 🚫 Cancel Subscription Feature - User Guide

## ✅ Feature Status: **READY TO USE**

User sekarang bisa membatalkan langganan dengan sistem **Grace Period** yang adil!

---

## 🎯 Konsep: Grace Period System

### **Apa itu Grace Period?**
Ketika user cancel subscription, mereka **tetap bisa pakai** sampai masa berlaku habis.

### **Kenapa ini Adil?**
- ✅ User sudah bayar → user harus dapat full period
- ✅ Tidak ada refund yang ribet
- ✅ User punya waktu untuk reconsider
- ✅ UX yang user-friendly

---

## 📊 Flow Cancel Subscription

```
User has Active Subscription
    ↓
User clicks "Batalkan Langganan"
    ↓
POST /subscriptions/cancel
    ↓
System Updates:
├─ status: tetap "active" ✅
├─ cancelled_at: current timestamp ⏰
└─ ends_at: tidak berubah 📅
    ↓
User gets response:
"Subscription berhasil dibatalkan.
 Anda masih dapat menggunakan fitur sampai 9 Feb 2026"
    ↓
User continues using features until ends_at
    ↓
Daily Cron (01:00 AM):
├─ Find: status='active' AND cancelled_at IS NOT NULL AND ends_at < now()
└─ Update: status='expired'
    ↓
Subscription Expired
└─ User cannot access paid features anymore
```

---

## 🎬 Skenario Penggunaan

### **Scenario 1: Cancel di Tengah Periode**

**Situasi:**
- User subscribe Pro 3 bulan: Rp 135.000
- Periode: 9 Nov 2025 - 9 Feb 2026
- User cancel di: 9 Des 2025 (1 bulan sudah berjalan)

**Hasil:**
```
✅ User masih bisa pakai Pro sampai 9 Feb 2026 (2 bulan lagi!)
✅ Status: active (cancelled_at: 9 Des 2025)
✅ Tidak ada refund
✅ Tidak auto-renew setelah expire
✅ Setelah 9 Feb 2026: status → expired
```

**User Experience:**
- User tidak rugi (dapat full 3 bulan yang sudah dibayar)
- User punya waktu 2 bulan untuk pindah ke paket lain atau export data
- Bisnis tetap dapat revenue penuh

---

### **Scenario 2: Cancel Lalu Upgrade**

**Situasi:**
- User punya Basic (cancelled, ends 9 Des 2025)
- User mau upgrade ke Pro

**Hasil:**
```
✅ Allowed! User bisa checkout Pro kapan saja
✅ Ketika Pro payment settled:
   ├─ Basic auto-cancelled (status → cancelled)
   └─ Pro activated
✅ Pro period mulai dari sekarang
```

---

### **Scenario 3: Cancel Free Package**

**Situasi:**
- User punya Free package (Rp 0)
- User mau cancel

**Hasil:**
```
❌ Tidak bisa cancel Free package
   (atau langsung expire tanpa grace period)
   
Alasan:
- Free package tidak ada pembayaran
- User bisa langsung upgrade ke paid package
```

---

## 💻 Technical Implementation

### **1. Controller Method**

```php
// app/Http/Controllers/SubscriptionController.php

public function cancel(Request $request)
{
    $subscription = Auth::user()->subscriptions()
        ->where('status', 'active')
        ->whereNull('cancelled_at')
        ->first();

    if (!$subscription) {
        return response()->json([
            'success' => false,
            'message' => 'Tidak ada subscription aktif yang bisa dibatalkan.',
        ], 400);
    }

    // Mark as cancelled but keep active until ends_at
    $subscription->update([
        'cancelled_at' => now(),
        // Status tetap 'active'
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Subscription berhasil dibatalkan. Anda masih dapat menggunakan fitur sampai ' . 
                     $subscription->ends_at->format('d M Y'),
    ]);
}
```

### **2. Cron Job (Daily)**

```php
// app/Console/Commands/ExpireCancelledSubscriptions.php

$subscriptions = Subscription::where('status', 'active')
    ->whereNotNull('cancelled_at')
    ->where('ends_at', '<', now())
    ->get();

foreach ($subscriptions as $subscription) {
    $subscription->update(['status' => 'expired']);
}
```

**Schedule:**
```php
// app/Console/Kernel.php

$schedule->command('subscriptions:expire-cancelled')
    ->daily()
    ->at('01:00');
```

### **3. Frontend Button**

```tsx
// Add cancel button to subscription page

{userSubscription && userSubscription.status === 'active' && !userSubscription.cancelled_at && (
    <button onClick={handleCancelSubscription}>
        Batalkan Langganan
    </button>
)}

// Show status if already cancelled
{userSubscription && userSubscription.cancelled_at && (
    <div className="alert alert-warning">
        Subscription akan berakhir pada {formatDate(userSubscription.ends_at)}
        <br />
        (Tidak akan auto-renew)
    </div>
)}
```

---

## 📋 Status Subscription

| Status | cancelled_at | Arti | User Bisa Pakai? | Auto-Renew? |
|--------|--------------|------|------------------|-------------|
| `active` | NULL | Normal aktif | ✅ Ya | ✅ Ya (jika recurring) |
| `active` | timestamp | Cancelled tapi masih grace period | ✅ Ya (sampai ends_at) | ❌ Tidak |
| `expired` | timestamp | Sudah berakhir | ❌ Tidak | ❌ Tidak |
| `pending` | NULL | Belum bayar | ❌ Tidak | ❌ Tidak |

---

## 🧪 Testing

### **Test Manual:**

1. **Create Active Subscription**
```bash
php artisan tinker

$user = User::first();
$package = Package::where('name', 'Basic')->first();

$sub = Subscription::create([
    'user_id' => $user->id,
    'package_id' => $package->id,
    'status' => 'active',
    'starts_at' => now(),
    'ends_at' => now()->addMonth(),
    // ...
]);
```

2. **Cancel Subscription**
```bash
# Via API:
POST /subscriptions/cancel

# Via Tinker:
$sub->update(['cancelled_at' => now()]);
```

3. **Verify Grace Period**
```bash
$sub->status; // should be "active"
$sub->cancelled_at; // should have timestamp
$sub->ends_at; // should be in future
```

4. **Test Auto-Expire**
```bash
# Manually set ends_at to past
$sub->update(['ends_at' => now()->subDay()]);

# Run command
php artisan subscriptions:expire-cancelled

# Check status
$sub->refresh();
$sub->status; // should be "expired"
```

---

## 🎨 UI/UX Recommendations

### **Halaman Subscription:**

```
┌─────────────────────────────────────────────┐
│  Paket Aktif: Basic                         │
│  ────────────────────────────────────────   │
│  Status: Aktif                              │
│  Berakhir: 9 Feb 2026                       │
│                                             │
│  [Upgrade Paket]  [Batalkan Langganan]     │
└─────────────────────────────────────────────┘
```

### **Setelah Cancel:**

```
┌─────────────────────────────────────────────┐
│  Paket Aktif: Basic                         │
│  ────────────────────────────────────────   │
│  Status: Akan Berakhir ⚠️                   │
│  Berakhir: 9 Feb 2026                       │
│  Tidak akan auto-renew                      │
│                                             │
│  [Aktifkan Kembali]  [Upgrade Paket]       │
└─────────────────────────────────────────────┘
```

### **Confirmation Dialog:**

```
┌────────────────────────────────────────────┐
│  Batalkan Langganan?                       │
├────────────────────────────────────────────┤
│  Anda masih dapat menggunakan fitur        │
│  Basic sampai 9 Feb 2026.                  │
│                                            │
│  Setelah itu, langganan tidak akan         │
│  diperpanjang otomatis.                    │
│                                            │
│  [Batal]           [Ya, Batalkan]         │
└────────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

### **1. Grace Period Adalah Default**
- Semua cancellation menggunakan grace period
- Tidak ada "immediate cancellation"
- Alasan: User sudah bayar, harus dapat full period

### **2. Free Package**
- Free package tidak perlu cancel
- User bisa langsung upgrade ke paid package
- Free akan auto-cancelled saat paid active

### **3. Refund Policy**
- Tidak ada auto-refund
- Jika user minta refund, handle manual di admin panel
- Bisa implementasikan prorate refund di masa depan

### **4. Reactivation**
- User bisa "reactivate" dengan cara:
  - Hapus `cancelled_at` (set NULL)
  - Atau biarkan expire lalu subscribe lagi

---

## 🚀 Next Steps (Optional Improvements)

### **1. Reactivation Feature**
```php
public function reactivate(Request $request)
{
    $subscription = Auth::user()->subscriptions()
        ->where('status', 'active')
        ->whereNotNull('cancelled_at')
        ->first();

    if ($subscription) {
        $subscription->update(['cancelled_at' => null]);
        return response()->json(['success' => true]);
    }
}
```

### **2. Prorate Refund**
- Calculate remaining days
- Refund proportional amount
- More complex but fairer

### **3. Survey on Cancel**
- Ask user why they cancel
- Collect feedback
- Offer discount to retain

### **4. Win-back Campaign**
- Email user before expiry
- Offer special discount
- Remind benefits

---

## 📞 Support

Jika ada pertanyaan tentang cancel subscription:
- Cek status di `cancelled_at` column
- Cek remaining days: `ends_at - now()`
- Manual expire: `php artisan subscriptions:expire-cancelled`
- Logs: `storage/logs/laravel.log`

---

**Feature Status:** ✅ Production Ready  
**Last Updated:** November 9, 2025  
**Version:** 1.0.0
