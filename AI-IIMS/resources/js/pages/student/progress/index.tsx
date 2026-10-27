import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    Clock3,
    GraduationCap,
    TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';

import {
    StudentEmptyState,
    StudentPage,
    StudentPageHeader,
    StudentProgress,
    StudentStatus,
} from '@/components/student/student-ui';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Attempt = {
    score: number;
    total_items: number;
    percentage: number;
    submitted_at: string | null;
} | null;

type LessonProgress = {
    lesson_id: number;
    title: string | null;
    subject: string | null;
    topic: string | null;
    status: string;
    progress_percentage: number;
    score_percentage: number | null;
    time_spent_seconds: number;
    updated_at: string | null;
};

type QuarterlyGrade = {
    subject: string;
    school_year: string | null;
    quarter_1: number | null;
    quarter_2: number | null;
    quarter_3: number | null;
    quarter_4: number | null;
    average: number | null;
};

type ProgressProps = {
    summary: {
        published_lessons: number;
        started_lessons: number;
        completed_lessons: number;
        average_progress: number | null;
        average_score: number | null;
        pretest: Attempt;
        posttest: Attempt;
        gain: number | null;
    };
    lessons: LessonProgress[];
    quarterlyGrades: QuarterlyGrade[];
};

const percent = (value: number | null) =>
    value === null ? 'Pending' : `${value.toFixed(1)}%`;
const minutes = (seconds: number) => `${Math.round(seconds / 60)} min`;
const gradeValue = (value: number | null) =>
    value === null ? 'Pending' : value.toFixed(2);

