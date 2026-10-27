import { Head, Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowRight,
    BookOpen,
    ChartNoAxesCombined,
    CircleAlert,
    GraduationCap,
    Plus,
    Sparkles,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard as teacherDashboard } from '@/routes/teacher';
import {
    create as createLesson,
    index as teacherLessons,
} from '@/routes/teacher/lessons';
import { index as teacherStudents } from '@/routes/teacher/students';
import type { Auth } from '@/types';

type TeacherPageProps = {
    auth: Auth;
    summary?: TeacherDashboardSummary;
    studentProgress?: StudentProgress[];
    [key: string]: unknown;
};

type StudentProgress = {
    id: number;
    name: string;
    lesson: string | null;
    pretestScore: number | null;
    posttestScore: number | null;
    progress: number | null;
    status: 'On Track' | 'Needs Support' | 'Completed';
};

type TeacherDashboardSummary = {
    studentsCount: number;
    lessonsCount: number;
    publishedLessonsCount: number;
    averagePretestScore: number | null;
    averagePosttestScore: number | null;
    averageProgress: number | null;
};

type DashboardMetric = {
    title: string;
    value: string;
    detail: string;
    icon: LucideIcon;
};

const defaultSummary: TeacherDashboardSummary = {
    studentsCount: 0,
    lessonsCount: 0,
    publishedLessonsCount: 0,
    averagePretestScore: null,
    averagePosttestScore: null,
    averageProgress: null,
};

const formatPercent = (value: number | null) =>
    value === null ? 'No data' : `${Math.round(value)}%`;

const progressValue = (value: number | null) =>
    Math.min(100, Math.max(0, value ?? 0));

const initials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

const statusStyles: Record<StudentProgress['status'], string> = {
    Completed:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    'Needs Support':
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    'On Track':
        'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300',
};

