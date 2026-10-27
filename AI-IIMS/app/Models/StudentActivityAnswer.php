<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentActivityAnswer extends Model
{
    protected $fillable = [
        'student_id',
        'lesson_activity_id',
        'answer',
        'is_correct',
        'score',
        'feedback',
    ];

    protected $casts = [
        'answer' => 'array',
        'is_correct' => 'boolean',
        'score' => 'decimal:2',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(LessonActivity::class, 'lesson_activity_id');
    }
}
