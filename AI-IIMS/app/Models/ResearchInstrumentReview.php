<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchInstrumentReview extends Model
{
    protected $fillable = [
        'survey_id',
        'review_type',
        'reviewer_name',
        'reviewer_role',
        'validity_rating',
        'comments',
        'reviewed_at',
    ];

    protected $casts = [
        'validity_rating' => 'integer',
        'reviewed_at' => 'date',
    ];

    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }
}
