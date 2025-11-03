<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Package;
use App\Services\MidtransService;
use Illuminate\Support\Facades\Log;

class TestMidtransPayment extends Command
{
    protected $signature = 'test:midtrans {user_id=1} {package_id=2} {duration=1_month}';
    protected $description = 'Test Midtrans payment integration';

    public function handle()
    {
        try {
            $userId = $this->argument('user_id');
            $packageId = $this->argument('package_id');
            $duration = $this->argument('duration');

            $this->info("Testing Midtrans Payment Gateway");
            $this->info("User ID: {$userId}");
            $this->info("Package ID: {$packageId}");
            $this->info("Duration: {$duration}");
            $this->line('');

            // Get user and package
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found!");
                return 1;
            }

            $package = Package::find($packageId);
            if (!$package) {
                $this->error("Package with ID {$packageId} not found!");
                return 1;
            }

            $this->info("User: {$user->name} ({$user->email})");
            $this->info("Package: {$package->name} - Rp " . number_format($package->price));
            $this->line('');

            // Test price calculation
            $this->info("Testing price calculation...");
            $calculatedPrice = $package->calculatePrice($duration);
            $this->info("Calculated price for {$duration}: Rp " . number_format($calculatedPrice));
            $this->line('');

            // Test Midtrans configuration
            $this->info("Testing Midtrans configuration...");
            $this->info("Server Key: " . (config('midtrans.server_key') ? 'Configured ✓' : 'Missing ✗'));
            $this->info("Client Key: " . (config('midtrans.client_key') ? 'Configured ✓' : 'Missing ✗'));
            $this->info("Is Production: " . (config('midtrans.is_production') ? 'Yes' : 'No (Sandbox)'));
            $this->line('');

            // Test MidtransService
            $this->info("Testing MidtransService...");
            $midtransService = app(MidtransService::class);
            
            // Check for existing active subscription
            $activeSubscription = $user->subscriptions()
                ->where('status', 'active')
                ->first();

            if ($activeSubscription) {
                $this->warn("User already has an active subscription: {$activeSubscription->package->name}");
                $this->warn("Expires at: {$activeSubscription->expires_at}");
                
                if (!$this->confirm('Continue with test anyway?')) {
                    return 0;
                }
            }

            // Create subscription payment
            $this->info("Creating subscription payment...");
            $result = $midtransService->createSubscriptionPayment($user, $package, $duration);

            if ($result && isset($result['snap_token'])) {
                $this->info("✓ Midtrans payment created successfully!");
                $this->info("Snap Token: " . substr($result['snap_token'], 0, 20) . "...");
                $this->info("Order ID: " . $result['order_id']);
                $this->info("Subscription ID: " . $result['subscription']->id);
                $this->line('');
                
                $this->info("Test Payment URL (Sandbox):");
                $this->line("https://simulator.sandbox.midtrans.com/openapi/ui/index");
                $this->line('');
                
                $this->info("You can test the payment with these test cards:");
                $this->line("- Visa: 4811 1111 1111 1114 (Success)");
                $this->line("- Mastercard: 5573 3811 1111 1115 (Success)");
                $this->line("- BCA: 4617 0011 1111 1113 (Success)");
                
            } else {
                $this->error("✗ Failed to create Midtrans payment");
                if (isset($result['error'])) {
                    $this->error("Error: " . $result['error']);
                }
            }

        } catch (\Exception $e) {
            $this->error("Test failed with exception: " . $e->getMessage());
            $this->error("File: " . $e->getFile());
            $this->error("Line: " . $e->getLine());
            
            Log::error('Midtrans test failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return 1;
        }

        return 0;
    }
}