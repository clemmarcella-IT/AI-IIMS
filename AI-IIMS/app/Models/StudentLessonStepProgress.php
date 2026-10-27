<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentLessonStepProgress extends Model
{
    protected $table = 'student_lesson_step_progress';

    protected $fillable = [
        'student_id',
        'lesson_id',
        'lesson_media_id',
        'step_key',
        'position_seconds',
        'completed_at',
    ];

    protected $casts = [
        'position_seconds' => 'integer',
        'completed_at' => 'datetime',
    ];
}
