<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionExpiringNotification extends Notification
{
    use Queueable;

    public function __construct(protected Subscription $subscription, protected int $days)
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
            ->subject("Subscription expiring in {$this->days} day(s)")
            ->line("Hi {$notifiable->name},")
            ->line("Your subscription to {$pkgName} will expire in {$this->days} day(s) on {$this->subscription->ends_at->toDateString()}.")
            ->action('Manage Subscription', url('/dashboard'))
            ->line('Thank you for using our application!');
    }
}
