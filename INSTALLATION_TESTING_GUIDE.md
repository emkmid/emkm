# 🚀 Quick Installation & Testing Guide

## Prerequisites
✅ PHP 8.2+
✅ Composer
✅ Node.js & npm
✅ Laravel 12 installed
✅ Database configured (SQLite/MySQL)

---

## Installation Steps

### 1. Run Migrations
Jalankan semua migration yang baru ditambahkan:

```bash
php artisan migrate
```

Expected output:
```
✓ 2025_11_05_045149_create_backups_table
✓ 2025_11_05_045459_create_audit_logs_table
✓ 2025_11_05_050000_create_user_notifications_table
✓ 2025_11_05_050407_create_business_profiles_table
```

### 2. Create Storage Link
Untuk upload logo business profile:

```bash
php artisan storage:link
```

Expected output:
```
The [public/storage] link has been connected to [storage/app/public]
```

### 3. Set Permissions (Linux/Mac only)
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### 4. Install Frontend Dependencies (if needed)
```bash
npm install
```

### 5. Build Frontend
```bash
npm run build
# or for development:
npm run dev
```

---

## Testing Each Feature

### 🔧 1. Test Backup System

**Access**: Admin only

1. Login sebagai admin
2. Navigate to: `/admin/backups`
3. Click "Create Backup"
4. Verify backup file created in `storage/app/backups/`
5. Test download backup
6. Test restore (optional - hati-hati di production!)

**Expected Result**:
- Backup file created successfully
- File can be downloaded
- Backup record saved in database

---

### 📝 2. Test Audit Logging

**Access**: Admin only

1. Login sebagai user biasa
2. Create/Update/Delete any:
   - Product
   - Expense
   - Income
3. Logout dan login sebagai admin
4. Navigate to: `/admin/audit-logs`
5. Verify semua aktivitas tercatat

**Expected Result**:
- Semua CRUD operations logged
- Old values & new values saved
- User info, IP, timestamp recorded

**Try filters**:
- Filter by event (created/updated/deleted)
- Filter by date range
- Search by model type

---

### 🔔 3. Test User Notifications

**Access**: All users

**Test as User**:
1. Login sebagai user
2. Navigate to: `/notifications`
3. Check notification badge di header (should show unread count)
4. Click notification to mark as read
5. Test "Mark all as read"
6. Test delete notification

**Test as Admin** (Create notification):
1. Login sebagai admin
2. Navigate to: `/admin/notifications/create`
3. Create test notification
4. Select target users
5. Submit
6. Verify users receive notifications

**Expected Result**:
- Notifications appear in notification center
- Badge count updates in real-time
- Read/unread status works
- Delete functionality works

---

### 🏢 4. Test Business Profile

**Access**: User only

**Test Create Profile**:
1. Login sebagai user
2. Navigate to: `/business-profile`
3. Click "Buat Profil Bisnis"
4. Fill form:
   - Business name (required)
   - Upload logo (try PNG/JPG, max 2MB)
   - Fill contact info
   - Fill address
   - Select business type
5. Submit

**Expected Result**:
- Profile created successfully
- Logo uploaded and displayed
- Redirect to profile view page

**Test Edit Profile**:
1. From profile page, click "Edit Profil"
2. Change some fields
3. Upload new logo (optional)
4. Submit

**Expected Result**:
- Profile updated
- Old logo deleted if new uploaded
- Changes reflected in view

**Test Delete Profile**:
1. Click "Hapus Profil" button
2. Confirm deletion
3. Verify redirect to empty state

**Expected Result**:
- Profile deleted
- Logo file deleted from storage
- Empty state shown

---

## Verification Checklist

### Database Tables
Check if tables exist:
```bash
php artisan tinker
>>> DB::select("SELECT name FROM sqlite_master WHERE type='table'");
# or for MySQL:
>>> DB::select("SHOW TABLES");
```

Expected tables:
- ✅ `backups`
- ✅ `audit_logs`
- ✅ `user_notifications`
- ✅ `business_profiles`

### Storage Directories
Check if directories exist:
```bash
ls -la storage/app/
```

Expected:
- ✅ `backups/` (for database backups)
- ✅ `public/` (for uploaded files)
- ✅ `public/business-logos/` (created automatically on first upload)

### Symbolic Link
```bash
ls -la public/storage
```

Expected: Should be symlink to `../storage/app/public`

