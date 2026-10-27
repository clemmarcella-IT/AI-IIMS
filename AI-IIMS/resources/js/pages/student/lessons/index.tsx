import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Bell,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    GraduationCap,
    Layers3,
    PlayCircle,
    RotateCcw,
    Search,
    UserRound,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard as studentDashboard } from '@/routes/student';
import {
    show as studentLessonShow,
    index as studentLessons,
} from '@/routes/student/lessons';

type Lesson = {
    id: number;
    title: string;
    subject: string | null;
    topic: string | null;
    content: string | null;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    teacher_name: string | null;
    updated_at: string | null;
    activities: { submission: { is_correct: boolean } | null }[];
    sections: {
        activities: { submission: { is_correct: boolean } | null }[];
    }[];
    questions: { id: number }[];
};

type StudentLessonsIndexProps = {
    lessons?: Lesson[];
    selectedSubject?: string | null;
    subjectNotifications?: SubjectNotification[];
};

type SubjectNotification = {
    subject: string;
    count: number;
    lesson_ids: number[];
    latest_message: string | null;
    latest_at: string | null;
};

const formatDate = (date: string | null) => {
    if (!date) {
        return 'N/A';
    }

    const dateValue = date.includes('T')
        ? new Date(date)
        : new Date(`${date}T00:00:00`);

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(dateValue);
};

const getLessonStats = (lesson: Lesson) => {
    const allActivities = [
        ...lesson.sections.flatMap((s) => s.activities ?? []),
        ...lesson.activities,
    ];
    const completedActivities = allActivities.filter(
        (activity) => activity.submission !== null,
    ).length;

    return {
        completedActivities,
        progressPercentage:
            allActivities.length === 0
                ? 0
                : Math.round(
                      (completedActivities / allActivities.length) * 100,
                  ),
        sectionCount: lesson.sections.length,
        totalActivities: allActivities.length,
        totalQuestions: lesson.questions?.length ?? 0,
    };
};

const getSubjectStats = (lessons: Lesson[]) => {
    const lessonStats = lessons.map(getLessonStats);
    const totalActivities = lessonStats.reduce(
        (total, stats) => total + stats.totalActivities,
        0,
    );
    const completedActivities = lessonStats.reduce(
        (total, stats) => total + stats.completedActivities,
        0,
    );
    const teachers = Array.from(
        new Set(
            lessons
                .map((lesson) => lesson.teacher_name?.trim())
                .filter(Boolean) as string[],
        ),
    );
    const latestDate = lessons
        .map((lesson) => lesson.updated_at)
        .filter(Boolean)
        .sort()
        .at(-1);

    return {
        completedActivities,
        latestDate: latestDate ?? null,
        progressPercentage:
            totalActivities === 0
                ? 0
                : Math.round((completedActivities / totalActivities) * 100),
        teachers: teachers.length > 0 ? teachers : ['Unassigned'],
        totalActivities,
        totalQuestions: lessonStats.reduce(
            (total, stats) => total + stats.totalQuestions,
            0,
        ),
        totalSections: lessonStats.reduce(
            (total, stats) => total + stats.sectionCount,
            0,
        ),
    };
};

const getLessonStatus = (lesson: Lesson) => {
    const stats = getLessonStats(lesson);
    const isComplete =
        stats.totalActivities > 0 &&
        stats.completedActivities === stats.totalActivities;
    const hasStarted = stats.completedActivities > 0;

    return isComplete
        ? 'completed'
        : hasStarted
          ? 'in_progress'
          : 'not_started';
};

const subjectForLesson = (lesson: Lesson) =>
    lesson.subject?.trim() || 'General';

const statusCopy = {
    completed: {
        label: 'Completed',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
    },
    in_progress: {
        label: 'In progress',
        className:
            'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200',
    },
    not_started: {
        label: 'Not started',
        className:
            'border-border bg-muted/60 text-muted-foreground dark:bg-muted/30',
    },
};

