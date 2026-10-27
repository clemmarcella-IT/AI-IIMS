<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentCueResponse extends Model
{
    protected $fillable = [
        'student_id',
        'lesson_cue_point_id',
        'answer',
        'is_correct',
        'answered_at',
    ];

    protected $casts = [
        'answer' => 'array',
        'is_correct' => 'boolean',
        'answered_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function cuePoint(): BelongsTo
    {
        return $this->belongsTo(LessonCuePoint::class, 'lesson_cue_point_id');
    }
}
