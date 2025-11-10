<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #23627C 0%, #1a4a5e 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
        }
        .message {
            font-size: 15px;
            color: #666;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .otp-container {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 2px dashed #23627C;
        }
        .otp-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #23627C;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }
        .expiry {
            font-size: 13px;
            color: #e74c3c;
            margin-top: 15px;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 25px 0;
            font-size: 14px;
            color: #856404;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #23627C;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .otp-code {
                font-size: 28px;
                letter-spacing: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ config('app.name') }}</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Halo {{ $name }},
            </div>
            
            <div class="message">
                @if($type === 'email_verification')
                    Terima kasih telah mendaftar di {{ config('app.name') }}! Untuk mengaktifkan akun Anda, silakan gunakan kode verifikasi berikut:
                @elseif($type === 'password_reset')
                    Anda telah meminta untuk mereset password akun Anda. Gunakan kode berikut untuk melanjutkan proses reset password:
                @elseif($type === 'two_factor')
                    Masukkan kode 2FA berikut untuk melanjutkan login:
                @elseif($type === 'transaction_confirm')
                    Konfirmasi transaksi Anda dengan memasukkan kode berikut:
                @else
                    Gunakan kode verifikasi berikut:
                @endif
            </div>
            
            <div class="otp-container">
                <div class="otp-label">Kode Verifikasi</div>
                <div class="otp-code">{{ $code }}</div>
                <div class="expiry">
                    ⏱️ Kode ini akan kedaluwarsa dalam {{ $expiryMinutes }} menit
                </div>
            </div>
            
            <div class="warning">
                <strong>⚠️ Penting:</strong> Jangan bagikan kode ini kepada siapapun, termasuk tim {{ config('app.name') }}. Kami tidak akan pernah meminta kode verifikasi Anda.
            </div>
            
            <div class="message">
                @if($type === 'email_verification')
                    Jika Anda tidak mendaftar akun di {{ config('app.name') }}, abaikan email ini.
                @else
                    Jika Anda tidak meminta kode ini, abaikan email ini atau hubungi tim support kami jika Anda merasa ada aktivitas mencurigakan pada akun Anda.
                @endif
            </div>
        </div>
        
        <div class="footer">
            <p>Email ini dikirim otomatis oleh sistem {{ config('app.name') }}</p>
            <p>Jika Anda memiliki pertanyaan, silakan hubungi kami di <a href="mailto:support@emkm.com">support@emkm.com</a></p>
            <p style="margin-top: 15px; color: #999;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
