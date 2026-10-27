import { Head, Link } from '@inertiajs/react';
import {
    Download,
    FileText,
    GraduationCap,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type DashboardStats = {
    total_students: number;
    total_teachers: number;
    total_lessons: number;
    published_lessons: number;
    draft_lessons: number;
    students_with_pretest: number;
    students_with_posttest: number;
    average_pretest: number;
    average_posttest: number;
    average_gain: number;
    completion_rate: number;
    survey_responses: number | null;
};

type ScoreBand = {
    label: string;
    pretest: number;
    posttest: number;
};

type RecentAttempt = {
    id: number;
    student_code: string | null;
    student_name: string;
    test_title: string | null;
    test_type: 'pretest' | 'posttest';
    score: number;
    total_items: number;
    percentage: number;
    submitted_at: string | null;
};

type AdminDashboardProps = {
    stats: DashboardStats;
    scoreDistribution: ScoreBand[];
    recentAttempts: RecentAttempt[];
};

const CHART_COLORS = {
    pretest: 'hsl(215, 70%, 55%)',
    posttest: 'hsl(142, 60%, 45%)',
    published: 'hsl(142, 60%, 45%)',
    draft: 'hsl(38, 90%, 50%)',
};

const percent = (value: number | null) =>
    value === null ? 'N/A' : `${Math.round(value)}%`;

const numberValue = (value: number | null) =>
    value === null ? 'N/A' : value.toLocaleString();

const dateValue = (value: string | null) =>
    value
        ? new Intl.DateTimeFormat('en', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          }).format(new Date(`${value}T00:00:00`))
        : 'N/A';

