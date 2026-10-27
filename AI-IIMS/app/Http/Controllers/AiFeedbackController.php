<?php

namespace App\Http\Controllers;

use App\Models\LessonActivity;
use App\Models\LessonQuestion;
use App\Models\Student;
use App\Models\StudentActivityAttempt;
use App\Models\StudentLessonQuestionAttempt;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AiFeedbackController extends Controller
{
    public function explain(Request $request, GeminiService $gemini): JsonResponse
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        $data = $request->validate([
            'source_type' => ['required', Rule::in(['activity', 'lesson_question'])],
            'source_id' => ['required', 'integer'],
        ]);

        [$question, $studentAnswer, $correctAnswer] = $data['source_type'] === 'activity'
            ? $this->activityContext($student, $data['source_id'])
            : $this->questionContext($student, $data['source_id']);

        return response()->json([
            'explanation' => $gemini->explainWrongAnswer($question, $studentAnswer, $correctAnswer),
        ]);
    }

    private function activityContext(Student $student, int $activityId): array
    {
        $activity = LessonActivity::query()->with(['lesson', 'question'])->findOrFail($activityId);
        abort_unless($activity->lesson?->is_published, 404);
        $attempt = StudentActivityAttempt::query()
            ->where('student_id', $student->id)
            ->where('lesson_activity_id', $activity->id)
            ->where('is_correct', false)
            ->latest('attempt_number')
            ->firstOrFail();

        $question = $activity->payload['question']
            ?? $activity->payload['statement']
            ?? $activity->payload['sentence']
            ?? $activity->title;

        return [
            (string) $question,
            $this->stringify($attempt->answer),
            $this->stringify($this->correctAnswerFor($activity)),
        ];
    }

    private function questionContext(Student $student, int $questionId): array
    {
        $question = LessonQuestion::query()->with('lesson')->findOrFail($questionId);
        abort_unless($question->lesson?->is_published && $question->lesson_activity_id === null, 404);
        $attempt = StudentLessonQuestionAttempt::query()
            ->where('student_id', $student->id)
            ->where('lesson_question_id', $question->id)
            ->where('is_correct', false)
            ->latest('attempt_number')
            ->firstOrFail();
        $options = [
            'A' => $question->option_a,
            'B' => $question->option_b,
            'C' => $question->option_c,
            'D' => $question->option_d,
        ];

        return [
            $question->question_text,
            (string) ($options[$attempt->selected_answer] ?? $attempt->selected_answer),
            (string) ($options[$question->correct_answer] ?? $question->correct_answer),
        ];
    }

    private function correctAnswerFor(LessonActivity $activity): mixed
    {
        if ($activity->correct_answer !== null) {
            return $activity->correct_answer;
        }

        if ($activity->type === 'mini_quiz' && $activity->question) {
            $options = [
                'A' => $activity->question->option_a,
                'B' => $activity->question->option_b,
                'C' => $activity->question->option_c,
                'D' => $activity->question->option_d,
            ];

            return $options[$activity->question->correct_answer] ?? $activity->question->correct_answer;
        }

        return null;
    }

    private function stringify(mixed $value): string
    {
        return is_string($value) ? $value : (json_encode($value) ?: 'No answer');
    }
}
