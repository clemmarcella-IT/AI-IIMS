<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Survey;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminAnalyticsController extends Controller
{
    public function index(): Response
    {
        $students = Student::query()
            ->with(['testAttempts', 'quarterlyGrades'])
            ->get();

        $pretestScores = $students
            ->map(fn ($s) => $s->testAttempts->firstWhere('test_type', 'pretest'))
            ->filter()
            ->map(fn ($a) => (float) $a->percentage)
            ->values();

        $posttestScores = $students
            ->map(fn ($s) => $s->testAttempts->firstWhere('test_type', 'posttest'))
            ->filter()
            ->map(fn ($a) => (float) $a->percentage)
            ->values();

        $pairedStudents = $students->filter(function ($s) {
            $pre = $s->testAttempts->firstWhere('test_type', 'pretest');
            $post = $s->testAttempts->firstWhere('test_type', 'posttest');
            return $pre !== null && $post !== null;
        });

        $differences = $pairedStudents->map(function ($s) {
            $pre = (float) $s->testAttempts->firstWhere('test_type', 'pretest')->percentage;
            $post = (float) $s->testAttempts->firstWhere('test_type', 'posttest')->percentage;
            return $post - $pre;
        })->values();

        $meanPretest = $this->mean($pretestScores);
        $meanPosttest = $this->mean($posttestScores);
        $sdPretest = $this->stdDev($pretestScores);
        $sdPosttest = $this->stdDev($posttestScores);
        $meanGain = $this->mean($differences);
        $quarterlyAverages = $students
            ->flatMap(fn ($s) => $s->quarterlyGrades)
            ->map(fn ($grade) => $grade->average())
            ->filter(fn ($value) => $value !== null)
            ->values();

        $tTest = $this->pairedTTest($differences);

        $surveyStats = $this->surveyStats();

        $studentRows = $pairedStudents->map(function ($s) {
            $pre = $s->testAttempts->firstWhere('test_type', 'pretest');
            $post = $s->testAttempts->firstWhere('test_type', 'posttest');
            return [
                'student_code' => $s->student_code,
                'name' => $s->full_name,
                'pretest' => round((float) $pre->percentage, 2),
                'posttest' => round((float) $post->percentage, 2),
                'gain' => round((float) $post->percentage - (float) $pre->percentage, 2),
            ];
        })->sortBy('name')->values();

        $frequencyDistribution = $this->frequencyDistribution($pretestScores, $posttestScores);

        return Inertia::render('admin/analytics/index', [
            'stats' => [
                'n_pretest' => $pretestScores->count(),
                'n_posttest' => $posttestScores->count(),
                'n_paired' => $differences->count(),
                'mean_pretest' => $meanPretest,
                'mean_posttest' => $meanPosttest,
                'mean_gain' => $meanGain,
                'mean_quarterly_grade' => $this->mean($quarterlyAverages),
                'sd_pretest' => $sdPretest,
                'sd_posttest' => $sdPosttest,
            ],
            'tTest' => $tTest,
            'surveyStats' => $surveyStats,
            'studentRows' => $studentRows,
            'frequencyDistribution' => $frequencyDistribution,
        ]);
    }

    public function export(): StreamedResponse
    {
        $students = Student::query()
            ->with(['testAttempts', 'quarterlyGrades'])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        $pairedStudents = $students->filter(function ($s) {
            return $s->testAttempts->firstWhere('test_type', 'pretest') !== null
                && $s->testAttempts->firstWhere('test_type', 'posttest') !== null;
        });

        $differences = $pairedStudents->map(function ($s) {
            return (float) $s->testAttempts->firstWhere('test_type', 'posttest')->percentage
                - (float) $s->testAttempts->firstWhere('test_type', 'pretest')->percentage;
        })->values();

        $pretestScores = $students
            ->map(fn ($s) => $s->testAttempts->firstWhere('test_type', 'pretest'))
            ->filter()->map(fn ($a) => (float) $a->percentage)->values();

        $posttestScores = $students
            ->map(fn ($s) => $s->testAttempts->firstWhere('test_type', 'posttest'))
            ->filter()->map(fn ($a) => (float) $a->percentage)->values();
        $quarterlyAverages = $students
            ->flatMap(fn ($s) => $s->quarterlyGrades)
            ->map(fn ($grade) => $grade->average())
            ->filter(fn ($value) => $value !== null)
            ->values();

        $tTest = $this->pairedTTest($differences);
        $surveyStats = $this->surveyStats();

        return response()->streamDownload(function () use (
            $students,
            $pretestScores,
            $posttestScores,
            $differences,
            $tTest,
            $surveyStats
        ): void {
            $handle = fopen('php://output', 'w');

            // Summary section
            fputcsv($handle, ['=== SUMMARY STATISTICS ===']);
            fputcsv($handle, ['Metric', 'Value']);
            fputcsv($handle, ['N (pretest)', $pretestScores->count()]);
            fputcsv($handle, ['N (posttest)', $posttestScores->count()]);
            fputcsv($handle, ['Mean Pretest (%)', $this->mean($pretestScores) ?? 'N/A']);
            fputcsv($handle, ['Mean Posttest (%)', $this->mean($posttestScores) ?? 'N/A']);
            fputcsv($handle, ['Mean Gain (%)', $this->mean($differences) ?? 'N/A']);
            fputcsv($handle, ['Mean Quarterly Grade', $this->mean($quarterlyAverages) ?? 'N/A']);
            fputcsv($handle, ['SD Pretest', $this->stdDev($pretestScores) ?? 'N/A']);
            fputcsv($handle, ['SD Posttest', $this->stdDev($posttestScores) ?? 'N/A']);
            fputcsv($handle, []);

            // Paired t-test section
            if ($tTest !== null) {
                fputcsv($handle, ['=== PAIRED SAMPLE T-TEST ===']);
                fputcsv($handle, ['t-statistic', $tTest['t']]);
                fputcsv($handle, ['Degrees of Freedom', $tTest['df']]);
                fputcsv($handle, ['Mean Difference', $tTest['mean_diff']]);
                fputcsv($handle, ['SD of Differences', $tTest['sd_diff']]);
                fputcsv($handle, ['SE of Mean Diff', $tTest['se']]);
                fputcsv($handle, ['Significance (α=0.05)', $tTest['significant'] ? 'Yes (p < 0.05)' : 'No (p ≥ 0.05)']);
                fputcsv($handle, ['p-value (approx)', $tTest['p_approx']]);
                fputcsv($handle, []);
            }

            // Survey section
            if (! empty($surveyStats)) {
                fputcsv($handle, ['=== SURVEY AVERAGES ===']);
                fputcsv($handle, ['Survey', 'Category', 'Average Rating', 'Responses']);
                foreach ($surveyStats as $survey) {
                    foreach ($survey['categories'] as $cat) {
                        fputcsv($handle, [
                            $survey['title'],
                            $cat['label'],
                            $cat['average'] ?? 'N/A',
                            $cat['count'],
                        ]);
                    }
                }
                fputcsv($handle, []);
            }

            // Per-student data
            fputcsv($handle, ['=== STUDENT DATA ===']);
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
                'survey_average',
            ]);

            foreach ($students as $student) {
                $pretest = $student->testAttempts->firstWhere('test_type', 'pretest');
                $posttest = $student->testAttempts->firstWhere('test_type', 'posttest');
                $gain = $pretest && $posttest
                    ? round((float) $posttest->percentage - (float) $pretest->percentage, 2)
                    : null;

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
                    $gain,
                    $this->studentSurveyAverage($student->id),
                ]);
            }

            fclose($handle);
        }, 'analytics-export.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    // --- Statistics helpers ---

    private function mean(Collection $values): ?float
    {
        if ($values->isEmpty()) {
            return null;
        }
        return round($values->avg(), 2);
    }

    private function stdDev(Collection $values): ?float
    {
        $n = $values->count();
        if ($n < 2) {
            return null;
        }
        $mean = $values->avg();
        $variance = $values->reduce(fn ($carry, $v) => $carry + (($v - $mean) ** 2), 0) / ($n - 1);
        return round(sqrt($variance), 4);
    }

    /**
     * Paired sample t-test (two-tailed).
     * Returns t, df, mean_diff, sd_diff, se, and a p-value approximation
     * using Student's t-distribution via a Taylor-expanded regularised incomplete beta.
     */
    private function pairedTTest(Collection $differences): ?array
    {
        $n = $differences->count();
        if ($n < 2) {
            return null;
        }

        $meanDiff = $differences->avg();
        $variance = $differences->reduce(fn ($carry, $d) => $carry + (($d - $meanDiff) ** 2), 0) / ($n - 1);
        $sd = sqrt($variance);
        $se = $sd / sqrt($n);

        if ($se == 0) {
            return null;
        }

        $t = $meanDiff / $se;
        $df = $n - 1;
        $pApprox = $this->tTestPValue((float) $t, (int) $df);
        $significant = $pApprox !== null && $pApprox < 0.05;

        return [
            't' => round($t, 4),
            'df' => $df,
            'mean_diff' => round($meanDiff, 4),
            'sd_diff' => round($sd, 4),
            'se' => round($se, 4),
            'significant' => $significant,
            'p_approx' => $pApprox !== null ? round($pApprox, 4) : null,
        ];
    }

    /**
     * Approximate two-tailed p-value for t-distribution using
     * the regularised incomplete beta function approximation.
     */
    private function tTestPValue(float $t, int $df): ?float
    {
        $x = $df / ($df + $t * $t);
        $p = $this->regularisedIncompleteBeta($df / 2.0, 0.5, $x);
        return $p !== null ? min(1.0, round($p, 6)) : null;
    }

    /**
     * Regularised incomplete beta I_x(a, b) via continued fraction (Lentz).
     * Used for the t-distribution CDF.
     */
    private function regularisedIncompleteBeta(float $a, float $b, float $x): ?float
    {
        if ($x < 0 || $x > 1) {
            return null;
        }
        if ($x === 0.0) {
            return 0.0;
        }
        if ($x === 1.0) {
            return 1.0;
        }

        $lbeta = lgamma($a) + lgamma($b) - lgamma($a + $b);
        $front = exp(log($x) * $a + log(1 - $x) * $b - $lbeta) / $a;

        // Continued fraction via Lentz's method
        $cf = $this->betaContinuedFraction($a, $b, $x);
        if ($cf === null) {
            return null;
        }

        $result = $front * $cf;

        // Symmetry relation: I_x(a,b) = 1 - I_{1-x}(b,a) for x > (a+1)/(a+b+2)
        if ($x > ($a + 1) / ($a + $b + 2)) {
            return 1.0 - $this->regularisedIncompleteBeta($b, $a, 1 - $x);
        }

        return min(1.0, max(0.0, $result));
    }

    private function betaContinuedFraction(float $a, float $b, float $x): ?float
    {
        $maxIter = 200;
        $eps = 1e-10;
        $tiny = 1e-30;

        $qab = $a + $b;
        $qap = $a + 1;
        $qam = $a - 1;
        $c = 1.0;
        $d = 1.0 - $qab * $x / $qap;
        if (abs($d) < $tiny) {
            $d = $tiny;
        }
        $d = 1.0 / $d;
        $h = $d;

        for ($m = 1; $m <= $maxIter; $m++) {
            $m2 = 2 * $m;

            // Even step
            $aa = $m * ($b - $m) * $x / (($qam + $m2) * ($a + $m2));
            $d = 1.0 + $aa * $d;
            if (abs($d) < $tiny) $d = $tiny;
            $c = 1.0 + $aa / $c;
            if (abs($c) < $tiny) $c = $tiny;
            $d = 1.0 / $d;
            $h *= $d * $c;

            // Odd step
            $aa = -($a + $m) * ($qab + $m) * $x / (($a + $m2) * ($qap + $m2));
            $d = 1.0 + $aa * $d;
            if (abs($d) < $tiny) $d = $tiny;
            $c = 1.0 + $aa / $c;
            if (abs($c) < $tiny) $c = $tiny;
            $d = 1.0 / $d;
            $delta = $d * $c;
            $h *= $delta;

            if (abs($delta - 1.0) < $eps) {
                return $h;
            }
        }

        return $h;
    }

    private function frequencyDistribution(Collection $pretest, Collection $posttest): array
    {
        $bands = [
            ['label' => '0–20', 'min' => 0, 'max' => 20],
            ['label' => '21–40', 'min' => 21, 'max' => 40],
            ['label' => '41–60', 'min' => 41, 'max' => 60],
            ['label' => '61–80', 'min' => 61, 'max' => 80],
            ['label' => '81–100', 'min' => 81, 'max' => 100],
        ];

        return array_map(function ($band) use ($pretest, $posttest) {
            $pre = $pretest->filter(fn ($v) => $v >= $band['min'] && $v <= $band['max'])->count();
            $post = $posttest->filter(fn ($v) => $v >= $band['min'] && $v <= $band['max'])->count();
            return [
                'label' => $band['label'],
                'pretest' => $pre,
                'posttest' => $post,
            ];
        }, $bands);
    }

    private function surveyStats(): array
    {
        $surveys = Survey::query()
            ->with(['questions', 'responses.answers'])
            ->get();

        $categories = [
            'interactivity' => 'Interactivity',
            'personalization' => 'Personalization',
            'feedback_timeliness' => 'Feedback Timeliness',
            'ease_of_use' => 'Ease of Use',
            'engagement' => 'Engagement',
        ];

        return $surveys->map(function (Survey $survey) use ($categories): array {
            $catAverages = [];
            foreach ($categories as $key => $label) {
                $questionIds = $survey->questions->where('category', $key)->pluck('id');
                $ratings = $survey->responses
                    ->flatMap(fn ($r) => $r->answers)
                    ->whereIn('survey_question_id', $questionIds)
                    ->pluck('rating');

                $catAverages[] = [
                    'key' => $key,
                    'label' => $label,
                    'average' => $ratings->count() > 0 ? round($ratings->avg(), 2) : null,
                    'count' => $ratings->count(),
                ];
            }

            $allRatings = $survey->responses
                ->flatMap(fn ($r) => $r->answers)
                ->pluck('rating');

            return [
                'id' => $survey->id,
                'title' => $survey->title,
                'total_responses' => $survey->responses->count(),
                'overall_average' => $allRatings->count() > 0 ? round($allRatings->avg(), 2) : null,
                'categories' => $catAverages,
            ];
        })->values()->all();
    }

    private function studentSurveyAverage(int $studentId): ?float
    {
        $result = DB::table('survey_answers')
            ->join('survey_responses', 'survey_answers.survey_response_id', '=', 'survey_responses.id')
            ->where('survey_responses.student_id', $studentId)
            ->avg('survey_answers.rating');

        return $result !== null ? round((float) $result, 2) : null;
    }
}
