<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('lesson_activities')) {
            Schema::table('lesson_activities', function (Blueprint $table) {
                if (! Schema::hasColumn('lesson_activities', 'payload')) {
                    $table->json('payload')->nullable()->after('instruction');
                }

                if (! Schema::hasColumn('lesson_activities', 'correct_answer')) {
                    $table->json('correct_answer')->nullable()->after('payload');
                }

                if (! Schema::hasColumn('lesson_activities', 'explanation')) {
                    $table->longText('explanation')->nullable()->after('correct_answer');
                }
            });

            if (Schema::getConnection()->getDriverName() === 'mysql') {
                DB::statement("ALTER TABLE lesson_activities MODIFY type ENUM('mini_quiz', 'true_false', 'fill_blank', 'matching', 'sequencing', 'reflection', 'clickable_activity') NOT NULL");
            }
        }

        if (! Schema::hasTable('student_activity_answers')) {
            Schema::create('student_activity_answers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->constrained()->cascadeOnDelete();
                $table->foreignId('lesson_activity_id')->constrained('lesson_activities')->cascadeOnDelete();
                $table->json('answer')->nullable();
                $table->boolean('is_correct')->nullable();
                $table->decimal('score', 5, 2)->nullable();
                $table->longText('feedback')->nullable();
                $table->timestamps();

                $table->unique(['student_id', 'lesson_activity_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('student_activity_answers');

        if (Schema::hasTable('lesson_activities')) {
            Schema::table('lesson_activities', function (Blueprint $table) {
                if (Schema::hasColumn('lesson_activities', 'explanation')) {
                    $table->dropColumn('explanation');
                }

                if (Schema::hasColumn('lesson_activities', 'correct_answer')) {
                    $table->dropColumn('correct_answer');
                }

                if (Schema::hasColumn('lesson_activities', 'payload')) {
                    $table->dropColumn('payload');
                }
            });

            if (Schema::getConnection()->getDriverName() === 'mysql') {
                DB::statement("ALTER TABLE lesson_activities MODIFY type ENUM('mini_quiz', 'reflection', 'clickable_activity') NOT NULL");
            }
        }
    }
};
