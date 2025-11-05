<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();

        foreach ($users as $user) {
            // Welcome notification
            UserNotification::create([
                'user_id' => $user->id,
                'type' => 'success',
                'title' => 'Welcome to E-MKM!',
                'message' => 'Thank you for joining our platform. Start managing your business finances today!',
                'action_url' => '/dashboard/user',
                'action_text' => 'Go to Dashboard',
                'is_read' => false,
            ]);

            // Info notification
            UserNotification::create([
                'user_id' => $user->id,
                'type' => 'info',
                'title' => 'New Feature Available',
                'message' => 'Check out our new invoice generator feature to create professional invoices for your customers.',
                'action_url' => '/dashboard/invoices',
                'action_text' => 'Try Now',
                'is_read' => false,
            ]);

            // Sample read notification
            UserNotification::create([
                'user_id' => $user->id,
                'type' => 'success',
                'title' => 'Account Verified',
                'message' => 'Your email has been successfully verified.',
                'is_read' => true,
                'read_at' => now()->subDays(2),
                'created_at' => now()->subDays(3),
            ]);
        }
    }
}
