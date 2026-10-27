<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Test;
use App\Models\TestQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentTestController extends Controller
{
    public function pretest(Request $request): Response|RedirectResponse
    {
        $student = $this->studentFrom($request);
        $test = $this->activeTest('pretest');

        if ($this->hasAttempt($student, 'pretest')) {
            return redirect()->route('student.dashboard');
        }

        return $this->renderTest($test);
    }

    public function posttest(Request $request): Response|RedirectResponse
    {
        $student = $this->studentFrom($request);

        if (! $this->hasAttempt($student, 'pretest')) {
            return redirect()->route('student.pretest')
                ->with('warning', 'Please complete the pretest before taking the posttest.');
        }

        if ($this->hasAttempt($student, 'posttest')) {
            return redirect()->route('student.dashboard');
        }

        return $this->renderTest($this->activeTest('posttest'));
    }

    public function submit(Request $request, Test $test): RedirectResponse
    {
        $student = $this->studentFrom($request);

        if (! $test->is_active) {
            abort(404);
        }

        if ($test->test_type === 'posttest' && ! $this->hasAttempt($student, 'pretest')) {
            return redirect()->route('student.pretest')
                ->with('warning', 'Please complete the pretest before taking the posttest.');
        }

        if ($this->hasAttempt($student, $test->test_type)) {
            return redirect()->route('student.dashboard')
                ->with('info', 'You have already submitted this assessment.');
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer', 'distinct'],
            'answers.*.selected_answer' => ['required', 'string', 'max:255'],
        ]);

        $questions = $test->questions()
            ->oldest('id')
            ->get()
            ->keyBy('id');

        $answers = collect($validated['answers'])->keyBy('question_id');

        $answerQuestionIds = $answers->keys()
            ->map(fn ($id): int => (int) $id)
            ->sort()
            ->values()
            ->all();
        $questionIds = $questions->keys()
            ->map(fn ($id): int => (int) $id)
            ->sort()
            ->values()
            ->all();

        if ($questions->isEmpty() || $answerQuestionIds !== $questionIds) {
            throw ValidationException::withMessages([
                'answers' => 'Please answer every question before submitting.',
            ]);
        }

        DB::transaction(function () use ($answers, $questions, $student, $test) {
            $score = 0;
            $totalItems = (int) $questions->sum('points');

            $attempt = $student->testAttempts()->create([
                'test_id' => $test->id,
                'test_type' => $test->test_type,
                'score' => 0,
                'total_items' => $totalItems,
                'percentage' => 0,
                'started_at' => now(),
                'submitted_at' => now(),
            ]);

            $questions->each(function (TestQuestion $question) use ($answers, $attempt, &$score) {
                $selectedAnswer = (string) $answers->get($question->id)['selected_answer'];
                $isCorrect = $selectedAnswer === $question->correct_answer;
                $pointsEarned = $isCorrect ? $question->points : 0;

                $score += $pointsEarned;

                $attempt->answers()->create([
                    'test_question_id' => $question->id,
                    'selected_answer' => $selectedAnswer,
                    'is_correct' => $isCorrect,
                    'points_earned' => $pointsEarned,
                ]);
            });

            $attempt->update([
                'score' => $score,
                'percentage' => $totalItems > 0 ? round(($score / $totalItems) * 100, 2) : 0,
            ]);
        });

        return redirect()->route('student.dashboard')
            ->with('success', 'Assessment submitted.');
    }

    private function activeTest(string $testType): Test
    {
        return Test::query()
            ->with(['questions' => fn ($query) => $query->oldest('id')])
            ->where('test_type', $testType)
            ->where('is_active', true)
            ->firstOrFail();
    }

    private function hasAttempt(Student $student, string $testType): bool
    {
        return $student->testAttempts()
            ->where('test_type', $testType)
            ->exists();
    }

    private function renderTest(Test $test): Response
    {
        return Inertia::render('student/tests/take', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'test_type' => $test->test_type,
                'subject' => $test->subject,
                'topic' => $test->topic,
                'questions' => $test->questions->map(fn (TestQuestion $question): array => [
                    'id' => $question->id,
                    'question' => $question->question,
                    'choices' => $question->choices,
                    'points' => $question->points,
                ])->values(),
            ],
        ]);
    }

    private function studentFrom(Request $request): Student
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        return $student;
    }
}
