<x-mail::message>
# Payment Successful!

Terima kasih! Pembayaran Anda telah berhasil diproses.

## Payment Details

- **Transaction ID**: {{ $transactionId }}
- **Package**: {{ $packageName }}
- **Amount**: Rp {{ $amount }}
- **Valid From**: {{ $startsAt }}
- **Valid Until**: {{ $endsAt }}

Subscription Anda telah diaktifkan dan Anda dapat mulai menggunakan semua fitur premium.

<x-mail::button :url="$dashboardUrl">
Go to Dashboard
</x-mail::button>

Best regards,<br>
{{ config('app.name') }}
</x-mail::message>
