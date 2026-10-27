import { Head } from '@inertiajs/react';
import { Activity, ArrowUpRight, Download, TrendingUp } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ErrorBar,
    Legend,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// --- Types ---

type Stats = {
    n_pretest: number;
    n_posttest: number;
    n_paired: number;
    mean_pretest: number | null;
    mean_posttest: number | null;
    mean_gain: number | null;
    mean_quarterly_grade: number | null;
    sd_pretest: number | null;
    sd_posttest: number | null;
};

type TTest = {
    t: number;
    df: number;
    mean_diff: number;
    sd_diff: number;
    se: number;
    significant: boolean;
    p_approx: number | null;
} | null;

type CategoryStat = {
    key: string;
    label: string;
    average: number | null;
    count: number;
};

type SurveyStat = {
    id: number;
    title: string;
    total_responses: number;
    overall_average: number | null;
    categories: CategoryStat[];
};

type StudentRow = {
    student_code: string;
    name: string;
    pretest: number;
    posttest: number;
    gain: number;
};

type FrequencyBand = {
    label: string;
    pretest: number;
    posttest: number;
};

type AnalyticsProps = {
    stats: Stats;
    tTest: TTest;
    surveyStats: SurveyStat[];
    studentRows: StudentRow[];
    frequencyDistribution: FrequencyBand[];
};

// --- Helpers ---

function fmt(val: number | null, decimals = 2): string {
    if (val === null) return '—';
    return val.toFixed(decimals);
}

function gainColor(val: number): string {
    if (val > 0) return 'text-green-600';
    if (val < 0) return 'text-red-600';
    return 'text-muted-foreground';
}

function StatCard({
    label,
    value,
    sub,
    highlight,
}: {
    label: string;
    value: string;
    sub?: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`flex flex-col gap-1 rounded-lg border p-4 ${
                highlight ? 'border-primary/30 bg-primary/5' : ''
            }`}
        >
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
    );
}

const CHART_COLORS = {
    pretest: 'hsl(215, 70%, 55%)',
    posttest: 'hsl(142, 60%, 45%)',
    gain_pos: 'hsl(142, 60%, 45%)',
    gain_neg: 'hsl(0, 70%, 55%)',
    survey: [
        'hsl(215, 70%, 55%)',
        'hsl(142, 60%, 45%)',
        'hsl(38, 90%, 50%)',
        'hsl(280, 60%, 55%)',
        'hsl(0, 70%, 55%)',
    ],
};

// Custom tooltip shared across bar charts
function ChartTooltip({
    active,
    payload,
    label,
    unit = '%',
}: {
    active?: boolean;
    payload?: { name: string; value: number; color: string }[];
    label?: string;
    unit?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md">
            <p className="mb-1 font-medium">{label}</p>
            {payload.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                    <span
                        className="inline-block size-2.5 rounded-full"
                        style={{ background: p.color }}
                    />
                    <span className="text-muted-foreground capitalize">
                        {p.name}:
                    </span>
                    <span className="font-medium tabular-nums">
                        {typeof p.value === 'number'
                            ? p.value.toFixed(2)
                            : p.value}
                        {unit}
                    </span>
                </div>
            ))}
        </div>
    );
}

// --- Page ---

