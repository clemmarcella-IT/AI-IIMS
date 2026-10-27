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
        if (
            Schema::hasTable('lesson_media') &&
            ! Schema::hasColumn('lesson_media', 'lesson_section_id')
        ) {
            Schema::table('lesson_media', function (Blueprint $table) {
                $table->foreignId('lesson_section_id')
                    ->nullable()
                    ->after('lesson_id')
                    ->constrained('lesson_sections')
                    ->cascadeOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (
            Schema::hasTable('lesson_media') &&
            Schema::hasColumn('lesson_media', 'lesson_section_id')
        ) {
            Schema::table('lesson_media', function (Blueprint $table) {
                $table->dropConstrainedForeignId('lesson_section_id');
            });
        }
    }
};
