<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (
            Schema::hasTable('lesson_activities') &&
            ! Schema::hasColumn('lesson_activities', 'lesson_section_id')
        ) {
            Schema::table('lesson_activities', function (Blueprint $table) {
                $table->foreignId('lesson_section_id')
                    ->nullable()
                    ->after('lesson_id')
                    ->constrained('lesson_sections')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (
            Schema::hasTable('lesson_activities') &&
            Schema::hasColumn('lesson_activities', 'lesson_section_id')
        ) {
            Schema::table('lesson_activities', function (Blueprint $table) {
                $table->dropConstrainedForeignId('lesson_section_id');
            });
        }
    }
};