function ChartTooltip({
    active,
    payload,
    label,
    unit = '',
}: {
    active?: boolean;
    payload?: { name: string; value: number; color: string }[];
    label?: string;
    unit?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md">
            {label && <p className="mb-1 font-medium">{label}</p>}
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
                            ? p.value.toFixed(unit === '%' ? 1 : 0)
                            : p.value}
                        {unit}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard({
    stats,
    scoreDistribution,
    recentAttempts,
}: AdminDashboardProps) {
    const completionItems = [
        {
            label: 'Pretest',
            value: stats.students_with_pretest,
            total: stats.total_students,
        },
        {
            label: 'Posttest',
            value: stats.students_with_posttest,
            total: stats.total_students,
        },
    ];

    const statCards = [
        {
            label: 'Total Students',
            value: stats.total_students,
            icon: GraduationCap,
        },
        {
            label: 'Total Teachers',
            value: stats.total_teachers,
            icon: Users,
        },
        {
            label: 'Total Lessons',
            value: stats.total_lessons,
            icon: FileText,
        },
        {
            label: 'Published Lessons',
            value: stats.published_lessons,
            icon: FileText,
        },
        {
            label: 'Draft Lessons',
            value: stats.draft_lessons,
            icon: FileText,
        },
        {
            label: 'Students with Pretest',
            value: stats.students_with_pretest,
            icon: GraduationCap,
        },
        {
            label: 'Students with Posttest',
            value: stats.students_with_posttest,
            icon: GraduationCap,
        },
        {
            label: 'Average Pretest Score',
            value: percent(stats.average_pretest),
            icon: TrendingUp,
        },
        {
            label: 'Average Posttest Score',
            value: percent(stats.average_posttest),
            icon: TrendingUp,
        },
        {
            label: 'Average Performance Gain',
            value: `${stats.average_gain >= 0 ? '+' : ''}${percent(stats.average_gain)}`,
            icon: TrendingUp,
        },
        {
            label: 'Completion Rate',
            value: percent(stats.completion_rate),
            icon: GraduationCap,
        },
        {
            label: 'Survey Responses',
            value: numberValue(stats.survey_responses),
            icon: FileText,
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Admin Dashboard
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                Research overview for student participation,
                                assessment performance, and lesson readiness.
                            </p>
                        </div>
                        <Button asChild>
                            <a href="/admin/reports/export">
                                <Download className="size-4" />
                                Export Research Data
                            </a>
                        </Button>
                    </div>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {statCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <Card key={card.label}>
                                    <CardHeader className="grid-cols-[1fr_auto]">
                                        <div>
                                            <CardDescription>
                                                {card.label}
                                            </CardDescription>
                                            <CardTitle className="mt-1 text-2xl">
                                                {card.value}
                                            </CardTitle>
                                        </div>
                                        <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                            <Icon className="size-4" />
                                        </span>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Pretest vs Posttest Average
                                </CardTitle>
                                <CardDescription>
                                    Mean percentage across submitted attempts.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart
                                        data={[
                                            {
                                                name: 'Pretest',
                                                value: stats.average_pretest,
                                            },
                                            {
                                                name: 'Posttest',
                                                value: stats.average_posttest,
                                            },
                                        ]}
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
                                            content={<ChartTooltip unit="%" />}
                                            cursor={{
                                                fill: 'hsl(var(--muted) / 0.3)',
                                            }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            name="Average"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={90}
                                        >
                                            <Cell fill={CHART_COLORS.pretest} />
                                            <Cell
                                                fill={CHART_COLORS.posttest}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <Separator className="my-4" />
                                <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                                    <span className="text-sm text-muted-foreground">
                                        Average gain
                                    </span>
                                    <Badge variant="secondary">
                                        {stats.average_gain >= 0 ? '+' : ''}
                                        {percent(stats.average_gain)}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Student Completion Summary
                                </CardTitle>
                                <CardDescription>
                                    Assessment milestones by enrolled students.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-5">
                                {completionItems.map((item) => {
                                    const value =
                                        item.total > 0
                                            ? Math.round(
                                                  (item.value / item.total) *
                                                      100,
                                              )
                                            : 0;

                                    return (
                                        <div
                                            key={item.label}
                                            className="grid gap-2"
                                        >
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">
                                                    {item.label}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {item.value}/{item.total}
                                                </span>
                                            </div>
                                            <Progress value={value} />
                                        </div>
                                    );
                                })}
                                <Separator />
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">
                                            Completion Rate
                                        </span>
                                        <span className="text-muted-foreground">
                                            {percent(stats.completion_rate)}
                                        </span>
                                    </div>
                                    <Progress value={stats.completion_rate} />
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
                        <Card>
                            <CardHeader>
                                <CardTitle>Score Distribution</CardTitle>
                                <CardDescription>
                                    Number of students per score range (pretest
                                    vs posttest).
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart
                                        data={scoreDistribution}
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
                                            content={<ChartTooltip />}
                                            cursor={{
                                                fill: 'hsl(var(--muted) / 0.3)',
                                            }}
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Lesson Publication</CardTitle>
                                <CardDescription>
                                    Published vs draft instructional materials.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {stats.total_lessons === 0 ? (
                                    <p className="py-12 text-center text-sm text-muted-foreground">
                                        No lessons yet.
                                    </p>
                                ) : (
                                    <ResponsiveContainer
                                        width="100%"
                                        height={260}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    {
                                                        name: 'Published',
                                                        value: stats.published_lessons,
                                                    },
                                                    {
                                                        name: 'Draft',
                                                        value: stats.draft_lessons,
                                                    },
                                                ]}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={90}
                                                paddingAngle={2}
                                            >
                                                <Cell
                                                    fill={
                                                        CHART_COLORS.published
                                                    }
                                                />
                                                <Cell
                                                    fill={CHART_COLORS.draft}
                                                />
                                            </Pie>
                                            <Tooltip
                                                content={<ChartTooltip />}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Lesson Publication Summary
                                </CardTitle>
                                <CardDescription>
                                    Published and draft instructional materials.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Published
                                    </span>
                                    <Badge>{stats.published_lessons}</Badge>
                                </div>
                                <Progress
                                    value={
                                        stats.total_lessons > 0
                                            ? (stats.published_lessons /
                                                  stats.total_lessons) *
                                              100
                                            : 0
                                    }
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Draft
                                    </span>
                                    <Badge variant="secondary">
                                        {stats.draft_lessons}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle>Recent Test Attempts</CardTitle>
                                    <CardDescription>
                                        Latest submitted pretest and posttest
                                        records.
                                    </CardDescription>
                                </div>
                                <Button asChild variant="outline">
                                    <Link href="/admin/tests">
                                        Manage Tests
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Submitted</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentAttempts.map((attempt) => (
                                            <TableRow key={attempt.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {attempt.student_name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {attempt.student_code ??
                                                            'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {attempt.test_type ===
                                                        'pretest'
                                                            ? 'Pretest'
                                                            : 'Posttest'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {attempt.score}/
                                                    {attempt.total_items}{' '}
                                                    <span className="text-muted-foreground">
                                                        (
                                                        {percent(
                                                            attempt.percentage,
                                                        )}
                                                        )
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {dateValue(
                                                        attempt.submitted_at,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {recentAttempts.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="h-24 text-center text-muted-foreground"
                                                >
                                                    No test attempts yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
