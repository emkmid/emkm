<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Midtrans Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Midtrans payment gateway integration.
    | You can find your keys in your Midtrans dashboard.
    |
    */

    'server_key' => env('MIDTRANS_SERVER_KEY'),
    'client_key' => env('MIDTRANS_CLIENT_KEY'),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),
    'is_3ds' => env('MIDTRANS_IS_3DS', true),

    /*
    |--------------------------------------------------------------------------
    | Midtrans Snap Settings
    |--------------------------------------------------------------------------
    |
    | Settings for Midtrans Snap payment page.
    |
    */

    'snap' => [
        'enabled' => true,
        'url' => env('MIDTRANS_IS_PRODUCTION', false)
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js',
    ],

    /*
    |--------------------------------------------------------------------------
    | Midtrans Webhook URL
    |--------------------------------------------------------------------------
    |
    | The URL where Midtrans will send payment notifications.
    | Make sure this URL is publicly accessible.
    |
    */

    'webhook_url' => env('APP_URL') . '/webhooks/midtrans',

    /*
    |--------------------------------------------------------------------------
    | Webhook Security
    |--------------------------------------------------------------------------
    |
    | IP whitelist for webhook security in production.
    | Set to false to disable IP checking (not recommended for production).
    |
    */

    'webhook_ip_whitelist_enabled' => env('MIDTRANS_WEBHOOK_IP_CHECK', true),
];