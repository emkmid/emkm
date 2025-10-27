<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Notifications\SubscriptionExpiringNotification;
use App\Notifications\SubscriptionExpiredNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check subscriptions for upcoming expirations and mark ended subscriptions';

    public function handle(): int
    {
        $now = Carbon::now();

        $this->info('Checking subscriptions at '.$now->toDateTimeString());

        // Expire subscriptions whose ends_at is in the past and status is active/past_due
        $expiring = Subscription::whereIn('status', ['active', 'past_due', 'trial'])
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', $now)
            ->get();

        foreach ($expiring as $sub) {
            $sub->status = 'ended';
            $sub->save();

            if ($sub->user) {
                $sub->user->notify(new SubscriptionExpiredNotification($sub));
            }
            $this->line('Expired subscription id='.$sub->id.' user_id='.$sub->user_id);
        }

        // Send reminders for 7, 3, and 1 day(s) before expiration
        foreach ([7, 3, 1] as $days) {
            $target = $now->copy()->addDays($days)->toDateString();

            $subs = Subscription::whereIn('status', ['active', 'trial'])
                ->whereNotNull('ends_at')
                ->whereDate('ends_at', $target)
                ->get();

            foreach ($subs as $sub) {
                if ($sub->user) {
                    $sub->user->notify(new SubscriptionExpiringNotification($sub, $days));
                }
                $this->line("Notified user {$sub->user_id} of subscription {$sub->id} expiring in {$days} days");
            }
        }

        $this->info('Done');

        return Command::SUCCESS;
    }
}
