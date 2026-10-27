import { Head } from '@inertiajs/react';
import { Clock, Users, BookOpen, CheckCircle } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes/admin';
import { index as engagementIndex } from '@/routes/admin/engagement';

// --- Types ---

type Summary = {
    total_students: number;
    total_lessons: number;
    total_completions: number;
    total_activity_answers: number;
    total_correct: number;
    overall_accuracy: number | null;
    total_time_seconds: number;
    students_with_pretest: number;
    students_with_posttest: number;
};

type LessonRow = {
    id: number;
    title: string;
    subject: string;
    topic: string;
    difficulty_level: string | null;
    started_count: number;
    completed_count: number;
    in_progress_count: number;
    avg_progress: number;
    avg_score: number | null;
    total_time_seconds: number;
};

type StudentRow = {
    student_code: string;
    name: string;
    grade_level: string | null;
    section: string | null;
    completed_lessons: number;
    in_progress_lessons: number;
    overall_progress: number;
    avg_score: number | null;
    activity_accuracy: number | null;
    total_time_seconds: number;
};

type ProgressBucket = {
    label: string;
    students: number;
};

type EngagementProps = {
    summary: Summary;
    lessonRows: LessonRow[];
    studentRows: StudentRow[];
    progressDistribution: ProgressBucket[];
};

// --- Helpers ---

function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

function fmt(val: number | null, decimals = 1): string {
    if (val === null) return '—';
    return val.toFixed(decimals);
}

function difficultyColor(level: string | null): string {
    if (level === 'hard') return 'text-red-500';
    if (level === 'medium') return 'text-yellow-500';
    return 'text-green-500';
}

const CHART_COLORS = {
    bar: 'hsl(215, 70%, 55%)',
};

function StatCard({
    label,
    value,
    sub,
    icon: Icon,
}: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
}) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-4" />
                <p className="text-xs">{label}</p>
            </div>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
    );
}

function ChartTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: { name: string; value: number }[];
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md">
            <p className="mb-1 font-medium">{label}</p>
            {payload.map((p) => (
                <div key={p.name} className="text-muted-foreground">
                    {p.value} student{p.value !== 1 ? 's' : ''}
                </div>
            ))}
        </div>
    );
}

// --- Page ---

export default function AdminEngagementIndex({
    summary,
    lessonRows,
    studentRows,
    progressDistribution,
}: EngagementProps) {
    return (
        <>
            <Head title="Engagement" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Engagement
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Student engagement across lessons, activities, and
                            time spent.
                        </p>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        <StatCard
                            label="Students"
                            value={String(summary.total_students)}
                            icon={Users}
                        />
                        <StatCard
                            label="Lessons"
                            value={String(summary.total_lessons)}
                            icon={BookOpen}
                        />
                        <StatCard
                            label="Completions"
                            value={String(summary.total_completions)}
                            sub="lesson completions total"
                            icon={CheckCircle}
                        />
                        <StatCard
                            label="Total Time"
                            value={formatTime(summary.total_time_seconds)}
                            sub="across all students"
                            icon={Clock}
                        />
                        <StatCard
                            label="Activity Answers"
                            value={String(summary.total_activity_answers)}
                            sub={`${summary.total_correct} correct`}
                            icon={CheckCircle}
                        />
                        <StatCard
                            label="Activity Accuracy"
                            value={
                                summary.overall_accuracy !== null
                                    ? `${summary.overall_accuracy}%`
                                    : '—'
                            }
                            sub="across all students"
                            icon={CheckCircle}
                        />
                        <StatCard
                            label="Took Pretest"
                            value={String(summary.students_with_pretest)}
                            sub="students"
                            icon={Users}
                        />
                        <StatCard
                            label="Took Posttest"
                            value={String(summary.students_with_posttest)}
                            sub="students"
                            icon={Users}
                        />
                    </div>

                    {/* Progress distribution chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Progress Distribution</CardTitle>
                            <CardDescription>
                                Number of students per overall lesson completion
                                bracket
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart
                                    data={progressDistribution}
                                    margin={{
                                        top: 8,
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
                                    <Tooltip content={<ChartTooltip />} />
                                    <Bar
                                        dataKey="students"
                                        name="Students"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={56}
                                    >
                                        {progressDistribution.map((entry) => (
                                            <Cell
                                                key={entry.label}
                                                fill={CHART_COLORS.bar}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Per-lesson table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lesson Engagement</CardTitle>
                            <CardDescription>
                                Participation, completion, and average scores
                                per lesson
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {lessonRows.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No published lessons yet.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lesson</TableHead>
                                            <TableHead className="text-right">
                                                Started
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Completed
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Avg Progress
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Avg Score
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Total Time
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lessonRows.map((lesson) => (
                                            <TableRow key={lesson.id}>
                                                <TableCell>
                                                    <p className="font-medium">
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {lesson.topic}
                                                        {lesson.difficulty_level && (
                                                            <span
                                                                className={`ml-2 capitalize ${difficultyColor(lesson.difficulty_level)}`}
                                                            >
                                                                {
                                                                    lesson.difficulty_level
                                                                }
                                                            </span>
                                                        )}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {lesson.started_count}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {lesson.completed_count}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {fmt(lesson.avg_progress)}%
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {lesson.avg_score !== null
                                                        ? `${fmt(lesson.avg_score)}%`
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground tabular-nums">
                                                    {lesson.total_time_seconds >
                                                    0
                                                        ? formatTime(
                                                              lesson.total_time_seconds,
                                                          )
                                                        : '—'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Per-student table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Engagement</CardTitle>
                            <CardDescription>
                                Individual engagement metrics per student
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {studentRows.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No students enrolled yet.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Student</TableHead>
                                            <TableHead className="text-right">
                                                Overall Progress
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Completed
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Avg Score
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Activity Accuracy
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Time Spent
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {studentRows.map((row, idx) => (
                                            <TableRow key={row.student_code}>
                                                <TableCell className="text-muted-foreground">
                                                    {idx + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium">
                                                        {row.name}
                                                    </p>
                                                    <p className="font-mono text-xs text-muted-foreground">
                                                        {row.student_code}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {row.overall_progress}%
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {row.completed_lessons}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {row.avg_score !== null
                                                        ? `${fmt(row.avg_score)}%`
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {row.activity_accuracy !==
                                                    null
                                                        ? `${fmt(row.activity_accuracy)}%`
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground tabular-nums">
                                                    {row.total_time_seconds > 0
                                                        ? formatTime(
                                                              row.total_time_seconds,
                                                          )
                                                        : '—'}
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

AdminEngagementIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: dashboard() },
        { title: 'Engagement', href: engagementIndex() },
    ],
};
