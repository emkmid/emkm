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
            // Check if columns don't exist before adding
            if (!Schema::hasColumn('subscriptions', 'amount')) {
                $table->decimal('amount', 12, 2)->nullable()->after('price_cents');
            }
            if (!Schema::hasColumn('subscriptions', 'expires_at')) {
                $table->timestamp('expires_at')->nullable()->after('ends_at');
            }
            if (!Schema::hasColumn('subscriptions', 'transaction_id')) {
                $table->string('transaction_id')->nullable()->after('midtrans_payment_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['amount', 'expires_at', 'transaction_id']);
        });
    }
};
