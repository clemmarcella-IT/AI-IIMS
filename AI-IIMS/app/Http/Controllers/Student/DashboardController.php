<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Student;
use App\Models\SurveyResponse;
use App\Models\TestAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        $pretest = $this->attemptFor($student, 'pretest');
        $posttest = $this->attemptFor($student, 'posttest');
        $improvement = $pretest && $posttest
            ? round((float) $posttest->percentage - (float) $pretest->percentage, 2)
            : null;

        $totalLessons = Lesson::query()->where('is_published', true)->count();
        $completedLessons = LessonProgress::query()
            ->where('student_id', $student->id)
            ->where('status', 'completed')
            ->count();
        $lessonsComplete = $totalLessons > 0 && $completedLessons >= $totalLessons;
        $surveySubmitted = SurveyResponse::query()
            ->where('student_id', $student->id)
            ->whereNotNull('submitted_at')
            ->exists();
        $continueProgress = LessonProgress::query()
            ->with('lesson:id,title,subject')
            ->where('student_id', $student->id)
            ->where('status', '!=', 'completed')
            ->latest('last_activity_at')
            ->first();
        $completedLessonIds = LessonProgress::query()
            ->where('student_id', $student->id)
            ->where('status', 'completed')
            ->pluck('lesson_id');
        $continueLesson = $continueProgress?->lesson
            ?? Lesson::query()
                ->where('is_published', true)
                ->whereNotIn('id', $completedLessonIds)
                ->latest('updated_at')
                ->first(['id', 'title', 'subject']);
        $continueLessonProgress = $continueProgress && $continueProgress->lesson_id === $continueLesson?->id
            ? $continueProgress->progress_percentage
            : 0;

        $nextAction = match (true) {
            $pretest === null => $this->nextAction('pretest', 'Start with your pretest', 'Set your baseline so your lessons and progress can be personalized.', '/student/pretest'),
            $continueLesson !== null => $this->nextAction('lesson', "Continue {$continueLesson->title}", 'Pick up from your next learning step.', "/student/lessons/{$continueLesson->id}", $continueLessonProgress),
            $posttest === null => $this->nextAction('posttest', 'Take your posttest', 'You finished the available lessons. Measure what you learned.', '/student/posttest'),
            ! $surveySubmitted => $this->nextAction('survey', 'Share your learning experience', 'Complete the short survey to finish your learning journey.', '/student/survey'),
            default => $this->nextAction('results', 'Review your progress', 'See your learning gain, lesson scores, and quarterly grades.', '/student/progress'),
        };

        return Inertia::render('dashboard/student', [
            'student' => [
                'name' => $student->full_name,
            ],
            'assessment' => [
                'pretest' => $this->serializeAttempt($pretest),
                'posttest' => $this->serializeAttempt($posttest),
                'has_pretest' => $pretest !== null,
                'has_posttest' => $posttest !== null,
                'improvement' => $improvement,
                'status' => match (true) {
                    $pretest === null => 'Pretest Required',
                    $posttest === null => 'Posttest Available',
                    default => 'Assessment Completed',
                },
            ],
            'lesson_stats' => [
                'completed' => $completedLessons,
                'total' => $totalLessons,
                'progress_percentage' => $totalLessons > 0
                    ? round(($completedLessons / $totalLessons) * 100)
                    : 0,
            ],
            'continue_lesson' => $continueLesson ? [
                'id' => $continueLesson->id,
                'title' => $continueLesson->title,
                'subject' => $continueLesson->subject,
                'progress_percentage' => $continueLessonProgress,
            ] : null,
            'next_action' => $nextAction,
            'journey' => [
                'pretest' => $pretest ? 'complete' : 'current',
                'lessons' => $pretest === null ? 'locked' : ($lessonsComplete ? 'complete' : 'current'),
                'posttest' => $posttest ? 'complete' : ($pretest && ($lessonsComplete || $totalLessons === 0) ? 'current' : 'locked'),
                'survey' => $surveySubmitted ? 'complete' : ($posttest ? 'current' : 'locked'),
            ],
        ]);
    }

    private function attemptFor(Student $student, string $testType): ?TestAttempt
    {
        return $student->testAttempts()
            ->where('test_type', $testType)
            ->latest('submitted_at')
            ->first();
    }

    private function serializeAttempt(?TestAttempt $attempt): ?array
    {
        if (! $attempt) {
            return null;
        }

        return [
            'score' => $attempt->score,
            'total_items' => $attempt->total_items,
            'percentage' => (float) $attempt->percentage,
            'submitted_at' => $attempt->submitted_at?->toDateTimeString(),
        ];
    }

    private function nextAction(string $type, string $title, string $description, string $href, ?int $progress = null): array
    {
        return array_filter([
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'href' => $href,
            'progress_percentage' => $progress,
        ], fn ($value): bool => $value !== null);
    }
}
