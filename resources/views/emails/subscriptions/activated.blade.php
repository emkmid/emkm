<x-mail::message>
# Subscription Activated!

Selamat! Subscription Anda untuk paket **{{ $packageName }}** telah berhasil diaktifkan.

## Detail Subscription

- **Package**: {{ $packageName }}
- **Start Date**: {{ $startsAt }}
- **End Date**: {{ $endsAt }}

Anda sekarang dapat menikmati semua fitur premium yang tersedia di paket Anda.

<x-mail::button :url="$dashboardUrl">
Go to Dashboard
</x-mail::button>

Terima kasih telah berlangganan E-MKM!

Best regards,<br>
{{ config('app.name') }}
</x-mail::message>
