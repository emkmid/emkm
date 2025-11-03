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
        Schema::table('packages', function (Blueprint $table) {
            $table->json('duration_options')->nullable()->after('features'); // ['1_month', '3_months', '6_months', '1_year']
            $table->decimal('discount_percentage', 5, 2)->default(0)->after('duration_options'); // Discount for longer durations
            $table->boolean('is_popular')->default(false)->after('discount_percentage'); // Mark popular packages
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['duration_options', 'discount_percentage', 'is_popular']);
        });
    }
};
