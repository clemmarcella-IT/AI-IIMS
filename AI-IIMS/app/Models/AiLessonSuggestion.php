<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiLessonSuggestion extends Model
{
    protected $fillable = [
        'lesson_id',
        'teacher_id',
        'suggestion_type',
        'title',
        'content',
        'payload',
        'status',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
