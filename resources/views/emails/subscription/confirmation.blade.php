<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Langganan</title>
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
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .content {
            padding: 40px 30px;
        }
        .subscription-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #667eea;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
            color: #667eea;
        }
        .detail-label {
            font-weight: 600;
            color: #495057;
        }
        .detail-value {
            color: #212529;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-active {
            background-color: #d4edda;
            color: #155724;
        }
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        .footer {
            background: #f8f9fa;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .alert {
            background: #e7f3ff;
            border: 1px solid #b8daff;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #004085;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Konfirmasi Langganan</h1>
            <p>Terima kasih telah berlangganan!</p>
        </div>

        <div class="content">
            <p>Halo <strong>{{ $user->name }}</strong>,</p>
            
            <p>Langganan Anda telah berhasil diproses. Berikut adalah detail langganan Anda:</p>

            <div class="subscription-details">
                <div class="detail-row">
                    <span class="detail-label">Paket:</span>
                    <span class="detail-value">{{ $package->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Deskripsi:</span>
                    <span class="detail-value">{{ $package->description }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">ID Transaksi:</span>
                    <span class="detail-value">{{ $subscription->transaction_id }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status-badge status-{{ $subscription->status }}">
                            {{ ucfirst($subscription->status) }}
                        </span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Mulai:</span>
                    <span class="detail-value">{{ $subscription->starts_at->format('d F Y, H:i') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Berakhir:</span>
                    <span class="detail-value">{{ $subscription->expires_at->format('d F Y, H:i') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Pembayaran:</span>
                    <span class="detail-value">Rp {{ number_format($subscription->amount, 0, ',', '.') }}</span>
                </div>
            </div>

            @if($subscription->status === 'active')
                <div class="alert">
                    <strong>✅ Langganan Aktif</strong><br>
                    Anda sekarang dapat mengakses semua fitur premium yang tersedia dalam paket {{ $package->name }}.
                </div>
            @elseif($subscription->status === 'pending')
                <div class="alert">
                    <strong>⏳ Menunggu Pembayaran</strong><br>
                    Langganan Anda akan aktif setelah pembayaran berhasil diverifikasi.
                </div>
            @endif

            <div style="text-align: center;">
                <a href="{{ route('dashboard') }}" class="btn">Masuk ke Dashboard</a>
            </div>

            <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim support kami.</p>
        </div>

        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon jangan membalas email ini.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. Semua hak dilindungi.</p>
        </div>
    </div>
</body>
</html>