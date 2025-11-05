<?php

namespace App\Mail;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Invoice $invoice
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invoice ' . $this->invoice->invoice_number . ' from ' . ($this->invoice->user->businessProfile->business_name ?? 'E-MKM'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.invoices.send',
            with: [
                'invoice' => $this->invoice,
                'invoiceNumber' => $this->invoice->invoice_number,
                'customerName' => $this->invoice->customer->name,
                'total' => 'Rp ' . number_format($this->invoice->total, 0, ',', '.'),
                'dueDate' => $this->invoice->due_date->format('d M Y'),
                'viewUrl' => route('invoices.show', $this->invoice),
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
        // Attach PDF if feature is enabled
        return [];
    }
}
