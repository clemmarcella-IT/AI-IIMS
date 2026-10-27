<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminSurveyController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $surveys = Survey::query()
            ->withCount('questions')
            ->withCount('responses')
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search): void {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            }))
            ->latest('updated_at')
            ->get()
            ->map(fn (Survey $survey): array => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
                'is_published' => $survey->is_published,
                'questions_count' => $survey->questions_count,
                'responses_count' => $survey->responses_count,
                'updated_at' => $survey->updated_at?->toDateString(),
            ]);

        return Inertia::render('admin/surveys/index', [
            'surveys' => $surveys,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/surveys/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        DB::transaction(function () use ($data): void {
            $survey = Survey::query()->create([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'is_published' => false,
            ]);

            $this->syncQuestions($survey, $data['questions']);
        });

        return redirect()->route('admin.surveys.index')->with('success', 'Survey created.');
    }

    public function edit(Survey $survey): Response
    {
        $survey->load(['questions' => fn ($q) => $q->orderBy('sort_order')]);

        return Inertia::render('admin/surveys/edit', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
                'is_published' => $survey->is_published,
                'questions' => $survey->questions->map(fn (SurveyQuestion $q): array => [
                    'id' => $q->id,
                    'question' => $q->question,
                    'category' => $q->category,
                    'sort_order' => $q->sort_order,
                ])->values(),
            ],
        ]);
    }

    public function update(Request $request, Survey $survey): RedirectResponse
    {
        $data = $this->validatedData($request);

        DB::transaction(function () use ($data, $survey): void {
            $survey->update([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
            ]);

            $survey->questions()->delete();
            $this->syncQuestions($survey, $data['questions']);
        });

        return redirect()->route('admin.surveys.index')->with('success', 'Survey updated.');
    }

    public function destroy(Survey $survey): RedirectResponse
    {
        $survey->delete();

        return back()->with('success', 'Survey deleted.');
    }

    public function togglePublish(Survey $survey): RedirectResponse
    {
        $survey->update(['is_published' => ! $survey->is_published]);

        $status = $survey->is_published ? 'published' : 'unpublished';

        return back()->with('success', "Survey {$status}.");
    }

    public function results(Survey $survey): Response
    {
        $survey->load(['questions', 'responses.answers']);

        $categories = [
            'interactivity' => 'Interactivity',
            'personalization' => 'Personalization',
            'feedback_timeliness' => 'Feedback Timeliness',
            'ease_of_use' => 'Ease of Use',
            'engagement' => 'Engagement',
        ];

        $categoryAverages = [];
        foreach ($categories as $key => $label) {
            $questions = $survey->questions->where('category', $key);
            $questionIds = $questions->pluck('id');

            $ratings = $survey->responses
                ->flatMap(fn ($response) => $response->answers)
                ->whereIn('survey_question_id', $questionIds)
                ->pluck('rating');

            $categoryAverages[$key] = [
                'label' => $label,
                'average' => $ratings->count() > 0 ? round($ratings->avg(), 2) : null,
                'count' => $ratings->count(),
            ];
        }

        $totalResponses = $survey->responses->count();

        return Inertia::render('admin/surveys/results', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
                'is_published' => $survey->is_published,
            ],
            'categoryAverages' => $categoryAverages,
            'totalResponses' => $totalResponses,
            'questions' => $survey->questions->map(fn (SurveyQuestion $q): array => [
                'id' => $q->id,
                'question' => $q->question,
                'category' => $q->category,
                'average' => $survey->responses->count() > 0
                    ? round(
                        $survey->responses
                            ->flatMap(fn ($r) => $r->answers)
                            ->where('survey_question_id', $q->id)
                            ->avg('rating') ?? 0,
                        2
                    )
                    : null,
            ])->values(),
        ]);
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question' => ['required', 'string', 'max:1000'],
            'questions.*.category' => ['required', Rule::in([
                'interactivity',
                'personalization',
                'feedback_timeliness',
                'ease_of_use',
                'engagement',
            ])],
        ]);
    }

    private function syncQuestions(Survey $survey, array $questions): void
    {
        foreach ($questions as $index => $q) {
            $survey->questions()->create([
                'question' => $q['question'],
                'category' => $q['category'],
                'sort_order' => $index,
            ]);
        }
    }
}
