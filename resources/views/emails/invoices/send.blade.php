<x-mail::message>
# Invoice {{ $invoiceNumber }}

Dear {{ $customerName }},

Berikut adalah invoice untuk pembelian Anda.

## Invoice Details

- **Invoice Number**: {{ $invoiceNumber }}
- **Total Amount**: {{ $total }}
- **Due Date**: {{ $dueDate }}

Silakan lakukan pembayaran sebelum tanggal jatuh tempo.

<x-mail::button :url="$viewUrl">
View Invoice
</x-mail::button>

Jika Anda memiliki pertanyaan tentang invoice ini, silakan hubungi kami.

Best regards,<br>
{{ config('app.name') }}
</x-mail::message>