### Routes
Check routes registered:
```bash
php artisan route:list | grep -E "business-profile|notifications|audit-logs|backups"
```

Expected routes:
```
GET    /business-profile
GET    /business-profile/create
POST   /business-profile
GET    /business-profile/edit
POST   /business-profile/update
DELETE /business-profile
GET    /notifications
POST   /notifications/{id}/mark-read
DELETE /notifications/{id}
GET    /admin/audit-logs
GET    /admin/backups
POST   /admin/backups
...
```

---

## Common Issues & Solutions

### Issue 1: Storage Link Error
**Error**: "The [public/storage] directory already exists"

**Solution**:
```bash
rm public/storage
php artisan storage:link
```

### Issue 2: Logo Not Showing
**Symptoms**: Upload success but image not displayed

**Solution**:
1. Check storage link exists: `ls -la public/storage`
2. Check file uploaded: `ls storage/app/public/business-logos/`
3. Check `.env` has correct `APP_URL`
4. Verify file permissions

### Issue 3: Migration Already Exists
**Error**: "Migration already exists"

**Solution**: Skip if already run, or rollback:
```bash
php artisan migrate:rollback --step=1
php artisan migrate
```

### Issue 4: Audit Logs Not Working
**Symptoms**: No logs created when creating/updating models

**Solution**:
1. Verify model uses `Auditable` trait
2. Check model in `$auditableModels` list
3. Clear cache: `php artisan cache:clear`

### Issue 5: Frontend Not Updated
**Symptoms**: Changes not reflected in browser

**Solution**:
```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild frontend
npm run build
```

---

## Performance Testing

### Test Backup Speed
```bash
time php artisan backup:create
```

Expected: < 5 seconds for small databases

### Test Audit Log Query
```bash
php artisan tinker
>>> $logs = AuditLog::with('user')->latest()->take(100)->get();
>>> count($logs);
```

Expected: Fast query with eager loading

### Test Notification Queries
```bash
php artisan tinker
>>> $user = User::first();
>>> $user->notifications()->unread()->count();
>>> $user->notifications()->latest()->take(20)->get();
```

Expected: Fast queries with indexes

---

## Security Verification

### File Upload Security
✅ Logo max size: 2MB
✅ Allowed types: image/* only
✅ Files stored outside public folder
✅ Unique filenames (hash)

### Access Control
✅ Backup: Admin only
✅ Audit Logs: Admin only
✅ Notifications: Own notifications only
✅ Business Profile: Own profile only

### Data Validation
✅ All inputs validated
✅ CSRF protection enabled
✅ XSS prevention (Inertia auto-escapes)
✅ SQL injection prevented (Eloquent ORM)

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Run all migrations
- [ ] Create storage link
- [ ] Set correct file permissions
- [ ] Configure APP_URL in .env
- [ ] Build frontend assets (`npm run build`)
- [ ] Test backup creation & restore
- [ ] Test all features as different user roles
- [ ] Verify audit logging working
- [ ] Check notification delivery
- [ ] Test business profile CRUD
- [ ] Monitor error logs
- [ ] Set up automated backups (cron)
- [ ] Configure email for notifications (optional)

---

## Monitoring & Maintenance

### Check Backup Status
```bash
# List all backups
ls -lh storage/app/backups/

# Check backup table
php artisan tinker
>>> Backup::orderBy('created_at', 'desc')->take(10)->get(['filename', 'size', 'created_at']);
```

### Monitor Audit Logs
```bash
# Recent activities
php artisan tinker
>>> AuditLog::with('user')->latest()->take(20)->get(['event', 'auditable_type', 'user_id', 'created_at']);
```

### Check Notification Delivery
```bash
# Unread notifications count per user
php artisan tinker
>>> User::withCount(['notifications as unread_count' => function($q) { $q->unread(); }])->get(['name', 'unread_count']);
```

---

## Support & Documentation

- **Business Profile**: See `BUSINESS_PROFILE_DOCUMENTATION.md`
- **All Features**: See `FEATURES_IMPLEMENTATION_SUMMARY.md`
- **Laravel Docs**: https://laravel.com/docs
- **Inertia Docs**: https://inertiajs.com
- **shadcn/ui**: https://ui.shadcn.com

---

**Last Updated**: 2025-01-05
**Version**: 1.0.0
**Status**: Production Ready (except Invoice Generator)
