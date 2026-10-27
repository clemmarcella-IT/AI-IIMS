<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('lesson_media')) {
            return;
        }

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE lesson_media MODIFY type ENUM('image', 'video', 'link', 'slides') NOT NULL");
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('lesson_media')) {
            return;
        }

        DB::table('lesson_media')
            ->where('type', 'slides')
            ->update(['type' => 'link']);

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE lesson_media MODIFY type ENUM('image', 'video', 'link') NOT NULL");
        }
    }
};
