<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\LessonActivity;
use App\Models\Student;
use App\Models\StudentActivityAnswer;
use App\Models\StudentActivityAttempt;
use App\Services\StudentLessonFlowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentLessonActivityController extends Controller
{
    public function submit(Request $request, LessonActivity $activity, StudentLessonFlowService $flowService): JsonResponse
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        $activity->load(['lesson', 'question']);

        abort_unless($activity->lesson?->is_published, 404);
        $flowStep = collect($flowService->flowFor($activity->lesson, $student)['steps'])
            ->firstWhere('key', "activity:{$activity->id}");
        abort_unless($flowStep && $flowStep['is_unlocked'], 422);

        $existingAnswer = StudentActivityAnswer::query()
            ->where('student_id', $student->id)
            ->where('lesson_activity_id', $activity->id)
            ->first();
        $retryMastered = StudentActivityAttempt::query()
            ->where('student_id', $student->id)
            ->where('lesson_activity_id', $activity->id)
            ->where('is_correct', true)
            ->exists();
        $alreadyMastered = $existingAnswer
            && ($existingAnswer->is_correct === true || $existingAnswer->is_correct === null || $retryMastered);

        if ($alreadyMastered) {
            return response()->json([
                ...$this->responseFor(
                    $existingAnswer,
                    $existingAnswer->is_correct,
                    $existingAnswer->feedback,
                    max(1, StudentActivityAttempt::query()->where('student_id', $student->id)->where('lesson_activity_id', $activity->id)->max('attempt_number') ?? 1),
                    true,
                ),
                'flow' => $flowService->flowFor($activity->lesson, $student),
            ]);
        }

        $data = $request->validate([
            'answer' => $this->answerRulesFor($activity->type),
        ]);

        $answer = $data['answer'] ?? null;
        $result = $this->checkAnswer($activity, $answer);

        $attemptNumber = $existingAnswer
            ? max(2, (int) StudentActivityAttempt::query()->where('student_id', $student->id)->where('lesson_activity_id', $activity->id)->max('attempt_number') + 1)
            : 1;

        DB::transaction(function () use ($student, $activity, $answer, $result, $existingAnswer, $attemptNumber): void {
            $firstAnswer = $existingAnswer ?? StudentActivityAnswer::query()->create([
                'student_id' => $student->id,
                'lesson_activity_id' => $activity->id,
                'answer' => $answer,
                'is_correct' => $result['is_correct'],
                'score' => $result['score'],
                'feedback' => $result['feedback'],
            ]);

            StudentActivityAttempt::query()->updateOrCreate(
                [
                    'student_id' => $student->id,
                    'lesson_activity_id' => $activity->id,
                    'attempt_number' => $attemptNumber,
                ],
                [
                    'answer' => $answer,
                    'is_correct' => $result['is_correct'],
                    'score' => $result['score'],
                    'feedback' => $result['feedback'],
                ],
            );

            if (! $existingAnswer) {
                $firstAnswer->touch();
            }
        });

        $flow = $flowService->recalculate($activity->lesson, $student);
        $firstAnswer = $existingAnswer ?? StudentActivityAnswer::query()
            ->where('student_id', $student->id)
            ->where('lesson_activity_id', $activity->id)
            ->firstOrFail();
        $mastered = $result['is_correct'] === true || $result['is_correct'] === null;

        return response()->json([
            ...$this->responseFor(
                $firstAnswer,
                $result['is_correct'],
                $result['feedback'],
                $attemptNumber,
                $mastered,
                $result['score'],
            ),
            'flow' => $flow,
        ]);
    }

    /**
     * @return array<int, string>
     */
    private function answerRulesFor(string $type): array
    {
        return match ($type) {
            'true_false' => ['required', 'boolean'],
            'fill_blank', 'reflection', 'mini_quiz' => ['required', 'string'],
            'matching', 'sequencing', 'clickable_activity' => ['required', 'array'],
            default => ['required'],
        };
    }

    /**
     * @return array{is_correct: bool|null, score: float|null, feedback: string}
     */
    private function checkAnswer(LessonActivity $activity, mixed $answer): array
    {
        $correctAnswer = $this->correctAnswerFor($activity);
        $isCorrect = match ($activity->type) {
            'mini_quiz' => (string) $answer === (string) $correctAnswer,
            'true_false' => (bool) $answer === (bool) $correctAnswer,
            'fill_blank' => mb_strtolower(trim((string) $answer)) === mb_strtolower(trim((string) $correctAnswer)),
            'matching' => $this->normalizePairs($answer) === $this->normalizePairs($correctAnswer),
            'sequencing' => array_values($answer) === array_values(is_array($correctAnswer) ? $correctAnswer : []),
            'clickable_activity' => $this->normalizeLabels($answer) === $this->normalizeLabels($correctAnswer),
            'reflection' => null,
            default => false,
        };

        if ($activity->type === 'reflection') {
            return [
                'is_correct' => null,
                'score' => null,
                'feedback' => 'Reflection saved.',
            ];
        }

        return [
            'is_correct' => $isCorrect,
            'score' => $isCorrect ? 1.0 : 0.0,
            'feedback' => $isCorrect
                ? ($activity->explanation ?: 'Correct. Nice work.')
                : 'Review your answer and compare it with the correct response.',
        ];
    }

    private function correctAnswerFor(LessonActivity $activity): mixed
    {
        if ($activity->correct_answer !== null) {
            return $activity->correct_answer;
        }

        if ($activity->type === 'mini_quiz' && $activity->question) {
            $choices = [
                'A' => $activity->question->option_a,
                'B' => $activity->question->option_b,
                'C' => $activity->question->option_c,
                'D' => $activity->question->option_d,
            ];

            return $choices[$activity->question->correct_answer] ?? $activity->question->correct_answer;
        }

        if ($activity->type === 'clickable_activity') {
            return collect($activity->payload['cards'] ?? [])
                ->filter(fn (array $card): bool => (bool) ($card['is_correct'] ?? false))
                ->pluck('label')
                ->values()
                ->all();
        }

        return null;
    }

    private function responseFor(
        StudentActivityAnswer $firstAnswer,
        ?bool $isCorrect,
        ?string $feedback,
        int $attemptNumber,
        bool $mastered,
        ?float $attemptScore = null,
    ): array {
        return [
            'is_correct' => $isCorrect,
            'score' => $attemptScore ?? ($firstAnswer->score !== null ? (float) $firstAnswer->score : null),
            'first_score' => $firstAnswer->score !== null ? (float) $firstAnswer->score : null,
            'feedback' => $feedback,
            'attempt_number' => $attemptNumber,
            'mastered' => $mastered,
        ];
    }

    private function normalizePairs(mixed $pairs): array
    {
        if (! is_array($pairs)) {
            return [];
        }

        return collect($pairs)
            ->map(fn ($pair): array => [
                'left' => (string) ($pair['left'] ?? ''),
                'right' => (string) ($pair['right'] ?? ''),
            ])
            ->values()
            ->all();
    }

    private function normalizeLabels(mixed $labels): array
    {
        if (! is_array($labels)) {
            return [];
        }

        return collect($labels)
            ->map(fn ($label): string => trim((string) $label))
            ->filter()
            ->sort()
            ->values()
            ->all();
    }
}