export default function Dashboard() {
    const {
        auth,
        summary = defaultSummary,
        studentProgress = [],
    } = usePage<TeacherPageProps>().props;
    const teacherName = auth.user?.name ?? 'Teacher';
    const publishedPercent = summary.lessonsCount
        ? Math.round(
              (summary.publishedLessonsCount / summary.lessonsCount) * 100,
          )
        : 0;
    const completedCount = studentProgress.filter(
        (student) => student.status === 'Completed',
    ).length;
    const onTrackCount = studentProgress.filter(
        (student) => student.status === 'On Track',
    ).length;
    const supportCount = studentProgress.filter(
        (student) => student.status === 'Needs Support',
    ).length;
    const assessmentData = [
        { name: 'Pretest', score: summary.averagePretestScore },
        { name: 'Posttest', score: summary.averagePosttestScore },
    ];

    const dashboardMetrics: DashboardMetric[] = [
        {
            title: 'Students',
            value: summary.studentsCount.toString(),
            detail: 'Enrolled in your class',
            icon: Users,
        },
        {
            title: 'Published lessons',
            value: summary.publishedLessonsCount.toString(),
            detail: `${summary.lessonsCount} total lesson${summary.lessonsCount === 1 ? '' : 's'}`,
            icon: BookOpen,
        },
        {
            title: 'Posttest average',
            value: formatPercent(summary.averagePosttestScore),
            detail: 'Current class mastery',
            icon: Trophy,
        },
        {
            title: 'Lesson progress',
            value: formatPercent(summary.averageProgress),
            detail: 'Average across students',
            icon: ChartNoAxesCombined,
        },
    ];

    return (
        <>
            <Head title="Teacher Dashboard" />
            <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <section className="relative overflow-hidden rounded-2xl border bg-card px-5 py-6 shadow-sm sm:px-8 sm:py-8">
                        <div
                            className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.16),transparent_68%)] lg:block"
                            aria-hidden="true"
                        />
                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <Badge
                                    variant="secondary"
                                    className="mb-4 gap-1.5"
                                >
                                    <Sparkles className="size-3" />
                                    Classroom overview
                                </Badge>
                                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    Welcome back, {teacherName}
                                </h1>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    See how your class is progressing and focus
                                    on the students who need your attention.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button asChild variant="outline" size="lg">
                                    <Link href={teacherLessons()}>
                                        <BookOpen />
                                        Manage lessons
                                    </Link>
                                </Button>
                                <Button asChild size="lg">
                                    <Link href={createLesson()}>
                                        <Plus />
                                        New lesson
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section
                        aria-label="Class summary"
                        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    >
                        {dashboardMetrics.map((metric) => {
                            const Icon = metric.icon;

                            return (
                                <Card key={metric.title} className="shadow-sm">
                                    <CardHeader>
                                        <CardDescription>
                                            {metric.title}
                                        </CardDescription>
                                        <CardAction className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Icon
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-semibold tracking-tight">
                                            {metric.value}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {metric.detail}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </section>

                    <section className="grid gap-4 lg:grid-cols-3">
                        <Card className="shadow-sm lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Assessment performance</CardTitle>
                                <CardDescription>
                                    Compare your class baseline and mastery
                                    results.
                                </CardDescription>
                                <CardAction>
                                    <Target className="size-5 text-muted-foreground" />
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <div className="h-56 w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={assessmentData}
                                            margin={{
                                                top: 8,
                                                right: 8,
                                                left: -20,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid
                                                vertical={false}
                                                stroke="var(--border)"
                                                strokeDasharray="3 3"
                                            />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: 'var(--muted-foreground)',
                                                    fontSize: 12,
                                                }}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(value) =>
                                                    `${value}%`
                                                }
                                                tick={{
                                                    fill: 'var(--muted-foreground)',
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Tooltip
                                                cursor={{
                                                    fill: 'var(--muted)',
                                                    opacity: 0.35,
                                                }}
                                                formatter={(value) => [
                                                    `${Number(value)}%`,
                                                    'Class average',
                                                ]}
                                                contentStyle={{
                                                    background:
                                                        'var(--popover)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius:
                                                        'var(--radius)',
                                                    color: 'var(--popover-foreground)',
                                                }}
                                            />
                                            <Bar
                                                dataKey="score"
                                                radius={[6, 6, 0, 0]}
                                                maxBarSize={96}
                                            >
                                                <Cell fill="var(--chart-2)" />
                                                <Cell fill="var(--primary)" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-3 flex items-center justify-center gap-5 text-xs text-muted-foreground">
                                    <span>
                                        Pretest{' '}
                                        {formatPercent(
                                            summary.averagePretestScore,
                                        )}
                                    </span>
                                    <span>
                                        Posttest{' '}
                                        {formatPercent(
                                            summary.averagePosttestScore,
                                        )}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Class health</CardTitle>
                                <CardDescription>
                                    Student standing at a glance.
                                </CardDescription>
                                <CardAction>
                                    <GraduationCap className="size-5 text-muted-foreground" />
                                </CardAction>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <HealthRow
                                    label="Completed"
                                    count={completedCount}
                                    className="bg-emerald-500"
                                />
                                <HealthRow
                                    label="On track"
                                    count={onTrackCount}
                                    className="bg-sky-500"
                                />
                                <HealthRow
                                    label="Needs support"
                                    count={supportCount}
                                    className="bg-amber-500"
                                />
                                <div className="border-t pt-4">
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Lessons published
                                        </span>
                                        <span className="font-medium">
                                            {publishedPercent}%
                                        </span>
                                    </div>
                                    <Progress value={publishedPercent} />
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <Card className="shadow-sm">
                        <CardHeader className="border-b">
                            <CardTitle>Student progress</CardTitle>
                            <CardDescription>
                                Recent lesson activity and assessment results.
                            </CardDescription>
                            <CardAction>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={teacherStudents()}>
                                        View students
                                        <ArrowRight />
                                    </Link>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="px-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-4">
                                            Student
                                        </TableHead>
                                        <TableHead>Current lesson</TableHead>
                                        <TableHead className="text-right">
                                            Pretest
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Posttest
                                        </TableHead>
                                        <TableHead className="min-w-44">
                                            Progress
                                        </TableHead>
                                        <TableHead className="pr-4">
                                            Status
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentProgress.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-40 text-center"
                                            >
                                                <CircleAlert className="mx-auto mb-3 size-5 text-muted-foreground" />
                                                <p className="font-medium">
                                                    No student activity yet
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Progress appears here after
                                                    students begin a lesson.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        studentProgress.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell className="pl-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                                            {initials(
                                                                student.name,
                                                            )}
                                                        </span>
                                                        <span className="font-medium">
                                                            {student.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-56 truncate text-muted-foreground">
                                                    {student.lesson ??
                                                        'No activity yet'}
                                                </TableCell>
                                                <TableCell className="text-right font-medium tabular-nums">
                                                    {formatPercent(
                                                        student.pretestScore,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium tabular-nums">
                                                    {formatPercent(
                                                        student.posttestScore,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Progress
                                                            value={progressValue(
                                                                student.progress,
                                                            )}
                                                            className="min-w-24"
                                                        />
                                                        <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
                                                            {student.progress ===
                                                            null
                                                                ? '—'
                                                                : `${Math.round(student.progress)}%`}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="pr-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            statusStyles[
                                                                student.status
                                                            ]
                                                        }
                                                    >
                                                        {student.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
}

function HealthRow({
    label,
    count,
    className,
}: {
    label: string;
    count: number;
    className: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2.5 text-muted-foreground">
                <span
                    className={`size-2 rounded-full ${className}`}
                    aria-hidden="true"
                />
                {label}
            </div>
            <span className="font-semibold tabular-nums">{count}</span>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: teacherDashboard(),
        },
    ],
};
