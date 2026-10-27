<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentLessonQuestionAttempt extends Model
{
    protected $fillable = [
        'student_id',
        'lesson_question_id',
        'attempt_number',
        'selected_answer',
        'is_correct',
    ];

    protected $casts = [
        'attempt_number' => 'integer',
        'is_correct' => 'boolean',
    ];
}
