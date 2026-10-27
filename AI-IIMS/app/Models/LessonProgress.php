<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonProgress extends Model
{
    protected $table = 'lesson_progress';

    protected $fillable = [
        'student_id',
        'lesson_id',
        'status',
        'progress_percentage',
        'earned_score',
        'total_score',
        'score_percentage',
        'scored_activities_count',
        'correct_activities_count',
        'started_at',
        'completed_at',
        'latest_scored_at',
        'time_spent_seconds',
        'last_activity_at',
        'last_video_position_seconds',
    ];

    protected $casts = [
        'progress_percentage' => 'integer',
        'earned_score' => 'decimal:2',
        'total_score' => 'decimal:2',
        'score_percentage' => 'decimal:2',
        'scored_activities_count' => 'integer',
        'correct_activities_count' => 'integer',
        'time_spent_seconds' => 'integer',
        'last_video_position_seconds' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'latest_scored_at' => 'datetime',
        'last_activity_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}
