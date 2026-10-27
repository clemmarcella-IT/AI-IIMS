<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class LessonActivity extends Model
{
    protected $fillable = [
        'lesson_id',
        'lesson_section_id',
        'type',
        'title',
        'instruction',
        'payload',
        'correct_answer',
        'explanation',
        'record_score',
        'sort_order',
    ];

    protected $casts = [
        'payload' => 'array',
        'correct_answer' => 'array',
        'record_score' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function lessonSection(): BelongsTo
    {
        return $this->belongsTo(LessonSection::class);
    }

    public function question(): HasOne
    {
        return $this->hasOne(LessonQuestion::class);
    }

    public function studentAnswers(): HasMany
    {
        return $this->hasMany(StudentActivityAnswer::class);
    }

    public function hasStudentVisibleContent(): bool
    {
        $payload = $this->payload ?? [];

        return match ($this->type) {
            'mini_quiz' => $this->hasMiniQuizContent($payload),
            'true_false' => $this->hasText($payload['statement'] ?? null),
            'fill_blank' => $this->hasText($payload['sentence'] ?? null),
            'matching' => collect($payload['pairs'] ?? [])
                ->contains(fn ($pair): bool => is_array($pair)
                    && $this->hasText($pair['left'] ?? null)
                    && $this->hasText($pair['right'] ?? null)),
            'sequencing' => collect($payload['items'] ?? [])
                ->filter(fn ($item): bool => $this->hasText($item))
                ->count() >= 2,
            'reflection' => $this->hasText($payload['prompt'] ?? null)
                || $this->hasText($this->instruction),
            'clickable_activity' => $this->hasText($payload['question'] ?? null)
                && collect($payload['cards'] ?? [])
                    ->contains(fn ($card): bool => is_array($card)
                        && $this->hasText($card['label'] ?? null)),
            default => false,
        };
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function hasMiniQuizContent(array $payload): bool
    {
        $question = $payload['question'] ?? $this->question?->question_text;
        $choices = collect($payload['choices'] ?? [
            $this->question?->option_a,
            $this->question?->option_b,
            $this->question?->option_c,
            $this->question?->option_d,
        ]);

        return $this->hasText($question)
            && $choices->filter(fn ($choice): bool => $this->hasText($choice))->count() >= 2;
    }

    private function hasText(mixed $value): bool
    {
        return trim((string) $value) !== '';
    }
}
