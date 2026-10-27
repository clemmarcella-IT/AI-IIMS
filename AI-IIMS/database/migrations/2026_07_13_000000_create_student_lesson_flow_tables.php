<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_lesson_step_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_media_id')->nullable()->constrained('lesson_media')->cascadeOnDelete();
            $table->string('step_key');
            $table->unsignedInteger('position_seconds')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->unique(['student_id', 'lesson_id', 'step_key'], 'student_lesson_step_unique');
        });

        Schema::create('student_activity_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_activity_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('attempt_number');
            $table->json('answer')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->decimal('score', 8, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
            $table->unique(['student_id', 'lesson_activity_id', 'attempt_number'], 'student_activity_attempt_unique');
        });

        Schema::create('student_lesson_question_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_question_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('attempt_number');
            $table->string('selected_answer');
            $table->boolean('is_correct');
            $table->timestamps();
            $table->unique(['student_id', 'lesson_question_id', 'attempt_number'], 'student_lesson_question_attempt_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_lesson_question_attempts');
        Schema::dropIfExists('student_activity_attempts');
        Schema::dropIfExists('student_lesson_step_progress');
    }
};
