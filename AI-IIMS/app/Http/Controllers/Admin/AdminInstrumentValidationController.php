<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResearchInstrumentReview;
use App\Models\Survey;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminInstrumentValidationController extends Controller
{
    public function index(): Response
    {
        $surveys = Survey::query()
            ->with(['questions', 'responses.answers'])
            ->withCount(['questions', 'responses'])
            ->latest('updated_at')
            ->get()
            ->map(fn (Survey $survey): array => [
                'id' => $survey->id,
                'title' => $survey->title,
                'is_published' => $survey->is_published,
                'questions_count' => $survey->questions_count,
                'responses_count' => $survey->responses_count,
                'cronbach_alpha' => $this->cronbachAlpha($survey),
                'alpha_status' => $this->alphaStatus($survey),
            ]);

        $reviews = ResearchInstrumentReview::query()
            ->with('survey:id,title')
            ->latest('reviewed_at')
            ->latest()
            ->get()
            ->map(fn (ResearchInstrumentReview $review): array => [
                'id' => $review->id,
                'survey_title' => $review->survey?->title ?? 'General instrument',
                'review_type' => $review->review_type,
                'reviewer_name' => $review->reviewer_name,
                'reviewer_role' => $review->reviewer_role,
                'validity_rating' => $review->validity_rating,
                'comments' => $review->comments,
                'reviewed_at' => $review->reviewed_at?->toDateString(),
            ]);

        return Inertia::render('admin/instruments/index', [
            'surveys' => $surveys,
            'reviews' => $reviews,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'survey_id' => ['nullable', 'integer', 'exists:surveys,id'],
            'review_type' => ['required', Rule::in(['expert_review', 'pilot_test'])],
            'reviewer_name' => ['required', 'string', 'max:255'],
            'reviewer_role' => ['nullable', 'string', 'max:255'],
            'validity_rating' => ['nullable', 'integer', 'between:1,5'],
            'comments' => ['nullable', 'string'],
            'reviewed_at' => ['nullable', 'date'],
        ]);

        ResearchInstrumentReview::query()->create($data);

        return back()->with('success', 'Instrument review recorded.');
    }

    private function alphaStatus(Survey $survey): string
    {
        if ($survey->questions->count() < 2) {
            return 'Needs at least 2 questions';
        }

        if ($survey->responses->count() < 2) {
            return 'Needs at least 2 responses';
        }

        return $this->cronbachAlpha($survey) === null
            ? 'Responses must answer all questions'
            : 'Ready';
    }

    private function cronbachAlpha(Survey $survey): ?float
    {
        $questionIds = $survey->questions->pluck('id')->values();
        $itemCount = $questionIds->count();

        if ($itemCount < 2) {
            return null;
        }

        $rows = $survey->responses
            ->map(function ($response) use ($questionIds): ?array {
                $ratings = $response->answers->keyBy('survey_question_id');
                $row = $questionIds->map(fn (int $id) => $ratings->get($id)?->rating);

                return $row->contains(null) ? null : $row->map(fn ($rating): int => (int) $rating)->all();
            })
            ->filter()
            ->values();

        if ($rows->count() < 2) {
            return null;
        }

        $itemVariances = collect(range(0, $itemCount - 1))
            ->sum(fn (int $index): float => $this->variance($rows->pluck($index)));
        $totalVariance = $this->variance($rows->map(fn (array $row): int => array_sum($row)));

        if ($totalVariance <= 0.0) {
            return null;
        }

        return round(($itemCount / ($itemCount - 1)) * (1 - ($itemVariances / $totalVariance)), 4);
    }

    private function variance(Collection $values): float
    {
        $count = $values->count();

        if ($count < 2) {
            return 0.0;
        }

        $mean = $values->avg();

        return (float) $values->sum(fn ($value): float => (($value - $mean) ** 2)) / ($count - 1);
    }
}
