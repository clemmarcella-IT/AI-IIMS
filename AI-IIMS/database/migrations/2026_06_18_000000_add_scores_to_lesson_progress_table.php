<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('lesson_progress')) {
            return;
        }

        Schema::table('lesson_progress', function (Blueprint $table) {
            if (! Schema::hasColumn('lesson_progress', 'earned_score')) {
                $table->decimal('earned_score', 8, 2)->default(0)->after('progress_percentage');
            }

            if (! Schema::hasColumn('lesson_progress', 'total_score')) {
                $table->decimal('total_score', 8, 2)->default(0)->after('earned_score');
            }

            if (! Schema::hasColumn('lesson_progress', 'score_percentage')) {
                $table->decimal('score_percentage', 5, 2)->nullable()->after('total_score');
            }

            if (! Schema::hasColumn('lesson_progress', 'scored_activities_count')) {
                $table->unsignedSmallInteger('scored_activities_count')->default(0)->after('score_percentage');
            }

            if (! Schema::hasColumn('lesson_progress', 'correct_activities_count')) {
                $table->unsignedSmallInteger('correct_activities_count')->default(0)->after('scored_activities_count');
            }

            if (! Schema::hasColumn('lesson_progress', 'latest_scored_at')) {
                $table->timestamp('latest_scored_at')->nullable()->after('completed_at');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('lesson_progress')) {
            return;
        }

        Schema::table('lesson_progress', function (Blueprint $table) {
            foreach ([
                'latest_scored_at',
                'correct_activities_count',
                'scored_activities_count',
                'score_percentage',
                'total_score',
                'earned_score',
            ] as $column) {
                if (Schema::hasColumn('lesson_progress', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
