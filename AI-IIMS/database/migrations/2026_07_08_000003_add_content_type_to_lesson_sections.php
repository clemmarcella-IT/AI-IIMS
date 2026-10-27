<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (
            Schema::hasTable('lesson_sections') &&
            ! Schema::hasColumn('lesson_sections', 'content_type')
        ) {
            Schema::table('lesson_sections', function (Blueprint $table): void {
                $table->string('content_type', 20)->default('text')->after('content');
            });
        }
    }

    public function down(): void
    {
        if (
            Schema::hasTable('lesson_sections') &&
            Schema::hasColumn('lesson_sections', 'content_type')
        ) {
            Schema::table('lesson_sections', function (Blueprint $table): void {
                $table->dropColumn('content_type');
            });
        }
    }
};
