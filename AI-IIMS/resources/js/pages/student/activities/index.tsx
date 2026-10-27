import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    ClipboardCheck,
    Search,
    Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import {
    StudentEmptyState,
    StudentPage,
    StudentPageHeader,
    StudentStatus,
} from '@/components/student/student-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ActivityRow = {
    id: number;
    lesson_id: number;
    lesson_title: string | null;
    subject: string | null;
    topic: string | null;
    type: string;
    title: string;
    record_score: boolean;
    submitted: boolean;
    is_correct: boolean | null;
    score: number | null;
    feedback: string | null;
};

type Filter = 'all' | 'open' | 'submitted';

const typeLabel = (type: string) => type.replaceAll('_', ' ');

export default function StudentActivitiesIndex({
    activities,
}: {
    activities: ActivityRow[];
}) {
    const [filter, setFilter] = useState<Filter>('all');
    const [query, setQuery] = useState('');
    const submittedCount = activities.filter(
        (activity) => activity.submitted,
    ).length;
    const openCount = activities.length - submittedCount;
    const filteredActivities = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return activities.filter((activity) => {
            const matchesFilter =
                filter === 'all' ||
                (filter === 'submitted' && activity.submitted) ||
                (filter === 'open' && !activity.submitted);
            const matchesQuery =
                normalizedQuery.length === 0 ||
                [
                    activity.title,
                    activity.lesson_title,
                    activity.subject,
                    activity.topic,
                    activity.type,
                ].some((value) =>
                    value?.toLowerCase().includes(normalizedQuery),
                );

            return matchesFilter && matchesQuery;
        });
    }, [activities, filter, query]);

    return (
        <>
            <Head title="Activities" />
            <StudentPage>
                <StudentPageHeader
                    eyebrow="Practice space"
                    icon={ClipboardCheck}
                    title="Your activities"
                    description="Find unfinished practice, return to a lesson, or review the work you already submitted."
                >
                    <div className="mt-5 flex flex-wrap gap-2">
                        <StudentStatus
                            tone={openCount > 0 ? 'warning' : 'success'}
                        >
                            {openCount} open
                        </StudentStatus>
                        <StudentStatus tone="success">
                            {submittedCount} submitted
                        </StudentStatus>
                    </div>
                </StudentPageHeader>

                <section
                    aria-labelledby="activity-list-title"
                    className="space-y-4"
                >
                    <div className="flex flex-col gap-3 rounded-2xl border bg-card/90 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div
                            className="flex gap-1 overflow-x-auto"
                            role="group"
                            aria-label="Filter activities"
                        >
                            {(['all', 'open', 'submitted'] as const).map(
                                (item) => (
                                    <Button
                                        key={item}
                                        type="button"
                                        variant={
                                            filter === item
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        onClick={() => setFilter(item)}
                                        aria-pressed={filter === item}
                                        className="min-h-11 capitalize"
                                    >
                                        {item}
                                    </Button>
                                ),
                            )}
                        </div>
                        <label className="relative block w-full sm:max-w-xs">
                            <span className="sr-only">Search activities</span>
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Search activity or lesson"
                                className="min-h-11 pl-9"
                            />
                        </label>
                    </div>

                    <h2 id="activity-list-title" className="sr-only">
                        Activity list
                    </h2>
                    {filteredActivities.length === 0 ? (
                        <StudentEmptyState
                            icon={Sparkles}
                            title={
                                activities.length === 0
                                    ? 'No activities yet'
                                    : 'No matching activities'
                            }
                            description={
                                activities.length === 0
                                    ? 'Activities appear here when a published lesson includes practice work.'
                                    : 'Try a different status or search term.'
                            }
                        />
                    ) : (
                        <div className="grid gap-3 lg:grid-cols-2">
                            {filteredActivities.map((activity) => (
                                <article
                                    key={activity.id}
                                    className="student-learning-tile flex flex-col gap-4 p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <span
                                            className={cn(
                                                'flex size-11 shrink-0 items-center justify-center rounded-2xl',
                                                activity.submitted
                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
                                            )}
                                        >
                                            {activity.submitted ? (
                                                <CheckCircle2
                                                    className="size-5"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <ClipboardCheck
                                                    className="size-5"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </span>
                                        <StudentStatus
                                            tone={
                                                activity.submitted
                                                    ? 'success'
                                                    : 'warning'
                                            }
                                        >
                                            {activity.submitted
                                                ? 'Submitted'
                                                : 'Open'}
                                        </StudentStatus>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                                            {typeLabel(activity.type)}
                                        </p>
                                        <h3 className="mt-1 text-lg font-semibold text-balance">
                                            {activity.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {activity.lesson_title ?? 'Lesson'}{' '}
                                            ·{' '}
                                            {activity.subject ??
                                                activity.topic ??
                                                'General'}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 border-t pt-4">
                                        <span className="text-sm text-muted-foreground">
                                            {activity.score === null
                                                ? activity.submitted
                                                    ? 'Not scored'
                                                    : 'Ready to complete'
                                                : `Score ${activity.score.toFixed(2)}`}
                                        </span>
                                        <Button
                                            asChild
                                            variant={
                                                activity.submitted
                                                    ? 'outline'
                                                    : 'default'
                                            }
                                            className="min-h-11"
                                        >
                                            <Link
                                                href={`/student/lessons/${activity.lesson_id}`}
                                            >
                                                {activity.submitted
                                                    ? 'Review'
                                                    : 'Continue'}
                                                <ArrowRight
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </StudentPage>
        </>
    );
}

StudentActivitiesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'Activities', href: '/student/activities' },
    ],
};
