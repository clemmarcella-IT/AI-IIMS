<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Student;
use App\Models\TestAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgressController extends Controller
{
    public function index(Request $request): Response
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        $progress = LessonProgress::query()
            ->with('lesson:id,title,subject,topic')
            ->where('student_id', $student->id)
            ->latest('updated_at')
            ->get();
        $publishedLessons = Lesson::query()->where('is_published', true)->count();
        $pretest = $this->attempt($student, 'pretest');
        $posttest = $this->attempt($student, 'posttest');

        return Inertia::render('student/progress/index', [
            'summary' => [
                'published_lessons' => $publishedLessons,
                'started_lessons' => $progress->count(),
                'completed_lessons' => $progress->where('status', 'completed')->count(),
                'average_progress' => $this->average($progress->pluck('progress_percentage')),
                'average_score' => $this->average($progress->pluck('score_percentage')),
                'pretest' => $this->serializeAttempt($pretest),
                'posttest' => $this->serializeAttempt($posttest),
                'gain' => $pretest && $posttest
                    ? round((float) $posttest->percentage - (float) $pretest->percentage, 2)
                    : null,
            ],
            'lessons' => $progress->map(fn (LessonProgress $item): array => [
                'lesson_id' => $item->lesson_id,
                'title' => $item->lesson?->title,
                'subject' => $item->lesson?->subject,
                'topic' => $item->lesson?->topic,
                'status' => $item->status,
                'progress_percentage' => $item->progress_percentage,
                'score_percentage' => $item->score_percentage !== null ? (float) $item->score_percentage : null,
                'time_spent_seconds' => $item->time_spent_seconds,
                'updated_at' => $item->updated_at?->toDateString(),
            ])->values(),
            'quarterlyGrades' => $student->quarterlyGrades()
                ->latest('updated_at')
                ->get()
                ->map(fn ($grade): array => [
                    'subject' => $grade->subject,
                    'school_year' => $grade->school_year,
                    'quarter_1' => $grade->quarter_1 !== null ? (float) $grade->quarter_1 : null,
                    'quarter_2' => $grade->quarter_2 !== null ? (float) $grade->quarter_2 : null,
                    'quarter_3' => $grade->quarter_3 !== null ? (float) $grade->quarter_3 : null,
                    'quarter_4' => $grade->quarter_4 !== null ? (float) $grade->quarter_4 : null,
                    'average' => $grade->average(),
                ]),
        ]);
    }

    private function attempt(Student $student, string $type): ?TestAttempt
    {
        return $student->testAttempts()->where('test_type', $type)->latest('submitted_at')->first();
    }

    private function serializeAttempt(?TestAttempt $attempt): ?array
    {
        return $attempt ? [
            'score' => $attempt->score,
            'total_items' => $attempt->total_items,
            'percentage' => (float) $attempt->percentage,
            'submitted_at' => $attempt->submitted_at?->toDateString(),
        ] : null;
    }

    private function average($values): ?float
    {
        $values = collect($values)->filter(fn ($value): bool => $value !== null);

        return $values->isEmpty() ? null : round($values->avg(), 2);
    }
}