export default function AdminAnalyticsIndex({
    stats,
    tTest,
    surveyStats,
    studentRows,
    frequencyDistribution,
}: AnalyticsProps) {
    const hasData = stats.n_paired > 0;

    // Data for the mean comparison bar chart (with SD as error bars)
    const meanComparisonData = [
        {
            name: 'Mean Score',
            Pretest: stats.mean_pretest ?? 0,
            Posttest: stats.mean_posttest ?? 0,
            pretestError: stats.sd_pretest
                ? [[0, stats.sd_pretest]]
                : undefined,
            posttestError: stats.sd_posttest
                ? [[0, stats.sd_posttest]]
                : undefined,
        },
    ];

    // Data for per-student gain chart (sorted by gain desc)
    const gainChartData = [...studentRows]
        .sort((a, b) => b.gain - a.gain)
        .map((r) => ({
            name: r.student_code,
            gain: r.gain,
        }));

    return (
        <>
            <Head title="Analytics" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Analytics
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Research statistics — pretest vs. posttest
                                performance, survey results, and paired t-test.
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <a href="/admin/analytics/export">
                                <Download className="size-4" />
                                Export CSV
                            </a>
                        </Button>
                    </div>

                    {/* Summary stat cards */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="size-5 text-muted-foreground" />
                                <CardTitle>Performance Summary</CardTitle>
                            </div>
                            <CardDescription>
                                Based on {stats.n_paired} student
                                {stats.n_paired !== 1 ? 's' : ''} with both
                                pretest and posttest data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                <StatCard
                                    label="N (pretest)"
                                    value={String(stats.n_pretest)}
                                    sub="students tested"
                                />
                                <StatCard
                                    label="N (posttest)"
                                    value={String(stats.n_posttest)}
                                    sub="students tested"
                                />
                                <StatCard
                                    label="Mean Pretest"
                                    value={`${fmt(stats.mean_pretest)}%`}
                                    sub={`SD = ${fmt(stats.sd_pretest, 4)}`}
                                />
                                <StatCard
                                    label="Mean Posttest"
                                    value={`${fmt(stats.mean_posttest)}%`}
                                    sub={`SD = ${fmt(stats.sd_posttest, 4)}`}
                                />
                                <StatCard
                                    label="Mean Gain"
                                    value={`${fmt(stats.mean_gain)}%`}
                                    sub="posttest - pretest"
                                    highlight
                                />
                                <StatCard
                                    label="Mean Quarterly"
                                    value={`${fmt(
                                        stats.mean_quarterly_grade,
                                    )}%`}
                                    sub="teacher-approved grades"
                                />
                                <StatCard
                                    label="Paired Students"
                                    value={String(stats.n_paired)}
                                    sub="used for t-test"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Charts row — mean comparison + frequency distribution */}
                    {hasData && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Mean pretest vs posttest bar chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mean Score Comparison</CardTitle>
                                    <CardDescription>
                                        Pretest vs. posttest mean (%) with
                                        standard deviation
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={260}
                                    >
                                        <BarChart
                                            data={meanComparisonData}
                                            margin={{
                                                top: 16,
                                                right: 16,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="stroke-muted"
                                            />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                tickFormatter={(v) => `${v}%`}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                content={<ChartTooltip />}
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="Pretest"
                                                fill={CHART_COLORS.pretest}
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={80}
                                            >
                                                {stats.sd_pretest !== null && (
                                                    <ErrorBar
                                                        dataKey="pretestError"
                                                        width={8}
                                                        strokeWidth={2}
                                                        stroke={
                                                            CHART_COLORS.pretest
                                                        }
                                                        direction="y"
                                                    />
                                                )}
                                            </Bar>
                                            <Bar
                                                dataKey="Posttest"
                                                fill={CHART_COLORS.posttest}
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={80}
                                            >
                                                {stats.sd_posttest !== null && (
                                                    <ErrorBar
                                                        dataKey="posttestError"
                                                        width={8}
                                                        strokeWidth={2}
                                                        stroke={
                                                            CHART_COLORS.posttest
                                                        }
                                                        direction="y"
                                                    />
                                                )}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Frequency distribution bar chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Frequency Distribution
                                    </CardTitle>
                                    <CardDescription>
                                        Number of students per score range
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={260}
                                    >
                                        <BarChart
                                            data={frequencyDistribution}
                                            margin={{
                                                top: 16,
                                                right: 16,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="stroke-muted"
                                            />
                                            <XAxis
                                                dataKey="label"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                allowDecimals={false}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                content={
                                                    <ChartTooltip unit="" />
                                                }
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="pretest"
                                                name="Pretest"
                                                fill={CHART_COLORS.pretest}
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={40}
                                            />
                                            <Bar
                                                dataKey="posttest"
                                                name="Posttest"
                                                fill={CHART_COLORS.posttest}
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={40}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Per-student gain bar chart */}
                    {gainChartData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Performance Gain per Student
                                </CardTitle>
                                <CardDescription>
                                    Posttest minus pretest percentage, sorted
                                    highest to lowest
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer
                                    width="100%"
                                    height={Math.max(
                                        220,
                                        gainChartData.length * 28,
                                    )}
                                >
                                    <BarChart
                                        data={gainChartData}
                                        layout="vertical"
                                        margin={{
                                            top: 8,
                                            right: 32,
                                            left: 8,
                                            bottom: 8,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={false}
                                            className="stroke-muted"
                                        />
                                        <XAxis
                                            type="number"
                                            tickFormatter={(v) => `${v}%`}
                                            tick={{ fontSize: 11 }}
                                            domain={['auto', 'auto']}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={80}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Bar
                                            dataKey="gain"
                                            name="Gain"
                                            radius={[0, 4, 4, 0]}
                                            maxBarSize={22}
                                        >
                                            {gainChartData.map((entry) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={
                                                        entry.gain >= 0
                                                            ? CHART_COLORS.gain_pos
                                                            : CHART_COLORS.gain_neg
                                                    }
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Frequency distribution table */}
                    {hasData && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequency Table</CardTitle>
                                <CardDescription>
                                    Frequency (f) and percentage (%) per score
                                    band
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Score Range</TableHead>
                                            <TableHead className="text-right">
                                                Pretest (f)
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Pretest (%)
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Posttest (f)
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Posttest (%)
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {frequencyDistribution.map((band) => {
                                            const preP =
                                                stats.n_pretest > 0
                                                    ? (
                                                          (band.pretest /
                                                              stats.n_pretest) *
                                                          100
                                                      ).toFixed(1)
                                                    : '0.0';
                                            const postP =
                                                stats.n_posttest > 0
                                                    ? (
                                                          (band.posttest /
                                                              stats.n_posttest) *
                                                          100
                                                      ).toFixed(1)
                                                    : '0.0';
                                            return (
                                                <TableRow key={band.label}>
                                                    <TableCell className="font-medium">
                                                        {band.label}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {band.pretest}
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground tabular-nums">
                                                        {preP}%
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {band.posttest}
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground tabular-nums">
                                                        {postP}%
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paired t-test */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Activity className="size-5 text-muted-foreground" />
                                <CardTitle>Paired Sample T-Test</CardTitle>
                            </div>
                            <CardDescription>
                                Two-tailed test comparing pretest and posttest
                                scores (α = 0.05)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tTest === null ? (
                                <p className="text-sm text-muted-foreground">
                                    Not enough paired data to compute t-test
                                    (need at least 2 students with both pretest
                                    and posttest).
                                </p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                        <StatCard
                                            label="t-statistic"
                                            value={fmt(tTest.t, 4)}
                                        />
                                        <StatCard
                                            label="Degrees of Freedom"
                                            value={String(tTest.df)}
                                        />
                                        <StatCard
                                            label="Mean Difference"
                                            value={fmt(tTest.mean_diff, 4)}
                                            sub="posttest − pretest"
                                        />
                                        <StatCard
                                            label="SD of Differences"
                                            value={fmt(tTest.sd_diff, 4)}
                                        />
                                        <StatCard
                                            label="SE of Mean Diff"
                                            value={fmt(tTest.se, 4)}
                                        />
                                    </div>
                                    <Separator />
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                p-value (approx):
                                            </span>
                                            <span className="font-semibold tabular-nums">
                                                {tTest.p_approx !== null
                                                    ? tTest.p_approx.toFixed(4)
                                                    : '—'}
                                            </span>
                                        </div>
                                        <Badge
                                            variant={
                                                tTest.significant
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            {tTest.significant ? (
                                                <>
                                                    <ArrowUpRight className="size-3" />
                                                    Significant (p &lt; 0.05)
                                                </>
                                            ) : (
                                                'Not Significant (p ≥ 0.05)'
                                            )}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        H₀: no difference between pretest and
                                        posttest scores.{' '}
                                        {tTest.significant
                                            ? 'The result suggests a statistically significant change in scores.'
                                            : 'The result does not suggest a statistically significant change.'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Survey averages — radar charts */}
                    {surveyStats.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Survey Averages</CardTitle>
                                <CardDescription>
                                    Average Likert ratings per category (1 =
                                    Strongly Disagree, 5 = Strongly Agree)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-8">
                                {surveyStats.map((survey) => {
                                    const radarData = survey.categories.map(
                                        (c) => ({
                                            category: c.label,
                                            average: c.average ?? 0,
                                            fullMark: 5,
                                        }),
                                    );

                                    return (
                                        <div
                                            key={survey.id}
                                            className="flex flex-col gap-4"
                                        >
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="font-medium">
                                                    {survey.title}
                                                </h3>
                                                <Badge variant="outline">
                                                    {survey.total_responses}{' '}
                                                    response
                                                    {survey.total_responses !==
                                                    1
                                                        ? 's'
                                                        : ''}
                                                </Badge>
                                                {survey.overall_average !==
                                                    null && (
                                                    <Badge variant="secondary">
                                                        Overall avg:{' '}
                                                        {survey.overall_average.toFixed(
                                                            2,
                                                        )}
                                                    </Badge>
                                                )}
                                            </div>

                                            {survey.total_responses === 0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    No responses yet.
                                                </p>
                                            ) : (
                                                <div className="grid gap-6 lg:grid-cols-2">
                                                    {/* Radar chart */}
                                                    <ResponsiveContainer
                                                        width="100%"
                                                        height={280}
                                                    >
                                                        <RadarChart
                                                            data={radarData}
                                                            margin={{
                                                                top: 8,
                                                                right: 32,
                                                                bottom: 8,
                                                                left: 32,
                                                            }}
                                                        >
                                                            <PolarGrid className="stroke-muted" />
                                                            <PolarAngleAxis
                                                                dataKey="category"
                                                                tick={{
                                                                    fontSize: 11,
                                                                }}
                                                            />
                                                            <Radar
                                                                name={
                                                                    survey.title
                                                                }
                                                                dataKey="average"
                                                                stroke={
                                                                    CHART_COLORS
                                                                        .survey[0]
                                                                }
                                                                fill={
                                                                    CHART_COLORS
                                                                        .survey[0]
                                                                }
                                                                fillOpacity={
                                                                    0.25
                                                                }
                                                                strokeWidth={2}
                                                            />
                                                            <Tooltip
                                                                formatter={(
                                                                    v,
                                                                ) => [
                                                                    Number(
                                                                        v,
                                                                    ).toFixed(
                                                                        2,
                                                                    ),
                                                                    'Average',
                                                                ]}
                                                            />
                                                        </RadarChart>
                                                    </ResponsiveContainer>

                                                    {/* Category breakdown bar chart */}
                                                    <ResponsiveContainer
                                                        width="100%"
                                                        height={280}
                                                    >
                                                        <BarChart
                                                            data={survey.categories.map(
                                                                (c) => ({
                                                                    name: c.label,
                                                                    Average:
                                                                        c.average ??
                                                                        0,
                                                                }),
                                                            )}
                                                            margin={{
                                                                top: 8,
                                                                right: 16,
                                                                left: 0,
                                                                bottom: 40,
                                                            }}
                                                        >
                                                            <CartesianGrid
                                                                strokeDasharray="3 3"
                                                                className="stroke-muted"
                                                            />
                                                            <XAxis
                                                                dataKey="name"
                                                                tick={{
                                                                    fontSize: 10,
                                                                }}
                                                                angle={-30}
                                                                textAnchor="end"
                                                                interval={0}
                                                            />
                                                            <YAxis
                                                                domain={[0, 5]}
                                                                ticks={[
                                                                    1, 2, 3, 4,
                                                                    5,
                                                                ]}
                                                                tick={{
                                                                    fontSize: 11,
                                                                }}
                                                            />
                                                            <Tooltip
                                                                formatter={(
                                                                    v,
                                                                ) => [
                                                                    Number(
                                                                        v,
                                                                    ).toFixed(
                                                                        2,
                                                                    ),
                                                                    'Average',
                                                                ]}
                                                            />
                                                            <Bar
                                                                dataKey="Average"
                                                                radius={[
                                                                    4, 4, 0, 0,
                                                                ]}
                                                                maxBarSize={48}
                                                            >
                                                                {survey.categories.map(
                                                                    (cat) => (
                                                                        <Cell
                                                                            key={
                                                                                cat.key
                                                                            }
                                                                            fill={
                                                                                CHART_COLORS
                                                                                    .survey[
                                                                                    survey.categories.indexOf(
                                                                                        cat,
                                                                                    ) %
                                                                                        CHART_COLORS
                                                                                            .survey
                                                                                            .length
                                                                                ]
                                                                            }
                                                                        />
                                                                    ),
                                                                )}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}
                                            <Separator />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )}

                    {/* Per-student data table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Score Table</CardTitle>
                            <CardDescription>
                                Individual pretest, posttest, and performance
                                gain for paired students
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {studentRows.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No students with both pretest and posttest
                                    data yet.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Student Code</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="text-right">
                                                Pretest (%)
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Posttest (%)
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Gain
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {studentRows.map((row, idx) => (
                                            <TableRow key={row.student_code}>
                                                <TableCell className="text-muted-foreground">
                                                    {idx + 1}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {row.student_code}
                                                </TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {row.pretest.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {row.posttest.toFixed(2)}
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right font-medium tabular-nums ${gainColor(row.gain)}`}
                                                >
                                                    {row.gain > 0 ? '+' : ''}
                                                    {row.gain.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminAnalyticsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Analytics', href: '/admin/analytics' },
    ],
};
