# 🚀 Quick Setup Guide - E-MKM Enhancements

## Step-by-Step Activation

### 1. Install Dependencies ✅ (Already Done)
```bash
npm install @radix-ui/react-progress
```

### 2. Run Artisan Commands
```bash
# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Test new commands
php artisan subscriptions:expire
php artisan subscriptions:remind
```

### 3. Configure Email (Required for Production)

Edit `.env` file:

**Option A - Gmail** (Easy for testing):
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password  # Use Gmail App Password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@emkm.com
MAIL_FROM_NAME="E-MKM"
```

**Option B - Mailtrap** (Development):
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
```

**Option C - Log** (Testing only):
```env
MAIL_MAILER=log
# Emails will be saved to storage/logs/laravel.log
```

### 4. Setup Cron Job (Production Only)

**Linux/Mac**:
```bash
crontab -e
# Add this line:
* * * * * cd /path/to/emkm && php artisan schedule:run >> /dev/null 2>&1
```

**Windows** (Task Scheduler):
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 00:00
4. Action: Start a program
5. Program: `php`
6. Arguments: `artisan schedule:run`
7. Start in: `D:\emkm`

**Development** (Manual):
```bash
# Run scheduler once per minute manually during development
php artisan schedule:work
```

### 5. Test Email Notifications

```bash
php artisan tinker
```

```php
// Test subscription activated email
$user = \App\Models\User::first();
$sub = $user->currentSubscription;
\Mail::to($user)->send(new \App\Mail\SubscriptionActivatedMail($sub));

// Test expiring reminder
\Mail::to($user)->send(new \App\Mail\SubscriptionExpiringMail($sub, 7));

// Test expired email
\Mail::to($user)->send(new \App\Mail\SubscriptionExpiredMail($sub));

// Check if email sent
// For log driver: tail -f storage/logs/laravel.log
```

### 6. Test Feature Limits

**Scenario 1 - Transaction Limits**:
1. Create new user or use existing Free user
2. Go to `/dashboard/expenses/create`
3. Create 50 expenses (Free limit)
4. Try to create 51st → Should show error
5. Check quota widget shows 50/50

**Scenario 2 - Customer Limits**:
1. Login as Free user
2. Go to `/dashboard/customers/create`
3. Should see "Upgrade required" message
4. Login as Basic user
5. Create 100 customers
6. Try 101st → Should show error

**Scenario 3 - Auto-Assign Free**:
1. Register new user at `/register`
2. After registration, check database:
```sql
SELECT * FROM subscriptions WHERE user_id = <new_user_id>;
-- Should have active Free subscription
```

### 7. Test Automation Commands

```bash
# Test expiry (dry run - won't actually expire)
php artisan subscriptions:expire

# Test reminders
php artisan subscriptions:remind

# Run scheduler manually
php artisan schedule:run
```

### 8. Build Frontend Assets

```bash
# Development
npm run dev

# Production
npm run build
```

### 9. Test UX Components

**QuotaWidget**:
- Go to dashboard
- Should see usage stats for transactions, invoices, customers
- Progress bars should show correctly
- Try reaching limit and see alert

**UpgradeModal**:
- When limit reached, upgrade modal should appear
- Click "Choose Basic" or "Choose Pro"
- Should redirect to packages page

### 10. Verify All Changes

**Checklist**:
- [ ] New users get Free package automatically
- [ ] Transaction limits enforced (Free: 50, Basic: 200, Pro: unlimited)
- [ ] Customer/Invoice features locked for Free users
- [ ] Email notifications work (test with log driver first)
- [ ] Console commands run without errors
- [ ] QuotaWidget displays on dashboard
- [ ] UpgradeModal appears when needed
- [ ] Rate limiting works on webhook (check logs)

---

## 🐛 Troubleshooting

### Issue: "Class 'Mail' not found"
```bash
composer dump-autoload
php artisan config:clear
```

### Issue: "View not found for mail"
```bash
php artisan view:clear
php artisan config:cache
```

### Issue: "Progress component not found"
```bash
npm install @radix-ui/react-progress
npm run build
```

### Issue: Schedule not running
```bash
# Check cron logs
tail -f /var/log/cron.log  # Linux
# or
php artisan schedule:work  # Run manually
```

### Issue: Email not sending
```bash
# Test mail configuration
php artisan tinker
```
```php
\Mail::raw('Test email', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

### Issue: Feature limits not working
```bash
# Clear feature service cache
php artisan cache:clear
php artisan config:clear

# Check if middleware is applied
php artisan route:list | grep feature
```

---

## 📊 Monitoring

### Check Scheduled Tasks Status
```bash
# View schedule
php artisan schedule:list

# Test single command
php artisan schedule:test

# Run schedule in foreground (see output)
php artisan schedule:work
```

### Check Email Queue
```bash
# If using queue for emails
php artisan queue:work

# Check failed jobs
php artisan queue:failed
```

### Check Logs
```bash
# Application logs
tail -f storage/logs/laravel.log

# Check for subscription events
grep "Subscription" storage/logs/laravel.log

# Check for email events
grep "Mail" storage/logs/laravel.log
```

---

## 🎉 You're All Set!

All enhancements are now active and ready to use. For detailed documentation, see `SYSTEM_ENHANCEMENTS_COMPLETE.md`.

**Questions?** Check the troubleshooting section above or review individual files for inline documentation.

