<?php

use App\Jobs\WarmLessonAiFeedback;
use App\Models\Lesson;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('ai-feedback:warm', function () {
    $lessonIds = Lesson::query()->where('is_published', true)->pluck('id');

    $lessonIds->each(fn (int $lessonId) => WarmLessonAiFeedback::dispatch($lessonId));

    $this->info("Queued AI feedback warmup for {$lessonIds->count()} published lessons.");
})->purpose('Queue Gemini feedback warmup for published lessons');
