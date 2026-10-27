<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TestQuestion extends Model
{
    protected $fillable = [
        'test_id',
        'question',
        'choices',
        'correct_answer',
        'explanation',
        'points',
    ];

    protected $casts = [
        'choices' => 'array',
        'points' => 'integer',
    ];

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function attemptAnswers(): HasMany
    {
        return $this->hasMany(TestAttemptAnswer::class);
    }
}
