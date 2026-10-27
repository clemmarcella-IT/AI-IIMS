<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Student;
use App\Models\StudentActivityAnswer;
use App\Models\TestAttempt;
use Inertia\Inertia;
use Inertia\Response;

class AdminEngagementController extends Controller
{
    public function index(): Response
    {
        $students = Student::query()
            ->with(['lessonProgress.lesson', 'testAttempts', 'activityAnswers'])
            ->get();

        $publishedLessons = Lesson::query()
            ->where('is_published', true)
            ->orderBy('created_at')
            ->get(['id', 'title', 'subject', 'topic', 'difficulty_level']);

        $totalStudents     = $students->count();
        $totalLessons      = $publishedLessons->count();

        // Aggregate per-lesson engagement across all students
        $lessonRows = $publishedLessons->map(function (Lesson $lesson) use ($students): array {
            $progressForLesson = LessonProgress::query()
                ->where('lesson_id', $lesson->id)
                ->get();

            $completedCount  = $progressForLesson->where('status', 'completed')->count();
            $inProgressCount = $progressForLesson->where('status', 'in_progress')->count();
            $startedCount    = $progressForLesson->whereIn('status', ['completed', 'in_progress'])->count();
            $avgProgress     = $progressForLesson->avg('progress_percentage');
            $avgScore        = $progressForLesson->whereNotNull('score_percentage')->avg('score_percentage');
            $totalTime       = $progressForLesson->sum('time_spent_seconds');

            return [
                'id'               => $lesson->id,
                'title'            => $lesson->title,
                'subject'          => $lesson->subject,
                'topic'            => $lesson->topic,
                'difficulty_level' => $lesson->difficulty_level,
                'started_count'    => $startedCount,
                'completed_count'  => $completedCount,
                'in_progress_count' => $inProgressCount,
                'avg_progress'     => $avgProgress !== null ? round($avgProgress, 1) : 0.0,
                'avg_score'        => $avgScore !== null ? round($avgScore, 1) : null,
                'total_time_seconds' => (int) $totalTime,
            ];
        });

        // Per-student engagement summary
        $studentRows = $students->map(function (Student $student) use ($totalLessons): array {
            $progress    = $student->lessonProgress;
            $completed   = $progress->where('status', 'completed')->count();
            $inProgress  = $progress->where('status', 'in_progress')->count();
            $totalTime   = $progress->sum('time_spent_seconds');
            $avgScore    = $progress->whereNotNull('score_percentage')->avg('score_percentage');

            $totalAnswered = $student->activityAnswers->count();
            $correct       = $student->activityAnswers->where('is_correct', true)->count();
            $accuracy      = $totalAnswered > 0 ? round(($correct / $totalAnswered) * 100, 1) : null;

            $overallProgress = $totalLessons > 0
                ? round(($completed / $totalLessons) * 100)
                : 0;

            return [
                'student_code'        => $student->student_code,
                'name'                => $student->full_name,
                'grade_level'         => $student->grade_level,
                'section'             => $student->section,
                'completed_lessons'   => $completed,
                'in_progress_lessons' => $inProgress,
                'overall_progress'    => $overallProgress,
                'avg_score'           => $avgScore !== null ? round($avgScore, 1) : null,
                'activity_accuracy'   => $accuracy,
                'total_time_seconds'  => (int) $totalTime,
            ];
        })->sortBy('name')->values();

        // Aggregate summary
        $totalActivityAnswers = StudentActivityAnswer::query()->count();
        $totalCorrect         = StudentActivityAnswer::query()->where('is_correct', true)->count();
        $overallAccuracy      = $totalActivityAnswers > 0
            ? round(($totalCorrect / $totalActivityAnswers) * 100, 1)
            : null;

        $allProgress         = LessonProgress::query()->get();
        $totalCompletions    = $allProgress->where('status', 'completed')->count();
        $totalTimeSeconds    = (int) $allProgress->sum('time_spent_seconds');

        $studentsWithPretest  = TestAttempt::query()->where('test_type', 'pretest')->distinct('student_id')->count();
        $studentsWithPosttest = TestAttempt::query()->where('test_type', 'posttest')->distinct('student_id')->count();

        // Completion rate distribution for chart
        $completionBuckets = [
            ['label' => '0%',      'min' => 0,  'max' => 0],
            ['label' => '1–25%',   'min' => 1,  'max' => 25],
            ['label' => '26–50%',  'min' => 26, 'max' => 50],
            ['label' => '51–75%',  'min' => 51, 'max' => 75],
            ['label' => '76–99%',  'min' => 76, 'max' => 99],
            ['label' => '100%',    'min' => 100, 'max' => 100],
        ];

        $progressDistribution = array_map(function ($bucket) use ($studentRows): array {
            $count = $studentRows->filter(
                fn ($r) => $r['overall_progress'] >= $bucket['min'] && $r['overall_progress'] <= $bucket['max']
            )->count();
            return ['label' => $bucket['label'], 'students' => $count];
        }, $completionBuckets);

        return Inertia::render('admin/engagement/index', [
            'summary' => [
                'total_students'          => $totalStudents,
                'total_lessons'           => $totalLessons,
                'total_completions'       => $totalCompletions,
                'total_activity_answers'  => $totalActivityAnswers,
                'total_correct'           => $totalCorrect,
                'overall_accuracy'        => $overallAccuracy,
                'total_time_seconds'      => $totalTimeSeconds,
                'students_with_pretest'   => $studentsWithPretest,
                'students_with_posttest'  => $studentsWithPosttest,
            ],
            'lessonRows'            => $lessonRows->values(),
            'studentRows'           => $studentRows,
            'progressDistribution'  => $progressDistribution,
        ]);
    }
}
