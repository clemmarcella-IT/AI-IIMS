<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TestAttempt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $totalStudents = Student::query()->count();
        $studentsWithPretest = $this->studentsWithAttempt('pretest');
        $studentsWithPosttest = $this->studentsWithAttempt('posttest');
        $averagePretest = $this->averageAttemptPercentage('pretest');
        $averagePosttest = $this->averageAttemptPercentage('posttest');

        $recentAttempts = TestAttempt::query()
            ->with(['student:id,student_code,first_name,last_name', 'test:id,title'])
            ->latest('submitted_at')
            ->latest('updated_at')
            ->limit(8)
            ->get()
            ->map(fn (TestAttempt $attempt): array => [
                'id' => $attempt->id,
                'student_code' => $attempt->student?->student_code,
                'student_name' => $attempt->student?->full_name ?? 'Unknown student',
                'test_title' => $attempt->test?->title,
                'test_type' => $attempt->test_type,
                'score' => $attempt->score,
                'total_items' => $attempt->total_items,
                'percentage' => (float) $attempt->percentage,
                'submitted_at' => $attempt->submitted_at?->toDateString(),
            ]);

        return Inertia::render('dashboard/admin', [
            'stats' => [
                'total_students' => $totalStudents,
                'total_teachers' => Teacher::query()->count(),
                'total_lessons' => Lesson::query()->count(),
                'published_lessons' => Lesson::query()->where('is_published', true)->count(),
                'draft_lessons' => Lesson::query()->where('is_published', false)->count(),
                'students_with_pretest' => $studentsWithPretest,
                'students_with_posttest' => $studentsWithPosttest,
                'average_pretest' => $averagePretest,
                'average_posttest' => $averagePosttest,
                'average_gain' => round($averagePosttest - $averagePretest, 2),
                'completion_rate' => $totalStudents > 0
                    ? round(($studentsWithPosttest / $totalStudents) * 100, 2)
                    : 0,
                'survey_responses' => $this->surveyResponsesCount(),
            ],
            'scoreDistribution' => $this->scoreDistribution(),
            'recentAttempts' => $recentAttempts,
        ]);
    }

    /**
     * Frequency distribution of pretest/posttest scores across percentage bands.
     *
     * @return array<int, array{label: string, pretest: int, posttest: int}>
     */
    private function scoreDistribution(): array
    {
        $bands = [
            ['label' => '0–20', 'min' => 0, 'max' => 20],
            ['label' => '21–40', 'min' => 21, 'max' => 40],
            ['label' => '41–60', 'min' => 41, 'max' => 60],
            ['label' => '61–80', 'min' => 61, 'max' => 80],
            ['label' => '81–100', 'min' => 81, 'max' => 100],
        ];

        return array_map(function (array $band): array {
            return [
                'label' => $band['label'],
                'pretest' => TestAttempt::query()
                    ->where('test_type', 'pretest')
                    ->whereBetween('percentage', [$band['min'], $band['max']])
                    ->count(),
                'posttest' => TestAttempt::query()
                    ->where('test_type', 'posttest')
                    ->whereBetween('percentage', [$band['min'], $band['max']])
                    ->count(),
            ];
        }, $bands);
    }

    private function studentsWithAttempt(string $testType): int
    {
        return Student::query()
            ->whereHas('testAttempts', fn ($query) => $query->where('test_type', $testType))
            ->count();
    }

    private function averageAttemptPercentage(string $testType): float
    {
        return round((float) TestAttempt::query()
            ->where('test_type', $testType)
            ->avg('percentage'), 2);
    }

    private function surveyResponsesCount(): ?int
    {
        foreach (['survey_responses', 'surveys'] as $table) {
            if (Schema::hasTable($table)) {
                return (int) DB::table($table)->count();
            }
        }

        return null;
    }
}
