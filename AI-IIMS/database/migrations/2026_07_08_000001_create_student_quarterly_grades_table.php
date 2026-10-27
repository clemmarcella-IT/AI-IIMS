<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_quarterly_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('subject')->default('General');
            $table->string('school_year')->nullable();
            $table->decimal('quarter_1', 5, 2)->nullable();
            $table->decimal('quarter_2', 5, 2)->nullable();
            $table->decimal('quarter_3', 5, 2)->nullable();
            $table->decimal('quarter_4', 5, 2)->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'subject', 'school_year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_quarterly_grades');
    }
};
