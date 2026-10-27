<?php

namespace App\Jobs;

use App\Models\Lesson;
use App\Models\LessonActivity;
use App\Models\LessonQuestion;
use App\Services\GeminiService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class WarmLessonAiFeedback implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 1200;

    public function __construct(public int $lessonId) {}

    public function handle(GeminiService $gemini): void
    {
        $lesson = Lesson::query()
            ->with(['questions', 'lessonActivities.question'])
            ->find($this->lessonId);

        if (! $lesson?->is_published) {
            return;
        }

        $lesson->questions
            ->whereNull('lesson_activity_id')
            ->each(fn (LessonQuestion $question) => $this->warmQuestion($gemini, $question));

        $lesson->lessonActivities->each(function (LessonActivity $activity) use ($gemini): void {
            if ($activity->type === 'mini_quiz') {
                $question = (string) ($activity->payload['question'] ?? $activity->question?->question_text ?? $activity->title);
                $choices = $activity->payload['choices'] ?? [
                    $activity->question?->option_a,
                    $activity->question?->option_b,
                    $activity->question?->option_c,
                    $activity->question?->option_d,
                ];
                $correctAnswer = $activity->correct_answer;

                if ($correctAnswer === null && $activity->question) {
                    $correctAnswer = $this->questionAnswer($activity->question);
                }

                $this->warmChoices($gemini, $question, $choices, (string) $correctAnswer);
            }

            if ($activity->type === 'true_false') {
                $question = (string) ($activity->payload['statement'] ?? $activity->title);
                $correctAnswer = filter_var($activity->correct_answer, FILTER_VALIDATE_BOOLEAN);

                $gemini->explainWrongAnswer(
                    $question,
                    $correctAnswer ? 'false' : 'true',
                    $correctAnswer ? 'true' : 'false',
                );
            }
        });
    }

    private function warmQuestion(GeminiService $gemini, LessonQuestion $question): void
    {
        $this->warmChoices($gemini, $question->question_text, [
            $question->option_a,
            $question->option_b,
            $question->option_c,
            $question->option_d,
        ], $this->questionAnswer($question));
    }

    private function questionAnswer(LessonQuestion $question): string
    {
        return (string) match ($question->correct_answer) {
            'A' => $question->option_a,
            'B' => $question->option_b,
            'C' => $question->option_c,
            'D' => $question->option_d,
            default => '',
        };
    }

    /**
     * @param  array<int, mixed>  $choices
     */
    private function warmChoices(GeminiService $gemini, string $question, array $choices, string $correctAnswer): void
    {
        collect($choices)
            ->map(fn ($choice): string => trim((string) $choice))
            ->filter(fn (string $choice): bool => $choice !== '' && $choice !== $correctAnswer)
            ->unique()
            ->each(fn (string $choice) => $gemini->explainWrongAnswer($question, $choice, $correctAnswer));
    }
}
