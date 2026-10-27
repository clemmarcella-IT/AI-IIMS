<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LessonCuePoint extends Model
{
    protected $fillable = [
        'lesson_media_id',
        'timestamp_seconds',
        'type',
        'question',
        'options',
        'correct_option',
        'explanation',
        'content',
    ];

    protected $casts = [
        'timestamp_seconds' => 'integer',
        'options' => 'array',
    ];

    public function media(): BelongsTo
    {
        return $this->belongsTo(LessonMedia::class, 'lesson_media_id');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(StudentCueResponse::class);
    }
}
