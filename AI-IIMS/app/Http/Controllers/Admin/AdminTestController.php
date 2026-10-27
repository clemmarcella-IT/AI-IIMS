<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Test;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminTestController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $tests = Test::query()
            ->withCount('questions')
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search): void {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('test_type', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('topic', 'like', "%{$search}%");
            }))
            ->latest('updated_at')
            ->get()
            ->map(fn (Test $test): array => [
                'id' => $test->id,
                'title' => $test->title,
                'test_type' => $test->test_type,
                'subject' => $test->subject,
                'topic' => $test->topic,
                'is_active' => $test->is_active,
                'questions_count' => $test->questions_count,
                'updated_at' => $test->updated_at?->toDateString(),
            ]);

        return Inertia::render('admin/tests/index', [
            'tests' => $tests,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tests/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        DB::transaction(function () use ($data): void {
            $test = Test::query()->create($this->testPayload($data));
            $this->syncQuestions($test, $data['questions']);
            $this->enforceSingleActiveTest($test);
        });

        return redirect()->route('admin.tests.index')->with('success', 'Test created.');
    }

    public function edit(Test $test): Response
    {
        $test->load(['questions' => fn ($query) => $query->oldest('id')]);

        return Inertia::render('admin/tests/edit', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'test_type' => $test->test_type,
                'subject' => $test->subject,
                'topic' => $test->topic,
                'is_active' => $test->is_active,
                'questions' => $test->questions->map(fn ($question): array => [
                    'id' => $question->id,
                    'question' => $question->question,
                    'choices' => $question->choices,
                    'correct_answer' => $question->correct_answer,
                    'explanation' => $question->explanation,
                    'points' => $question->points,
                ])->values(),
            ],
        ]);
    }

    public function update(Request $request, Test $test): RedirectResponse
    {
        $data = $this->validatedData($request);

        DB::transaction(function () use ($data, $test): void {
            $test->update($this->testPayload($data));
            $test->questions()->delete();
            $this->syncQuestions($test, $data['questions']);
            $this->enforceSingleActiveTest($test);
        });

        return redirect()->route('admin.tests.index')->with('success', 'Test updated.');
    }

    public function destroy(Test $test): RedirectResponse
    {
        $test->delete();

        return back()->with('success', 'Test deleted.');
    }

    private function validatedData(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'test_type' => ['required', Rule::in(['pretest', 'posttest'])],
            'subject' => ['nullable', 'string', 'max:255'],
            'topic' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question' => ['required', 'string'],
            'questions.*.choices.A' => ['required', 'string', 'max:255'],
            'questions.*.choices.B' => ['required', 'string', 'max:255'],
            'questions.*.choices.C' => ['required', 'string', 'max:255'],
            'questions.*.choices.D' => ['required', 'string', 'max:255'],
            'questions.*.correct_answer' => ['required', Rule::in(['A', 'B', 'C', 'D'])],
            'questions.*.explanation' => ['nullable', 'string'],
            'questions.*.points' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        foreach ($data['questions'] as $index => $question) {
            $answer = $question['correct_answer'];
            if (trim((string) $question['choices'][$answer]) === '') {
                throw ValidationException::withMessages([
                    "questions.{$index}.correct_answer" => 'The correct answer must match a filled choice.',
                ]);
            }
        }

        return $data;
    }

    private function testPayload(array $data): array
    {
        return [
            'title' => $data['title'],
            'test_type' => $data['test_type'],
            'subject' => $data['subject'] ?? null,
            'topic' => $data['topic'] ?? null,
            'is_active' => (bool) $data['is_active'],
        ];
    }

    private function syncQuestions(Test $test, array $questions): void
    {
        foreach ($questions as $question) {
            $test->questions()->create([
                'question' => $question['question'],
                'choices' => [
                    'A' => $question['choices']['A'],
                    'B' => $question['choices']['B'],
                    'C' => $question['choices']['C'],
                    'D' => $question['choices']['D'],
                ],
                'correct_answer' => $question['correct_answer'],
                'explanation' => $question['explanation'] ?? null,
                'points' => $question['points'],
            ]);
        }
    }

    private function enforceSingleActiveTest(Test $test): void
    {
        if (! $test->is_active) {
            return;
        }

        Test::query()
            ->whereKeyNot($test->id)
            ->where('test_type', $test->test_type)
            ->where('subject', $test->subject)
            ->where('topic', $test->topic)
            ->update(['is_active' => false]);
    }
}
