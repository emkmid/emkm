<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For MySQL, use raw SQL to avoid index issues
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE audit_logs MODIFY COLUMN auditable_id VARCHAR(255)');
        } else {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->string('auditable_id', 255)->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // For MySQL, use raw SQL to avoid index issues
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE audit_logs MODIFY COLUMN auditable_id BIGINT UNSIGNED NOT NULL');
        } else {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->unsignedBigInteger('auditable_id')->change();
            });
        }
    }
};
