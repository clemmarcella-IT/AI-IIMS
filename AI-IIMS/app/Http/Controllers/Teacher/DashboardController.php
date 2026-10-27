<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TestAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $teacher = $request->user()?->teacher;

        abort_unless($teacher instanceof Teacher, 403);

        $lessons = $this->lessonsFor($teacher);
        $lessonIds = $lessons->pluck('id');

        $students = Student::query()
            ->with([
                'testAttempts',
                'lessonProgress' => fn ($query) => $lessonIds->isEmpty()
                    ? $query->whereRaw('1 = 0')
                    : $query
                        ->whereIn('lesson_id', $lessonIds)
                        ->with('lesson:id,title')
                        ->latest('last_activity_at')
                        ->latest('updated_at'),
            ])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn (Student $student): array => $this->studentProgressFor($student, $lessons->count()));

        $pretestScores = $students
            ->pluck('pretestScore')
            ->filter(fn ($score): bool => $score !== null);
        $posttestScores = $students
            ->pluck('posttestScore')
            ->filter(fn ($score): bool => $score !== null);
        $progressScores = $students
            ->pluck('progress')
            ->filter(fn ($progress): bool => $progress !== null);

        return Inertia::render('dashboard/teacher', [
            'summary' => [
                'studentsCount' => $students->count(),
                'lessonsCount' => $lessons->count(),
                'publishedLessonsCount' => $lessons
                    ->where('is_published', true)
                    ->count(),
                'averagePretestScore' => $this->roundedAverage($pretestScores),
                'averagePosttestScore' => $this->roundedAverage($posttestScores),
                'averageProgress' => $this->roundedAverage($progressScores),
            ],
            'studentProgress' => $students,
        ]);
    }

    /**
     * @return Collection<int, Lesson>
     */
    private function lessonsFor(Teacher $teacher): Collection
    {
        return $teacher->lessons()
            ->latest('updated_at')
            ->get(['id', 'teacher_id', 'title', 'is_published']);
    }

    /**
     * @return array<string, mixed>
     */
    private function studentProgressFor(Student $student, int $teacherLessonCount): array
    {
        $pretest = $this->latestAttemptFor($student, 'pretest');
        $posttest = $this->latestAttemptFor($student, 'posttest');
        $latestProgress = $this->latestProgressFor($student);
        $averageProgress = $this->roundedAverage(
            $student->lessonProgress->pluck('progress_percentage'),
        );
        $completedLessons = $student->lessonProgress
            ->where('status', 'completed')
            ->count();

        return [
            'id' => $student->id,
            'name' => $student->full_name,
            'lesson' => $latestProgress?->lesson?->title,
            'pretestScore' => $pretest?->percentage !== null
                ? (float) $pretest->percentage
                : null,
            'posttestScore' => $posttest?->percentage !== null
                ? (float) $posttest->percentage
                : null,
            'progress' => $averageProgress,
            'status' => $this->statusFor(
                $averageProgress,
                $completedLessons,
                $teacherLessonCount,
                $pretest,
                $posttest,
            ),
        ];
    }

    private function latestAttemptFor(Student $student, string $testType): ?TestAttempt
    {
        return $student->testAttempts
            ->where('test_type', $testType)
            ->sortByDesc(fn (TestAttempt $attempt): int => $attempt->submitted_at?->getTimestamp()
                ?? $attempt->updated_at?->getTimestamp()
                ?? 0)
            ->first();
    }

    private function latestProgressFor(Student $student): ?LessonProgress
    {
        return $student->lessonProgress
            ->sortByDesc(fn (LessonProgress $progress): int => $progress->last_activity_at?->getTimestamp()
                ?? $progress->completed_at?->getTimestamp()
                ?? $progress->updated_at?->getTimestamp()
                ?? 0)
            ->first();
    }

    private function statusFor(
        ?int $averageProgress,
        int $completedLessons,
        int $teacherLessonCount,
        ?TestAttempt $pretest,
        ?TestAttempt $posttest,
    ): string {
        if ($teacherLessonCount > 0 && $completedLessons >= $teacherLessonCount) {
            return 'Completed';
        }

        if ($averageProgress !== null && $averageProgress < 50) {
            return 'Needs Support';
        }

        if (
            $pretest?->percentage !== null
            && $posttest?->percentage !== null
            && (float) $posttest->percentage < (float) $pretest->percentage
        ) {
            return 'Needs Support';
        }

        return 'On Track';
    }

    /**
     * @param  Collection<int, mixed>  $values
     */
    private function roundedAverage(Collection $values): ?int
    {
        if ($values->isEmpty()) {
            return null;
        }

        return (int) round($values->avg());
    }
}