export default function StudentProgressIndex({
    summary,
    lessons,
    quarterlyGrades,
}: ProgressProps) {
    const subjectProgress = useMemo(() => {
        const groups = new Map<string, number[]>();
        lessons.forEach((lesson) => {
            const subject = lesson.subject ?? lesson.topic ?? 'General';
            groups.set(subject, [
                ...(groups.get(subject) ?? []),
                lesson.progress_percentage,
            ]);
        });

        return Array.from(groups, ([subject, values]) => ({
            subject,
            progress:
                values.reduce((sum, value) => sum + value, 0) / values.length,
            lessons: values.length,
        })).sort((a, b) => b.progress - a.progress);
    }, [lessons]);

    return (
        <>
            <Head title="Progress" />
            <StudentPage>
                <StudentPageHeader
                    eyebrow="Learning insights"
                    icon={BarChart3}
                    title="See how far you’ve come"
                    description="Follow lesson completion, assessment growth, recent study time, and teacher-approved grades in one clear view."
                />

                <section
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    aria-label="Progress summary"
                >
                    <ProgressMetric
                        label="Lesson completion"
                        value={`${summary.completed_lessons}/${summary.published_lessons}`}
                        detail={percent(summary.average_progress)}
                        icon={BookOpen}
                    />
                    <ProgressMetric
                        label="Average activity score"
                        value={percent(summary.average_score)}
                        detail={`${summary.started_lessons} lessons started`}
                        icon={GraduationCap}
                    />
                    <ProgressMetric
                        label="Pretest"
                        value={percent(summary.pretest?.percentage ?? null)}
                        detail="Baseline result"
                        icon={BarChart3}
                    />
                    <ProgressMetric
                        label="Learning gain"
                        value={percent(summary.gain)}
                        detail={
                            summary.posttest
                                ? 'Pretest to posttest'
                                : 'Complete the posttest to view'
                        }
                        icon={TrendingUp}
                    />
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
                    <div className="student-panel p-5 sm:p-6">
                        <h2 className="text-lg font-bold">
                            Progress by subject
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Average completion across started lessons.
                        </p>
                        {subjectProgress.length === 0 ? (
                            <p className="mt-6 text-sm text-muted-foreground">
                                Start a lesson to see subject progress.
                            </p>
                        ) : (
                            <div className="mt-6 space-y-5">
                                {subjectProgress.map((subject) => (
                                    <StudentProgress
                                        key={subject.subject}
                                        value={subject.progress}
                                        label={subject.subject}
                                        detail={`${subject.lessons} lesson${subject.lessons === 1 ? '' : 's'} started`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="student-panel p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Recent lesson activity
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Continue learning or revisit your latest
                                    work.
                                </p>
                            </div>
                            <Clock3
                                className="size-5 text-primary"
                                aria-hidden="true"
                            />
                        </div>
                        {lessons.length === 0 ? (
                            <StudentEmptyState
                                icon={BookOpen}
                                title="No lesson progress yet"
                                description="Open a published lesson to begin building your progress history."
                            />
                        ) : (
                            <div className="mt-5 grid gap-3">
                                {lessons.slice(0, 5).map((lesson) => (
                                    <article
                                        key={lesson.lesson_id}
                                        className="student-learning-tile p-4"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <StudentStatus
                                                        tone={
                                                            lesson.status ===
                                                            'completed'
                                                                ? 'success'
                                                                : 'info'
                                                        }
                                                    >
                                                        {lesson.status.replaceAll(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </StudentStatus>
                                                    <span className="text-xs text-muted-foreground">
                                                        {lesson.subject ??
                                                            lesson.topic ??
                                                            'General'}
                                                    </span>
                                                </div>
                                                <h3 className="mt-2 truncate font-semibold">
                                                    {lesson.title ?? 'Lesson'}
                                                </h3>
                                                <StudentProgress
                                                    value={
                                                        lesson.progress_percentage
                                                    }
                                                    label="Completion"
                                                    detail={`${minutes(lesson.time_spent_seconds)} studied · ${percent(lesson.score_percentage)} score`}
                                                    className="mt-3"
                                                />
                                            </div>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="icon"
                                                className="min-h-11 min-w-11 self-end sm:self-auto"
                                            >
                                                <Link
                                                    href={`/student/lessons/${lesson.lesson_id}`}
                                                    aria-label={`Open ${lesson.title}`}
                                                >
                                                    <ArrowRight className="size-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section
                    className="student-panel overflow-hidden p-5 sm:p-6"
                    aria-labelledby="grades-title"
                >
                    <h2 id="grades-title" className="text-lg font-bold">
                        Quarterly grades
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Teacher-approved academic records.
                    </p>
                    {quarterlyGrades.length === 0 ? (
                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            No quarterly grades recorded yet.
                        </p>
                    ) : (
                        <>
                            <div className="mt-5 hidden overflow-x-auto md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>School year</TableHead>
                                            {[
                                                'Q1',
                                                'Q2',
                                                'Q3',
                                                'Q4',
                                                'Average',
                                            ].map((label) => (
                                                <TableHead
                                                    key={label}
                                                    className="text-right"
                                                >
                                                    {label}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {quarterlyGrades.map((grade) => (
                                            <TableRow
                                                key={`${grade.subject}-${grade.school_year}`}
                                            >
                                                <TableCell className="font-medium">
                                                    {grade.subject}
                                                </TableCell>
                                                <TableCell>
                                                    {grade.school_year ?? 'N/A'}
                                                </TableCell>
                                                {[
                                                    grade.quarter_1,
                                                    grade.quarter_2,
                                                    grade.quarter_3,
                                                    grade.quarter_4,
                                                    grade.average,
                                                ].map((value, index) => (
                                                    <TableCell
                                                        key={index}
                                                        className="text-right tabular-nums"
                                                    >
                                                        {gradeValue(value)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="mt-5 grid gap-3 md:hidden">
                                {quarterlyGrades.map((grade) => (
                                    <article
                                        key={`${grade.subject}-${grade.school_year}`}
                                        className="student-learning-tile p-4"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold">
                                                    {grade.subject}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {grade.school_year ??
                                                        'School year N/A'}
                                                </p>
                                            </div>
                                            <StudentStatus tone="info">
                                                Avg {gradeValue(grade.average)}
                                            </StudentStatus>
                                        </div>
                                        <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
                                            {[
                                                grade.quarter_1,
                                                grade.quarter_2,
                                                grade.quarter_3,
                                                grade.quarter_4,
                                            ].map((value, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-xl bg-muted/60 p-2"
                                                >
                                                    <dt className="text-xs text-muted-foreground">
                                                        Q{index + 1}
                                                    </dt>
                                                    <dd className="mt-1 text-sm font-semibold">
                                                        {gradeValue(value)}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </StudentPage>
        </>
    );
}

function ProgressMetric({
    label,
    value,
    detail,
    icon: Icon,
}: {
    label: string;
    value: string;
    detail: string;
    icon: typeof BookOpen;
}) {
    return (
        <div className="student-learning-tile p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {detail}
                    </p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                </span>
            </div>
        </div>
    );
}

StudentProgressIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'Progress', href: '/student/progress' },
    ],
};
