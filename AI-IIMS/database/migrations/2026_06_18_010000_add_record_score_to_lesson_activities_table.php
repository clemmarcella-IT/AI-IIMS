<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('lesson_activities')) {
            return;
        }

        Schema::table('lesson_activities', function (Blueprint $table) {
            if (! Schema::hasColumn('lesson_activities', 'record_score')) {
                $table->boolean('record_score')->default(true)->after('explanation');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('lesson_activities')) {
            return;
        }

        Schema::table('lesson_activities', function (Blueprint $table) {
            if (Schema::hasColumn('lesson_activities', 'record_score')) {
                $table->dropColumn('record_score');
            }
        });
    }
};
