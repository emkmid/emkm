<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('package_features', function (Blueprint $table) {
            $table->id();
            $table->string('feature_key')->unique(); // e.g., 'invoices.create'
            $table->string('feature_name'); // Display name
            $table->text('description')->nullable();
            $table->string('category'); // accounting, articles, invoices, etc.
            $table->enum('limit_type', ['boolean', 'numeric', 'list'])->default('boolean');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Pivot table untuk Package <-> Feature dengan limit values
        Schema::create('package_feature_limits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('package_feature_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_enabled')->default(true);
            $table->integer('numeric_limit')->nullable(); // For numeric limits
            $table->json('list_values')->nullable(); // For list-based features
            $table->timestamps();

            $table->unique(['package_id', 'package_feature_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_feature_limits');
        Schema::dropIfExists('package_features');
    }
};
