<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentActivityAttempt extends Model
{
    protected $fillable = [
        'student_id',
        'lesson_activity_id',
        'attempt_number',
        'answer',
        'is_correct',
        'score',
        'feedback',
    ];

    protected $casts = [
        'answer' => 'array',
        'is_correct' => 'boolean',
        'score' => 'decimal:2',
        'attempt_number' => 'integer',
    ];
}
