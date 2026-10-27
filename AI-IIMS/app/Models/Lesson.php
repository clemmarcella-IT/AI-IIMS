<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    protected $fillable = [
        'teacher_id',
        'title',
        'subject',
        'topic',
        'content',
        'objectives',
        'activities',
        'image_prompt',
        'video_prompt',
        'ai_suggestions',
        'difficulty_level',
        'is_published',
    ];

    protected $casts = [
        'activities' => 'array',
        'ai_suggestions' => 'array',
        'is_published' => 'boolean',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(LessonQuestion::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(LessonSection::class)->orderBy('sort_order');
    }

    public function media(): HasMany
    {
        return $this->hasMany(LessonMedia::class)->orderBy('sort_order');
    }

    public function lessonActivities(): HasMany
    {
        return $this->hasMany(LessonActivity::class)->orderBy('sort_order');
    }

    public function aiSuggestions(): HasMany
    {
        return $this->hasMany(AiLessonSuggestion::class);
    }

    public function cuePoints(): HasMany
    {
        return $this->hasManyThrough(LessonCuePoint::class, LessonMedia::class);
    }
}
