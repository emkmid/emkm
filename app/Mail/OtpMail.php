<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public string $code,
        public string $name,
        public string $type = 'email_verification'
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subjects = [
            'email_verification' => 'Verifikasi Email Anda - ' . config('app.name'),
            'password_reset' => 'Reset Password - ' . config('app.name'),
            'two_factor' => 'Kode 2FA - ' . config('app.name'),
            'transaction_confirm' => 'Konfirmasi Transaksi - ' . config('app.name'),
        ];

        return new Envelope(
            subject: $subjects[$this->type] ?? 'Kode OTP - ' . config('app.name'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.otp',
            with: [
                'code' => $this->code,
                'name' => $this->name,
                'type' => $this->type,
                'expiryMinutes' => config('otp.expiry_minutes'),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
