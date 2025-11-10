#!/bin/bash
# Quick fix script untuk production
# Jalankan di server production melalui SSH

echo "==========================================="
echo "FIX AUDIT LOGS - auditable_id Column Type"
echo "==========================================="
echo ""

# Backup database terlebih dahulu (opsional tapi recommended)
echo "Step 1: Backup database (recommended)"
echo "mysqldump -u [user] -p [database] > backup_before_audit_fix_$(date +%Y%m%d_%H%M%S).sql"
echo ""

# Jalankan migration
echo "Step 2: Jalankan migration"
echo "cd /path/to/emkm"
php artisan migrate --force

echo ""
echo "Step 3: Clear cache"
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo ""
echo "==========================================="
echo "Fix completed!"
echo "==========================================="
echo ""
echo "Silakan test:"
echo "1. Tambah produk baru"
echo "2. Input transaksi baru"
echo ""
