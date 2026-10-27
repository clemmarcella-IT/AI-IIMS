import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    ClipboardCheck,
    Lightbulb,
    MessageSquareText,
    RotateCcw,
    Sparkles,
} from 'lucide-react';

import {
    StudentEmptyState,
    StudentPage,
    StudentPageHeader,
    StudentStatus,
} from '@/components/student/student-ui';
import { Button } from '@/components/ui/button';

type Recommendation = {
    title: string;
    description: string;
    href: string;
    type: 'assessment' | 'lesson' | 'review' | 'survey' | string;
};

const icons = {
    assessment: ClipboardCheck,
    lesson: BookOpen,
    review: RotateCcw,
    survey: MessageSquareText,
};

const reasonCopy = {
    assessment: 'This step measures your learning and unlocks the next stage.',
    lesson: 'This is the next available lesson in your learning path.',
    review: 'A lower activity score suggests this topic is worth revisiting.',
    survey: 'Your posttest is complete, so your feedback is ready to collect.',
};

export default function StudentRecommendationsIndex({
    recommendations,
}: {
    recommendations: Recommendation[];
}) {
    return (
        <>
            <Head title="Recommendations" />
            <StudentPage>
                <StudentPageHeader
                    eyebrow="Personalized next steps"
                    icon={Lightbulb}
                    title="A clear path forward"
                    description="These suggestions use your assessment status, lesson completion, and activity scores to prioritize what will help next."
                />

                {recommendations.length === 0 ? (
                    <StudentEmptyState
                        icon={Sparkles}
                        title="You’re all caught up"
                        description="There are no new recommendations right now. Continue exploring lessons or review your progress."
                        action={
                            <Button asChild>
                                <Link href="/student/lessons">
                                    Explore lessons
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <ol className="grid gap-4 lg:grid-cols-2">
                        {recommendations.map((recommendation, index) => {
                            const Icon =
                                icons[
                                    recommendation.type as keyof typeof icons
                                ] ?? Lightbulb;
                            const reason =
                                reasonCopy[
                                    recommendation.type as keyof typeof reasonCopy
                                ] ??
                                'This suggestion matches your current learning progress.';

                            return (
                                <li
                                    key={`${recommendation.type}-${recommendation.href}`}
                                    className={
                                        index === 0
                                            ? 'lg:col-span-2'
                                            : undefined
                                    }
                                >
                                    <article className="student-learning-tile relative h-full overflow-hidden p-5 sm:p-6">
                                        {index === 0 && (
                                            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-500 via-cyan-400 to-emerald-400" />
                                        )}
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <Icon
                                                    className="size-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <StudentStatus
                                                tone={
                                                    index === 0
                                                        ? 'info'
                                                        : 'neutral'
                                                }
                                            >
                                                {index === 0
                                                    ? 'Best next step'
                                                    : `Option ${index + 1}`}
                                            </StudentStatus>
                                        </div>
                                        <h2 className="mt-5 text-xl font-bold tracking-tight">
                                            {recommendation.title}
                                        </h2>
                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                            {recommendation.description}
                                        </p>
                                        <div className="mt-5 rounded-xl bg-muted/55 p-4">
                                            <p className="text-xs font-bold tracking-wide text-primary uppercase">
                                                Why this is recommended
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                {reason}
                                            </p>
                                        </div>
                                        <Button
                                            asChild
                                            variant={
                                                index === 0
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="mt-5 min-h-11"
                                        >
                                            <Link href={recommendation.href}>
                                                Open recommendation
                                                <ArrowRight
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </Button>
                                    </article>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </StudentPage>
        </>
    );
}

StudentRecommendationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'Recommendations', href: '/student/recommendations' },
    ],
};
