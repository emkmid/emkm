<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $subscription;

    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Konfirmasi Langganan - ' . $this->subscription->package->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscription.confirmation',
            with: [
                'subscription' => $this->subscription,
                'package' => $this->subscription->package,
                'user' => $this->subscription->user,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}