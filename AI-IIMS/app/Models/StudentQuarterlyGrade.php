<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentQuarterlyGrade extends Model
{
    protected $fillable = [
        'student_id',
        'subject',
        'school_year',
        'quarter_1',
        'quarter_2',
        'quarter_3',
        'quarter_4',
    ];

    protected $casts = [
        'quarter_1' => 'decimal:2',
        'quarter_2' => 'decimal:2',
        'quarter_3' => 'decimal:2',
        'quarter_4' => 'decimal:2',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function average(): ?float
    {
        $grades = collect([
            $this->quarter_1,
            $this->quarter_2,
            $this->quarter_3,
            $this->quarter_4,
        ])
            ->filter(fn ($grade): bool => $grade !== null)
            ->map(fn ($grade): float => (float) $grade);

        return $grades->isEmpty() ? null : round($grades->avg(), 2);
    }
}
