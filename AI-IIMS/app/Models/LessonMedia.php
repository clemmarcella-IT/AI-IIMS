<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LessonMedia extends Model
{
    protected $table = 'lesson_media';

    protected $fillable = [
        'lesson_id',
        'lesson_section_id',
        'type',
        'url',
        'caption',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(LessonSection::class, 'lesson_section_id');
    }

    public function cuePoints(): HasMany
    {
        return $this->hasMany(LessonCuePoint::class)->orderBy('timestamp_seconds');
    }
}
