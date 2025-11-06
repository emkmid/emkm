# Priority 2 Optimizations - Performance Monitoring

## Query Logging

Query logging middleware telah ditambahkan untuk monitoring performance. Untuk mengaktifkan:

### Enable Query Logging:
```bash
# Edit .env file
DB_LOG_QUERIES=true
```

### Features:
- ✅ Logs slow queries (> 100ms)
- ✅ Logs requests with too many queries (> 20)
- ✅ Adds debug headers: X-Query-Count, X-Query-Time
- ✅ Only active when APP_DEBUG=true

### Check Logs:
```bash
tail -f storage/logs/laravel.log
```

### Example Output:
```
[2025-11-06] local.WARNING: Slow queries detected
{
  "url": "http://localhost/dashboard",
  "method": "GET",
  "queries": [
    {"query": "SELECT * FROM ...", "time": 150.5}
  ],
  "total_time": "250.3ms"
}
```

## Response Compression

Gzip compression telah diaktifkan untuk semua responses (kecuali images/videos).

### Features:
- ✅ Compression level 6 (balanced)
- ✅ Skip files < 1KB
- ✅ Skip already compressed content
- ✅ Automatic Content-Encoding headers

### Expected Savings:
- HTML/JSON: ~60-70% size reduction
- CSS: ~70-80% size reduction
- JavaScript: ~60-70% size reduction

## Image Lazy Loading

Component LazyImage telah tersedia untuk lazy loading images:

### Usage:
```tsx
import LazyImage from '@/components/LazyImage';

<LazyImage 
  src="/path/to/image.jpg"
  alt="Description"
  className="w-full h-auto"
  fallback="/images/placeholder.png"
/>
```

### Features:
- ✅ Native lazy loading
- ✅ Loading state with skeleton
- ✅ Error fallback
- ✅ Smooth fade-in transition

## Testing

### Test Query Logging:
```bash
# 1. Enable logging
DB_LOG_QUERIES=true

# 2. Access dashboard
# 3. Check response headers:
# X-Query-Count: 1 (should be 1 due to caching!)
# X-Query-Time: 50.23ms

# 4. Check logs for any slow queries
tail -f storage/logs/laravel.log | grep "Slow queries"
```

### Test Compression:
```bash
# Check response headers:
curl -I -H "Accept-Encoding: gzip" http://localhost/dashboard
# Should see: Content-Encoding: gzip
```

### Test Eager Loading:
```bash
# Enable query logging
# Visit /dashboard/incomes
# Check X-Query-Count header
# Should be reduced from ~10+ to ~3 queries
```
