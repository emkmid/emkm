<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('midtrans_order_id')->nullable()->after('provider_subscription_id');
            $table->string('midtrans_transaction_id')->nullable()->after('midtrans_order_id');
            $table->string('midtrans_payment_type')->nullable()->after('midtrans_transaction_id');
        });

        Schema::table('packages', function (Blueprint $table) {
            $table->string('midtrans_item_id')->nullable()->after('stripe_price_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['midtrans_order_id', 'midtrans_transaction_id', 'midtrans_payment_type']);
        });

        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('midtrans_item_id');
        });
    }
};
