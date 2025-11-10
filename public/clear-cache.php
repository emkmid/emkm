<?php
/**
 * Cache Clear Helper
 * Upload this file to public/ folder and access via browser
 * Example: https://emkm.web.id/clear-cache.php
 * DELETE THIS FILE AFTER USE!
 */

// Only allow in non-production or with secret key
$secret = $_GET['secret'] ?? '';
$allowedSecret = 'emkm2025'; // Change this to something secure

if ($secret !== $allowedSecret) {
    die('Access denied. Use: clear-cache.php?secret=emkm2025');
}

echo "<h1>Laravel Cache Clear</h1>";
echo "<pre>";

// Change to Laravel root directory
chdir(__DIR__ . '/..');

// Clear various caches
$commands = [
    'php artisan optimize:clear',
    'php artisan config:clear',
    'php artisan cache:clear',
    'php artisan view:clear',
    'php artisan route:clear',
];

foreach ($commands as $command) {
    echo "\n" . str_repeat('=', 60) . "\n";
    echo "Running: $command\n";
    echo str_repeat('=', 60) . "\n";
    
    $output = [];
    $returnVar = 0;
    exec($command . ' 2>&1', $output, $returnVar);
    
    echo implode("\n", $output) . "\n";
    echo "Status: " . ($returnVar === 0 ? '✓ Success' : '✗ Failed') . "\n";
}

echo "\n" . str_repeat('=', 60) . "\n";
echo "DONE! Now delete this file (clear-cache.php) for security!\n";
echo str_repeat('=', 60) . "\n";
echo "</pre>";
