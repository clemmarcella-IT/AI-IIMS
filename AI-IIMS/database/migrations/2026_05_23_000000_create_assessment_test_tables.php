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
        if (! Schema::hasTable('tests')) {
            Schema::create('tests', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->enum('test_type', ['pretest', 'posttest']);
                $table->string('subject')->nullable();
                $table->string('topic')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('test_questions')) {
            Schema::create('test_questions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('test_id')->constrained('tests')->cascadeOnDelete();
                $table->longText('question');
                $table->json('choices');
                $table->string('correct_answer');
                $table->longText('explanation')->nullable();
                $table->unsignedInteger('points')->default(1);
                $table->timestamps();
            });
        }

        if (Schema::hasTable('test_attempts') && ! Schema::hasColumn('test_attempts', 'test_id')) {
            Schema::table('test_attempts', function (Blueprint $table) {
                $table->foreignId('test_id')
                    ->nullable()
                    ->constrained('tests')
                    ->nullOnDelete();
            });
        }

        if (! Schema::hasTable('test_attempts')) {
            Schema::create('test_attempts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->constrained()->cascadeOnDelete();
                $table->foreignId('test_id')->nullable()->constrained('tests')->nullOnDelete();
                $table->enum('test_type', ['pretest', 'posttest']);
                $table->unsignedInteger('score')->default(0);
                $table->unsignedInteger('total_items')->default(0);
                $table->decimal('percentage', 5, 2)->default(0);
                $table->timestamp('started_at')->nullable();
                $table->timestamp('submitted_at')->nullable();
                $table->timestamps();
                $table->unique(['student_id', 'test_type']);
            });
        }

        if (! Schema::hasTable('test_attempt_answers')) {
            Schema::create('test_attempt_answers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('test_attempt_id')->constrained()->cascadeOnDelete();
                $table->foreignId('test_question_id')->constrained()->cascadeOnDelete();
                $table->string('selected_answer')->nullable();
                $table->boolean('is_correct')->default(false);
                $table->unsignedInteger('points_earned')->default(0);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_attempt_answers');
        Schema::dropIfExists('test_questions');

        if (Schema::hasTable('test_attempts') && Schema::hasColumn('test_attempts', 'test_id')) {
            Schema::table('test_attempts', function (Blueprint $table) {
                $table->dropForeign(['test_id']);
                $table->dropColumn('test_id');
            });
        }

        Schema::dropIfExists('tests');
    }
};
