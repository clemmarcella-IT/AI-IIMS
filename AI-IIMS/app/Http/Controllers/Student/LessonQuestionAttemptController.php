<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\LessonQuestion;
use App\Models\Student;
use App\Models\StudentLessonQuestionAttempt;
use App\Services\StudentLessonFlowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LessonQuestionAttemptController extends Controller
{
    public function store(Request $request, LessonQuestion $question, StudentLessonFlowService $flowService): JsonResponse
    {
        $student = $request->user()?->student;
        $lesson = $question->lesson;

        abort_unless($student instanceof Student, 403);
        abort_unless($lesson?->is_published && $question->lesson_activity_id === null, 404);

        $step = collect($flowService->flowFor($lesson, $student)['steps'])
            ->firstWhere('key', "quiz:{$question->id}");
        abort_unless($step && $step['is_unlocked'], 422);

        $data = $request->validate([
            'selected_answer' => ['required', Rule::in(['A', 'B', 'C', 'D'])],
        ]);
        $attemptNumber = StudentLessonQuestionAttempt::query()
            ->where('student_id', $student->id)
            ->where('lesson_question_id', $question->id)
            ->max('attempt_number') + 1;
        $isCorrect = $data['selected_answer'] === $question->correct_answer;

        StudentLessonQuestionAttempt::query()->create([
            'student_id' => $student->id,
            'lesson_question_id' => $question->id,
            'attempt_number' => $attemptNumber,
            'selected_answer' => $data['selected_answer'],
            'is_correct' => $isCorrect,
        ]);

        return response()->json([
            'is_correct' => $isCorrect,
            'mastered' => $isCorrect,
            'attempt_number' => $attemptNumber,
            'feedback' => $isCorrect ? ($question->explanation ?: 'Correct. Nice work.') : 'Review the lesson and try again.',
            'flow' => $flowService->recalculate($lesson, $student),
        ]);
    }
}
