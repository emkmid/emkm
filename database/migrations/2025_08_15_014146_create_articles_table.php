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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title', 200);
            $table->string('slug')->unique();
            $table->string('excerpt', 300)->nullable();
            $table->text('content_html');
            $table->json('meta')->nullable();
            $table->timestamp('published_at');
            $table->string('thumbnail_path')->nullable();
            $table->unsignedSmallInteger('reading_time')->default(5);
            $table->index(['user_id','published_at']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
