<x-mail::message>
# Your Subscription is Expiring Soon

Halo,

Subscription Anda untuk paket **{{ $packageName }}** akan berakhir dalam **{{ $daysRemaining }} hari**.

## Detail Subscription

- **Package**: {{ $packageName }}
- **Expiry Date**: {{ $endsAt }}

Jangan sampai kehilangan akses ke fitur premium Anda! Perpanjang sekarang untuk melanjutkan.

<x-mail::button :url="$renewUrl">
Renew Subscription
</x-mail::button>

Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.

Best regards,<br>
{{ config('app.name') }}
</x-mail::message>
