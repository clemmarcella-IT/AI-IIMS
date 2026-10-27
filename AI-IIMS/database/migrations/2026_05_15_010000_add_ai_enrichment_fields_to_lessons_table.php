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
        Schema::table('lessons', function (Blueprint $table) {
            $table->longText('objectives')->nullable()->after('content');
            $table->json('activities')->nullable()->after('objectives');
            $table->text('image_prompt')->nullable()->after('activities');
            $table->text('video_prompt')->nullable()->after('image_prompt');
            $table->json('ai_suggestions')->nullable()->after('video_prompt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn([
                'objectives',
                'activities',
                'image_prompt',
                'video_prompt',
                'ai_suggestions',
            ]);
        });
    }
};