export default function StudentLessonsIndex({
    lessons = [],
    selectedSubject = null,
    subjectNotifications = [],
}: StudentLessonsIndexProps) {
    const [lessonQuery, setLessonQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'not_started' | 'in_progress' | 'completed'
    >('all');
    const subjectGroups = useMemo(() => {
        const groups = new Map<string, Lesson[]>();

        lessons.forEach((lesson) => {
            const subject = subjectForLesson(lesson);
            const subjectLessons = groups.get(subject) ?? [];

            subjectLessons.push(lesson);
            groups.set(subject, subjectLessons);
        });

        return Array.from(groups.entries())
            .sort(([firstSubject], [secondSubject]) =>
                firstSubject.localeCompare(secondSubject),
            )
            .map(([subject, subjectLessons]) => ({
                subject,
                lessons: subjectLessons,
            }));
    }, [lessons]);

    const selectedSubjectGroup = useMemo(
        () =>
            selectedSubject
                ? subjectGroups.find(
                      (group) => group.subject === selectedSubject,
                  )
                : null,
        [selectedSubject, subjectGroups],
    );

    const selectedSubjectLessons = useMemo(
        () => selectedSubjectGroup?.lessons ?? [],
        [selectedSubjectGroup],
    );
    const visibleSelectedLessons = useMemo(() => {
        const query = lessonQuery.trim().toLowerCase();

        return selectedSubjectLessons.filter((lesson) => {
            const matchesStatus =
                statusFilter === 'all' ||
                getLessonStatus(lesson) === statusFilter;
            const matchesQuery =
                query.length === 0 ||
                [lesson.title, lesson.topic, lesson.teacher_name].some(
                    (value) => value?.toLowerCase().includes(query),
                );

            return matchesStatus && matchesQuery;
        });
    }, [lessonQuery, selectedSubjectLessons, statusFilter]);

    const notificationsBySubject = useMemo(
        () =>
            new Map(
                subjectNotifications.map((notification) => [
                    notification.subject,
                    notification,
                ]),
            ),
        [subjectNotifications],
    );

    const unreadLessonIds = useMemo(
        () =>
            new Set(
                subjectNotifications.flatMap(
                    (notification) => notification.lesson_ids,
                ),
            ),
        [subjectNotifications],
    );

    const unreadNotificationCount = subjectNotifications.reduce(
        (total, notification) => total + notification.count,
        0,
    );

    const statsLessons = selectedSubject ? selectedSubjectLessons : lessons;

    const libraryStats = useMemo(() => {
        const completed = statsLessons.filter(
            (lesson) => getLessonStatus(lesson) === 'completed',
        ).length;
        const inProgress = statsLessons.filter(
            (lesson) => getLessonStatus(lesson) === 'in_progress',
        ).length;
        const totalActivities = statsLessons.reduce(
            (total, lesson) => total + getLessonStats(lesson).totalActivities,
            0,
        );
        const completedActivities = statsLessons.reduce(
            (total, lesson) =>
                total + getLessonStats(lesson).completedActivities,
            0,
        );

        return {
            completed,
            completedActivities,
            inProgress,
            progressPercentage:
                totalActivities === 0
                    ? 0
                    : Math.round((completedActivities / totalActivities) * 100),
            totalLessons: statsLessons.length,
            totalActivities,
        };
    }, [statsLessons]);

    if (lessons.length === 0) {
        return (
            <>
                <Head title="Lessons" />
                <div className="student-surface flex min-h-full flex-1 flex-col gap-6 overflow-x-clip p-4 sm:p-6">
                    <section className="student-panel p-8 text-center text-card-foreground">
                        <span className="mx-auto flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <BookOpen className="size-6" aria-hidden="true" />
                        </span>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                            No published lessons yet
                        </h1>
                        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                            Lessons created and published by teachers will
                            appear here.
                        </p>
                    </section>
                </div>
            </>
        );
    }

    return (
        <>
            <Head
                title={
                    selectedSubject ? `${selectedSubject} Lessons` : 'Lessons'
                }
            />
            <div className="student-surface flex min-h-full flex-1 flex-col gap-6 overflow-x-clip p-4 sm:p-6">
                <section className="student-panel overflow-hidden text-card-foreground">
                    <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-stretch">
                        <div className="flex min-w-0 flex-col justify-between gap-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="h-7 px-3">
                                    <GraduationCap
                                        className="size-3.5"
                                        aria-hidden="true"
                                    />
                                    Course Library
                                </Badge>
                                {unreadNotificationCount > 0 && (
                                    <Badge className="h-7 gap-2 bg-amber-500 text-white hover:bg-amber-500">
                                        <Bell
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                        {unreadNotificationCount} new update
                                        {unreadNotificationCount === 1
                                            ? ''
                                            : 's'}
                                    </Badge>
                                )}
                            </div>

                            <div>
                                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                                    {selectedSubject
                                        ? `${selectedSubject} Lessons`
                                        : 'My Lessons'}
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    {selectedSubject
                                        ? `${selectedSubjectLessons.length} lesson${
                                              selectedSubjectLessons.length ===
                                              1
                                                  ? ''
                                                  : 's'
                                          } in this subject. Pick a module to start, continue, or review.`
                                        : `${lessons.length} lesson${
                                              lessons.length === 1 ? '' : 's'
                                          } across ${subjectGroups.length} subject${
                                              subjectGroups.length === 1
                                                  ? ''
                                                  : 's'
                                          }. Choose a subject card to open its course modules.`}
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <LibraryMetric
                                    icon={BookOpen}
                                    label="Lessons"
                                    value={libraryStats.totalLessons}
                                />
                                <LibraryMetric
                                    icon={Zap}
                                    label="Activities"
                                    value={libraryStats.totalActivities}
                                />
                                <LibraryMetric
                                    icon={CheckCircle2}
                                    label="Completed"
                                    value={libraryStats.completed}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-lg border bg-background/85 p-4 shadow-xs">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold">
                                        {selectedSubject
                                            ? 'Subject progress'
                                            : 'Library progress'}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {libraryStats.completedActivities} of{' '}
                                        {libraryStats.totalActivities}{' '}
                                        activities completed
                                    </p>
                                </div>
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                                    {libraryStats.progressPercentage}%
                                </span>
                            </div>
                            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{
                                        width: `${libraryStats.progressPercentage}%`,
                                    }}
                                />
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span>{libraryStats.completed} completed</span>
                                <span>
                                    {libraryStats.inProgress} in progress
                                </span>
                            </div>
                            <div className="mt-5 rounded-lg border border-dashed bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">
                                {selectedSubject
                                    ? 'Your selected subject progress updates as you complete activities.'
                                    : 'Open a subject to see its course modules and teacher updates.'}
                            </div>
                        </div>
                    </div>
                </section>

                {selectedSubject ? (
                    <section className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">
                                    Lessons
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {selectedSubjectLessons.length} lesson
                                    {selectedSubjectLessons.length === 1
                                        ? ''
                                        : 's'}{' '}
                                    available.
                                </p>
                            </div>
                            <Link
                                href={studentLessons()}
                                className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            >
                                <ArrowLeft
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Subjects
                            </Link>
                        </div>

                        <div className="flex flex-col gap-3 rounded-2xl border bg-card/90 p-3 lg:flex-row lg:items-center lg:justify-between">
                            <label className="relative block w-full lg:max-w-sm">
                                <span className="sr-only">Search lessons</span>
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={lessonQuery}
                                    onChange={(event) =>
                                        setLessonQuery(event.target.value)
                                    }
                                    placeholder="Search lesson, topic, or teacher"
                                    className="min-h-11 pl-9"
                                />
                            </label>
                            <div
                                className="flex gap-1 overflow-x-auto"
                                role="group"
                                aria-label="Filter lessons by status"
                            >
                                {(
                                    [
                                        'all',
                                        'not_started',
                                        'in_progress',
                                        'completed',
                                    ] as const
                                ).map((status) => (
                                    <Button
                                        key={status}
                                        type="button"
                                        variant={
                                            statusFilter === status
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        onClick={() => setStatusFilter(status)}
                                        aria-pressed={statusFilter === status}
                                        className="min-h-11 whitespace-nowrap capitalize"
                                    >
                                        {status.replaceAll('_', ' ')}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {visibleSelectedLessons.length > 0 ? (
                            <div className="grid gap-3">
                                {visibleSelectedLessons.map((lesson) => (
                                    <LessonRow
                                        key={lesson.id}
                                        lesson={lesson}
                                        isNew={unreadLessonIds.has(lesson.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <section className="rounded-lg border border-dashed bg-card p-8 text-center text-card-foreground">
                                <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <BookOpen
                                        className="size-6"
                                        aria-hidden="true"
                                    />
                                </span>
                                <h2 className="mt-4 text-lg font-semibold">
                                    {selectedSubjectLessons.length === 0
                                        ? 'No lessons in this subject'
                                        : 'No lessons match your filters'}
                                </h2>
                                <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                                    {selectedSubjectLessons.length === 0
                                        ? 'Return to subjects to browse the available lesson library.'
                                        : 'Try another search term or lesson status.'}
                                </p>
                            </section>
                        )}
                    </section>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {subjectGroups.map(
                            ({ subject, lessons: subjectLessons }) => {
                                const notification =
                                    notificationsBySubject.get(subject);

                                return (
                                    <SubjectCard
                                        key={subject}
                                        subject={subject}
                                        lessons={subjectLessons}
                                        notification={notification}
                                    />
                                );
                            },
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

function LibraryMetric({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof BookOpen;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-lg border bg-background/80 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
                {value}
            </p>
        </div>
    );
}

function SubjectCard({
    subject,
    lessons,
    notification,
}: {
    subject: string;
    lessons: Lesson[];
    notification?: SubjectNotification;
}) {
    const stats = getSubjectStats(lessons);
    const teacherLabel =
        stats.teachers.length === 1
            ? stats.teachers[0]
            : `${stats.teachers[0]} +${stats.teachers.length - 1}`;

    return (
        <Link
            href={studentLessons.url({
                query: { subject },
            })}
            className="student-learning-tile group flex min-h-80 flex-col overflow-hidden text-card-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
        >
            <div className="h-2 bg-linear-to-r from-sky-500 via-cyan-400 to-emerald-400" />

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/10">
                        <BookOpen className="size-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col items-end gap-1">
                        {notification && (
                            <Badge className="bg-amber-400 text-amber-950 hover:bg-amber-400">
                                {notification.count} new
                            </Badge>
                        )}
                        <span className="rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {lessons.length} lesson
                            {lessons.length === 1 ? '' : 's'}
                        </span>
                    </div>
                </div>

                <h2 className="mt-3 line-clamp-2 text-lg font-semibold tracking-tight">
                    {subject}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {notification?.latest_message ??
                        'Open a lesson to start, continue, or review your work.'}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <span className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-muted-foreground">
                        <Zap className="size-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">
                            {stats.totalActivities} activities
                        </span>
                    </span>
                    <span className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-muted-foreground">
                        <Layers3
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                        />
                        <span className="truncate">
                            {stats.totalSections} sections
                        </span>
                    </span>
                    <span className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-muted-foreground">
                        <ClipboardCheck
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                        />
                        <span className="truncate">
                            {stats.totalQuestions} quizzes
                        </span>
                    </span>
                    <span className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-muted-foreground">
                        <CalendarDays
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                        />
                        <span className="truncate">
                            {formatDate(stats.latestDate)}
                        </span>
                    </span>
                </div>

                <div className="mt-4 rounded-lg border bg-background/80 p-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-medium text-muted-foreground">
                            Course progress
                        </span>
                        <span className="font-semibold">
                            {stats.progressPercentage}%
                        </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${stats.progressPercentage}%` }}
                        />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        {stats.completedActivities} of {stats.totalActivities}{' '}
                        complete
                    </p>
                </div>

                <div className="mt-4 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                    <UserRound
                        className="size-3.5 shrink-0"
                        aria-hidden="true"
                    />
                    <span className="truncate">{teacherLabel}</span>
                </div>

                {notification?.latest_at && (
                    <div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                        <Bell
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                        />
                        <span className="truncate">
                            Latest update {formatDate(notification.latest_at)}
                        </span>
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4 text-sm font-medium">
                    <span>View lessons</span>
                    <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </Link>
    );
}

function LessonRow({ lesson, isNew }: { lesson: Lesson; isNew: boolean }) {
    const status = getLessonStatus(lesson);
    const stats = getLessonStats(lesson);
    const StatusIcon =
        status === 'completed'
            ? CheckCircle2
            : status === 'in_progress'
              ? RotateCcw
              : PlayCircle;

    return (
        <Link
            href={studentLessonShow(lesson.id)}
            className="student-learning-tile group grid gap-4 p-4 text-sm sm:grid-cols-[auto_minmax(0,1fr)_12rem_auto_auto] sm:items-center"
        >
            <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                    status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
                        : status === 'in_progress'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                }`}
            >
                <StatusIcon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
                <span className="block truncate font-medium group-hover:text-primary">
                    {lesson.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                    {lesson.topic || lesson.subject || 'General'} -{' '}
                    {lesson.teacher_name ?? 'Unassigned'}
                </span>
            </span>
            <span className="grid min-w-0 gap-2">
                <span className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">
                        {stats.progressPercentage}%
                    </span>
                </span>
                <span className="h-2 overflow-hidden rounded-full bg-muted">
                    <span
                        className="block h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${stats.progressPercentage}%` }}
                    />
                </span>
            </span>
            <span className="flex items-center justify-between gap-2 sm:justify-end">
                <Badge
                    variant="outline"
                    className={statusCopy[status].className}
                >
                    {statusCopy[status].label}
                </Badge>
                {isNew && (
                    <Badge className="bg-amber-500 text-white hover:bg-amber-500">
                        New
                    </Badge>
                )}
            </span>
            <ArrowRight
                className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
                aria-hidden="true"
            />
        </Link>
    );
}

StudentLessonsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: studentDashboard() },
        { title: 'Lessons', href: studentLessons() },
    ],
};
