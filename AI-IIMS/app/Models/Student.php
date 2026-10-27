<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'student_code',
        'first_name',
        'last_name',
        'grade_level',
        'section',
        'consent_status',
    ];

    protected $casts = [
        'consent_status' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lessonProgress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function testAttempts(): HasMany
    {
        return $this->hasMany(TestAttempt::class);
    }

    public function activityAnswers(): HasMany
    {
        return $this->hasMany(StudentActivityAnswer::class);
    }

    public function cueResponses(): HasMany
    {
        return $this->hasMany(StudentCueResponse::class);
    }

    public function quarterlyGrades(): HasMany
    {
        return $this->hasMany(StudentQuarterlyGrade::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
