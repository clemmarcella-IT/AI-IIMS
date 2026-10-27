<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LessonSection extends Model
{
    protected $fillable = [
        'lesson_id',
        'title',
        'content',
        'content_type',
        'sort_order',
        'is_collapsible',
    ];

    protected $casts = [
        'is_collapsible' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function lessonActivities(): HasMany
    {
        return $this->hasMany(LessonActivity::class)->orderBy('sort_order');
    }

    public function media(): HasMany
    {
        return $this->hasMany(LessonMedia::class)->orderBy('sort_order');
    }
}
