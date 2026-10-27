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
        Schema::create('lesson_cue_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_media_id')->constrained('lesson_media')->cascadeOnDelete();
            $table->unsignedInteger('timestamp_seconds');
            $table->enum('type', ['quiz_mcq', 'quiz_open', 'pause_reflect', 'info']);
            $table->text('question')->nullable();
            $table->json('options')->nullable();
            $table->string('correct_option')->nullable();
            $table->text('explanation')->nullable();
            $table->longText('content')->nullable();
            $table->timestamps();

            $table->index(['lesson_media_id', 'timestamp_seconds']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_cue_points');
    }
};
