<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/reports/index', [
            'summary' => [
                'students' => Student::query()->count(),
                'lessons' => Lesson::query()->count(),
                'export_fields' => [
                    'student_code',
                    'student_name',
                    'grade_level',
                    'section',
                    'consent_status',
                    'pretest_score',
                    'pretest_percentage',
                    'posttest_score',
                    'posttest_percentage',
                    'performance_gain',
                    'quarter_1',
                    'quarter_2',
                    'quarter_3',
                    'quarter_4',
                    'quarterly_average',
                    'lessons_completed',
                    'total_lessons',
                    'completion_percentage',
                    'survey_average',
                ],
            ],
        ]);
    }

    public function export(): StreamedResponse
    {
        $totalLessons = Lesson::query()->count();
        $students = Student::query()
            ->with(['testAttempts', 'lessonProgress', 'quarterlyGrades'])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        return response()->streamDownload(function () use ($students, $totalLessons): void {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'student_code',
                'student_name',
                'grade_level',
                'section',
                'consent_status',
                'pretest_score',
                'pretest_percentage',
                'posttest_score',
                'posttest_percentage',
                'performance_gain',
                'quarter_1',
                'quarter_2',
                'quarter_3',
                'quarter_4',
                'quarterly_average',
                'lessons_completed',
                'total_lessons',
                'completion_percentage',
                'survey_average',
            ]);

            foreach ($students as $student) {
                $pretest = $student->testAttempts->firstWhere('test_type', 'pretest');
                $posttest = $student->testAttempts->firstWhere('test_type', 'posttest');
                $completedLessons = $student->lessonProgress->where('status', 'completed')->count();
                $completionPercentage = $totalLessons > 0
                    ? round(($completedLessons / $totalLessons) * 100, 2)
                    : 0;
                $performanceGain = $pretest && $posttest
                    ? round((float) $posttest->percentage - (float) $pretest->percentage, 2)
                    : null;
                $quarterlyGrade = $student->quarterlyGrades
                    ->sortByDesc('updated_at')
                    ->first();

                fputcsv($handle, [
                    $student->student_code,
                    $student->full_name,
                    $student->grade_level,
                    $student->section,
                    $student->consent_status ? 'consented' : 'not_consented',
                    $pretest?->score,
                    $pretest?->percentage,
                    $posttest?->score,
                    $posttest?->percentage,
                    $performanceGain,
                    $quarterlyGrade?->quarter_1,
                    $quarterlyGrade?->quarter_2,
                    $quarterlyGrade?->quarter_3,
                    $quarterlyGrade?->quarter_4,
                    $quarterlyGrade?->average(),
                    $completedLessons,
                    $totalLessons,
                    $completionPercentage,
                    $this->surveyAverageFor($student->id),
                ]);
            }

            fclose($handle);
        }, 'research-data-export.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function surveyAverageFor(int $studentId): ?float
    {
        if (! Schema::hasTable('survey_responses')) {
            return null;
        }

        if (! Schema::hasColumn('survey_responses', 'student_id')) {
            return null;
        }

        if (Schema::hasTable('survey_answers')) {
            $average = DB::table('survey_answers')
                ->join('survey_responses', 'survey_answers.survey_response_id', '=', 'survey_responses.id')
                ->where('survey_responses.student_id', $studentId)
                ->avg('survey_answers.rating');

            return $average !== null ? round((float) $average, 2) : null;
        }

        return null;
    }
}
