<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('research_instrument_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('review_type', ['expert_review', 'pilot_test'])->default('expert_review');
            $table->string('reviewer_name');
            $table->string('reviewer_role')->nullable();
            $table->unsignedTinyInteger('validity_rating')->nullable();
            $table->text('comments')->nullable();
            $table->date('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('research_instrument_reviews');
    }
};
