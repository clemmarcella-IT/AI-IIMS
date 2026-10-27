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
        if (! Schema::hasTable('lesson_sections')) {
            Schema::create('lesson_sections', function (Blueprint $table) {
                $table->id();
                $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
                $table->string('title');
                $table->longText('content')->nullable();
                $table->unsignedInteger('sort_order')->default(1);
                $table->boolean('is_collapsible')->default(true);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('lesson_media')) {
            Schema::create('lesson_media', function (Blueprint $table) {
                $table->id();
                $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
                $table->enum('type', ['image', 'video', 'link', 'slides']);
                $table->text('url');
                $table->string('caption')->nullable();
                $table->unsignedInteger('sort_order')->default(1);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('lesson_activities')) {
            Schema::create('lesson_activities', function (Blueprint $table) {
                $table->id();
                $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
                $table->enum('type', [
                    'mini_quiz',
                    'reflection',
                    'clickable_activity',
                ]);
                $table->string('title');
                $table->longText('instruction')->nullable();
                $table->unsignedInteger('sort_order')->default(1);
                $table->timestamps();
            });
        }

        if (
            Schema::hasTable('lesson_questions') &&
            ! Schema::hasColumn('lesson_questions', 'lesson_activity_id')
        ) {
            Schema::table('lesson_questions', function (Blueprint $table) {
                $table->foreignId('lesson_activity_id')
                    ->nullable()
                    ->after('lesson_id')
                    ->constrained('lesson_activities')
                    ->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('ai_lesson_suggestions')) {
            Schema::create('ai_lesson_suggestions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('lesson_id')
                    ->nullable()
                    ->constrained()
                    ->nullOnDelete();
                $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
                $table->string('suggestion_type');
                $table->string('title');
                $table->longText('content');
                $table->json('payload')->nullable();
                $table->enum('status', [
                    'pending',
                    'accepted',
                    'discarded',
                ])->default('pending');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_lesson_suggestions');

        if (
            Schema::hasTable('lesson_questions') &&
            Schema::hasColumn('lesson_questions', 'lesson_activity_id')
        ) {
            Schema::table('lesson_questions', function (Blueprint $table) {
                $table->dropConstrainedForeignId('lesson_activity_id');
            });
        }

        Schema::dropIfExists('lesson_activities');
        Schema::dropIfExists('lesson_media');
        Schema::dropIfExists('lesson_sections');
    }
};
