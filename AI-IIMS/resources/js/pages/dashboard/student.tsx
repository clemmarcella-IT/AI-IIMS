import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    Check,
    Circle,
    ClipboardCheck,
    Flag,
    Lightbulb,
    LockKeyhole,
    MessageSquareText,
    Sparkles,
} from 'lucide-react';

import {
    StudentPage,
    StudentPageHeader,
    StudentProgress,
    StudentStatus,
} from '@/components/student/student-ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes/student';
import type { Auth } from '@/types';

type AttemptSummary = {
    score: number;
    total_items: number;
    percentage: number;
    submitted_at: string | null;
};

type JourneyStatus = 'locked' | 'current' | 'complete';

type StudentPageProps = {
    auth: Auth;
    student?: { name: string };
    assessment: {
        pretest: AttemptSummary | null;
        posttest: AttemptSummary | null;
        has_pretest: boolean;
        has_posttest: boolean;
        improvement: number | null;
        status: string;
    };
    lesson_stats: {
        completed: number;
        total: number;
        progress_percentage: number;
    };
    continue_lesson: {
        id: number;
        title: string;
        subject: string | null;
        progress_percentage: number;
    } | null;
    next_action: {
        type: 'pretest' | 'lesson' | 'posttest' | 'survey' | 'results';
        title: string;
        description: string;
        href: string;
        progress_percentage?: number;
    };
    journey: Record<
        'pretest' | 'lessons' | 'posttest' | 'survey',
        JourneyStatus
    >;
    [key: string]: unknown;
};

const journeySteps = [
    { key: 'pretest', label: 'Pretest', icon: ClipboardCheck },
    { key: 'lessons', label: 'Lessons', icon: BookOpen },
    { key: 'posttest', label: 'Posttest', icon: Flag },
    { key: 'survey', label: 'Survey', icon: MessageSquareText },
] as const;

const nextActionIcons = {
    pretest: ClipboardCheck,
    lesson: BookOpen,
    posttest: Flag,
    survey: MessageSquareText,
    results: BarChart3,
};

const formatPercentage = (value: number | null) =>
    value === null ? 'Pending' : `${value.toFixed(1)}%`;

export default function StudentDashboard() {
    const {
        assessment,
        auth,
        continue_lesson: continueLesson,
        journey,
        lesson_stats: lessonStats,
        next_action: nextAction,
        student,
    } = usePage<StudentPageProps>().props;
    const studentName = student?.name ?? auth.user?.name ?? 'Student';
    const NextIcon = nextActionIcons[nextAction.type];

    return (
        <>
            <Head title="Student Dashboard" />
            <StudentPage>
                <StudentPageHeader
                    eyebrow="Your learning space"
                    icon={Sparkles}
                    title={`Welcome back, ${studentName}!`}
                    description="Follow your learning path, continue where you stopped, and see how every activity moves you forward."
                    action={
                        <StudentStatus
                            tone={
                                assessment.has_posttest
                                    ? 'success'
                                    : assessment.has_pretest
                                      ? 'info'
                                      : 'warning'
                            }
                        >
                            {assessment.status}
                        </StudentStatus>
                    }
                />

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
                    <div className="student-panel student-reveal relative overflow-hidden p-6 sm:p-8">
                        <div className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-sky-400/15 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-52 rounded-full bg-emerald-400/15 blur-2xl" />
                        <div className="relative">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                <NextIcon
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            </span>
                            <p className="mt-5 text-xs font-bold tracking-widest text-primary uppercase">
                                Up next
                            </p>
                            <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                                {nextAction.title}
                            </h2>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                                {nextAction.description}
                            </p>
                            {nextAction.progress_percentage !== undefined && (
                                <StudentProgress
                                    value={nextAction.progress_percentage}
                                    label="Lesson progress"
                                    className="mt-6 max-w-xl"
                                />
                            )}
                            <Button
                                asChild
                                size="lg"
                                className="mt-6 min-h-11 gap-2"
                            >
                                <Link href={nextAction.href}>
                                    {nextAction.type === 'lesson'
                                        ? 'Continue learning'
                                        : 'Start next step'}
                                    <ArrowRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card className="student-learning-tile student-reveal border-0">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold">
                                        Lesson progress
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {lessonStats.completed} of{' '}
                                        {lessonStats.total} lessons complete
                                    </p>
                                </div>
                                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                                    <BookOpen
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                </span>
                            </div>
                            <StudentProgress
                                value={lessonStats.progress_percentage}
                                label="Overall completion"
                                className="mt-6"
                            />
                            {continueLesson && (
                                <Link
                                    href={`/student/lessons/${continueLesson.id}`}
                                    className="student-focus-ring mt-6 block rounded-xl border bg-muted/35 p-4 transition-colors hover:bg-muted/65"
                                >
                                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                                        {continueLesson.subject ?? 'General'}
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-sm font-semibold">
                                        {continueLesson.title}
                                    </p>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <section
                    aria-labelledby="journey-title"
                    className="student-panel p-5 sm:p-6"
                >
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <div className="student-eyebrow">
                                <Lightbulb
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                                Learning journey
                            </div>
                            <h2
                                id="journey-title"
                                className="mt-3 text-xl font-bold"
                            >
                                Your path at a glance
                            </h2>
                        </div>
                        <Button asChild variant="outline" className="min-h-11">
                            <Link href="/student/recommendations">
                                View all recommendations
                            </Link>
                        </Button>
                    </div>

                    <ol className="mt-6 grid gap-3 md:grid-cols-4">
                        {journeySteps.map((step, index) => {
                            const status = journey[step.key];
                            const Icon = step.icon;

                            return (
                                <li
                                    key={step.key}
                                    className="student-learning-tile relative flex min-h-28 items-center gap-4 p-4"
                                >
                                    <span
                                        className={
                                            status === 'complete'
                                                ? 'flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white'
                                                : status === 'current'
                                                  ? 'flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground'
                                                  : 'flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground'
                                        }
                                    >
                                        {status === 'complete' ? (
                                            <Check
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        ) : status === 'locked' ? (
                                            <LockKeyhole
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Icon
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground">
                                            Step {index + 1}
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {step.label}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground capitalize">
                                            <Circle
                                                className="size-2 fill-current"
                                                aria-hidden="true"
                                            />
                                            {status}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </section>

                <section
                    className="grid gap-4 sm:grid-cols-3"
                    aria-label="Assessment summary"
                >
                    <SummaryTile
                        label="Pretest"
                        value={formatPercentage(
                            assessment.pretest?.percentage ?? null,
                        )}
                    />
                    <SummaryTile
                        label="Posttest"
                        value={formatPercentage(
                            assessment.posttest?.percentage ?? null,
                        )}
                    />
                    <SummaryTile
                        label="Learning gain"
                        value={formatPercentage(assessment.improvement)}
                    />
                </section>
            </StudentPage>
        </>
    );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="student-learning-tile p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        </div>
    );
}

StudentDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
