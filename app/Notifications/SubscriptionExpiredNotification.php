<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionExpiredNotification extends Notification
{
    use Queueable;

    public function __construct(protected Subscription $subscription)
    {
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $pkgName = $this->subscription->package->name ?? 'your plan';

        return (new MailMessage)
            ->subject('Subscription expired')
            ->line("Hi {$notifiable->name},")
            ->line("Your subscription to {$pkgName} expired on {$this->subscription->ends_at?->toDateString()}")
            ->action('View plans', url('/dashboard/admin/packages'))
            ->line('If you believe this is a mistake, contact support.');
    }
}
