<?php

return [

    /*
    |--------------------------------------------------------------------------
    | OTP Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for One-Time Password (OTP) verification system.
    | Used for email verification, 2FA, and password reset.
    |
    */

    /**
     * Length of the OTP code (number of digits)
     */
    'length' => env('OTP_LENGTH', 6),

    /**
     * OTP expiry time in minutes
     */
    'expiry_minutes' => env('OTP_EXPIRY_MINUTES', 5),

    /**
     * Maximum number of incorrect attempts before blocking
     */
    'max_attempts' => env('OTP_MAX_ATTEMPTS', 3),

    /**
     * Rate limiting: Maximum OTP requests per time window
     */
    'rate_limit' => [
        'requests' => env('OTP_RATE_LIMIT_REQUESTS', 3),
        'minutes' => env('OTP_RATE_LIMIT_MINUTES', 60),
    ],

    /**
     * Block duration in minutes after max attempts exceeded
     */
    'block_duration_minutes' => env('OTP_BLOCK_DURATION_MINUTES', 15),

    /**
     * OTP types
     */
    'types' => [
        'email_verification' => 'email_verification',
        'password_reset' => 'password_reset',
        'two_factor' => 'two_factor',
        'transaction_confirm' => 'transaction_confirm',
    ],

];
