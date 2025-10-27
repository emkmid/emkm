<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->string('stripe_product_id')->nullable()->after('is_active');
            $table->string('stripe_price_id')->nullable()->after('stripe_product_id');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('provider_customer_id')->nullable()->after('provider_subscription_id');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['stripe_product_id', 'stripe_price_id']);
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('provider_customer_id');
        });
    }
};
