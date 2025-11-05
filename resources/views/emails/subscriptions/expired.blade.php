<x-mail::message>
# Subscription Expired

Halo,

Subscription Anda untuk paket **{{ $packageName }}** telah berakhir pada {{ $expiredAt }}.

Akun Anda telah dikembalikan ke paket Free dengan fitur terbatas.

Untuk melanjutkan menggunakan fitur premium, silakan perpanjang subscription Anda.

<x-mail::button :url="$renewUrl">
Renew Subscription
</x-mail::button>

Terima kasih telah menggunakan E-MKM.

Best regards,<br>
{{ config('app.name') }}
</x-mail::message>
