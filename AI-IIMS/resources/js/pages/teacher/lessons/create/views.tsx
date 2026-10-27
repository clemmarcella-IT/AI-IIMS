import type { BookOpen } from 'lucide-react';
import {
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    Link as LinkIcon,
    Presentation,
    Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import RichTextContent from '@/components/rich-text-content';
import { ActivityRenderer } from '@/components/student/activities/ActivityRenderer';
import { hasSlideDeck, SlideDeckViewer } from '@/components/lesson-slides';

import {
    activityLabels,
    difficultyClassNames,
    difficultyLabels,
    getVideoEmbedUrl,
    normalizeChoices,
} from './helpers';
import type {
    ActivityType,
    AiSuggestion,
    Difficulty,
    LessonActivity,
    LessonMedia,
    LessonSection,
} from './types';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui';

export function EmptyBuilderState({
    icon: Icon,
    title,
    description,
}: {
    icon: typeof BookOpen;
    title: string;
    description: string;
}) {
    return (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-base font-semibold">{title}</h2>
            <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

export function MediaPreview({ mediaItem }: { mediaItem: LessonMedia }) {
    const Icon =
        mediaItem.type === 'image'
            ? ImageIcon
            : mediaItem.type === 'video'
              ? Video
              : mediaItem.type === 'slides'
                ? Presentation
                : LinkIcon;
    const mediaUrl = mediaItem.preview_url ?? mediaItem.url;
    const videoEmbedUrl =
        mediaItem.type === 'video' ? getVideoEmbedUrl(mediaUrl) : null;

    return (
        <div className="overflow-hidden rounded-lg border">
            {mediaItem.type === 'image' && mediaUrl ? (
                <img
                    src={mediaUrl}
                    alt={mediaItem.caption || 'Lesson media'}
                    className="aspect-video w-full object-cover"
                />
            ) : mediaItem.type === 'video' && videoEmbedUrl ? (
                <iframe
                    src={videoEmbedUrl}
                    title={mediaItem.caption || 'Lesson video'}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : mediaItem.type === 'video' && mediaUrl ? (
                <video
                    src={mediaUrl}
                    controls
                    className="aspect-video w-full bg-muted"
                />
            ) : mediaItem.type === 'slides' && mediaUrl ? (
                <a
                    href={mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex aspect-video items-center justify-center bg-muted text-muted-foreground transition-colors hover:bg-muted/70"
                >
                    <span className="grid justify-items-center gap-2">
                        <Presentation className="size-8" aria-hidden="true" />
                        <span className="text-sm font-medium">Open slides</span>
                    </span>
                </a>
            ) : (
                <div className="flex aspect-video items-center justify-center bg-muted text-muted-foreground">
                    <Icon className="size-8" aria-hidden="true" />
                </div>
            )}
            <div className="grid gap-1 p-3">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{mediaItem.type}</Badge>
                    {mediaItem.upload_name && !mediaItem.url && (
                        <span className="truncate text-sm text-muted-foreground">
                            {mediaItem.upload_name}
                        </span>
                    )}
                    {mediaItem.url && (
                        <a
                            href={mediaItem.url}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate text-sm text-primary underline-offset-4 hover:underline"
                        >
                            {mediaItem.url}
                        </a>
                    )}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                    {mediaItem.caption || 'No caption added yet.'}
                </p>
            </div>
        </div>
    );
}

export function ActivityPreview({ activity }: { activity: LessonActivity }) {
    return (
        <Card className="shadow-none">
            <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                        {activityLabels[activity.type]}
                    </Badge>
                </div>
                <CardTitle className="text-base">
                    {activity.title || 'Untitled Activity'}
                </CardTitle>
                <CardDescription className="leading-6 whitespace-pre-wrap">
                    {activity.instruction || 'No instruction added yet.'}
                </CardDescription>
            </CardHeader>
            {activity.type === 'mini_quiz' && (
                <CardContent className="grid gap-3">
                    <p className="text-sm font-medium">
                        {activity.question || 'No question added yet.'}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {normalizeChoices(activity.choices).map(
                            (choice, index) => {
                                const answer = String.fromCharCode(65 + index);

                                return (
                                    <div
                                        key={`${activity.id}-preview-${answer}`}
                                        className="rounded-lg border p-3 text-sm"
                                    >
                                        <span className="font-medium">
                                            {answer}.
                                        </span>{' '}
                                        {choice || 'Choice not set'}
                                    </div>
                                );
                            },
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Correct answer:{' '}
                        {String(activity.correct_answer ?? 'Not set')}
                    </p>
                    {activity.explanation && (
                        <p className="rounded-lg bg-muted p-3 text-sm leading-6">
                            {activity.explanation}
                        </p>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

export function SectionAccordion({ sections }: { sections: LessonSection[] }) {
    return (
        <Accordion type="multiple" className="w-full">
            {sections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger>
                        <span className="flex flex-wrap items-center gap-2 text-left">
                            <span>
                                {section.title ||
                                    `Section ${section.sort_order}`}
                            </span>
                            <Badge variant="secondary">
                                {section.activities.length} activities
                            </Badge>
                            <Badge variant="outline">
                                {section.media.length} media
                            </Badge>
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="grid gap-4">
                        {section.content_type === 'slides' ||
                        hasSlideDeck(section.content) ? (
                            <SlideDeckViewer html={section.content} />
                        ) : section.content ? (
                            <RichTextContent html={section.content} />
                        ) : (
                            <p className="leading-6 text-muted-foreground">
                                No content added yet.
                            </p>
                        )}
                        {section.media.length > 0 && (
                            <div className="grid gap-4 md:grid-cols-2">
                                {section.media.map((mediaItem) => (
                                    <MediaPreview
                                        key={mediaItem.id}
                                        mediaItem={mediaItem}
                                    />
                                ))}
                            </div>
                        )}
                        {section.activities.map((activity) => (
                            <ActivityPreview
                                key={activity.id}
                                activity={activity}
                            />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export function StudentLessonPreview({
    title,
    subject,
    topic,
    difficulty,
    sections,
    activities,
}: {
    title: string;
    subject: string;
    topic: string;
    difficulty: Difficulty;
    sections: LessonSection[];
    activities: LessonActivity[];
}) {
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const activeSection =
        sections[
            Math.min(activeSectionIndex, Math.max(sections.length - 1, 0))
        ];
    const progress = useMemo(() => {
        if (sections.length === 0) {
            return 0;
        }

        return Math.round(
            ((Math.min(activeSectionIndex, sections.length - 1) + 1) /
                sections.length) *
                100,
        );
    }, [activeSectionIndex, sections.length]);
    const canGoPrevious = activeSectionIndex > 0;
    const canGoNext = activeSectionIndex < sections.length - 1;

    return (
        <Card className="min-w-0 overflow-hidden border-sidebar-border/70 p-4 shadow-sm sm:p-6 dark:border-sidebar-border">
            <CardHeader>
                <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <CardTitle className="text-2xl break-words">
                            {title || 'Untitled Lesson'}
                        </CardTitle>
                        <CardDescription className="mt-2">
                            {(subject || 'Subject not set') +
                                ' / ' +
                                (topic || 'Topic not set')}
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="outline"
                            className={difficultyClassNames[difficulty]}
                        >
                            {difficultyLabels[difficulty]}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid min-w-0 gap-6">
                <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium">
                                Student flow preview
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Sections are shown one at a time, similar to the
                                student lesson page.
                            </p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            {progress}% through sections
                        </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {sections.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        No content sections have been added yet.
                    </p>
                ) : (
                    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
                        <aside className="grid min-w-0 gap-2 rounded-lg border bg-muted/20 p-3">
                            {sections.map((section, index) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => setActiveSectionIndex(index)}
                                    className={`min-w-0 overflow-hidden rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                                        index === activeSectionIndex
                                            ? 'border-primary bg-primary/5'
                                            : 'bg-background hover:border-foreground/20'
                                    }`}
                                >
                                    <span className="block font-medium">
                                        Section {index + 1}
                                    </span>
                                    <span className="block truncate text-muted-foreground">
                                        {section.title || 'Untitled section'}
                                    </span>
                                </button>
                            ))}
                        </aside>

                        <section className="grid min-w-0 gap-4 rounded-lg border p-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {activeSection?.title ||
                                        `Section ${activeSectionIndex + 1}`}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {activeSection?.activities.length ?? 0}{' '}
                                    activities,{' '}
                                    {activeSection?.media.length ?? 0} media
                                </p>
                            </div>

                            {activeSection?.content_type === 'slides' ||
                            hasSlideDeck(activeSection?.content ?? '') ? (
                                <SlideDeckViewer
                                    html={activeSection?.content ?? ''}
                                />
                            ) : activeSection?.content ? (
                                <RichTextContent html={activeSection.content} />
                            ) : (
                                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                    No content added yet.
                                </p>
                            )}

                            {(activeSection?.media.length ?? 0) > 0 && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {activeSection?.media.map((mediaItem) => (
                                        <MediaPreview
                                            key={mediaItem.id}
                                            mediaItem={mediaItem}
                                        />
                                    ))}
                                </div>
                            )}

                            {(activeSection?.activities.length ?? 0) > 0 && (
                                <div className="grid gap-3">
                                    <h3 className="text-base font-semibold">
                                        Section Activities
                                    </h3>
                                    {activeSection?.activities.map(
                                        (activity) => (
                                            <ActivityPreview
                                                key={activity.id}
                                                activity={activity}
                                            />
                                        ),
                                    )}
                                </div>
                            )}

                            <div className="grid items-center gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-[1fr_auto_1fr]">
                                {canGoPrevious && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setActiveSectionIndex(
                                                (current) => current - 1,
                                            )
                                        }
                                    >
                                        <ChevronLeft
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Previous
                                    </Button>
                                )}
                                <span className="text-center text-sm text-muted-foreground sm:col-start-2">
                                    {activeSectionIndex + 1} of{' '}
                                    {sections.length}
                                </span>
                                {canGoNext && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="sm:justify-self-end"
                                        onClick={() =>
                                            setActiveSectionIndex(
                                                (current) => current + 1,
                                            )
                                        }
                                    >
                                        Next
                                        <ChevronRight
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                <section className="grid gap-3">
                    <h2 className="text-lg font-semibold">
                        End-of-Lesson Activities
                    </h2>
                    {activities.length === 0 ? (
                        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                            No activities have been added yet.
                        </p>
                    ) : (
                        <div className="grid gap-4">
                            {activities.map((activity) => (
                                <ActivityPreview
                                    key={activity.id}
                                    activity={activity}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </CardContent>
        </Card>
    );
}

export function SuggestionPreview({
    suggestion,
}: {
    suggestion: AiSuggestion;
}) {
    const { type, title, content, payload } = suggestion;

    const activityTypes: ActivityType[] = [
        'mini_quiz',
        'true_false',
        'fill_blank',
        'matching',
        'sequencing',
        'reflection',
        'clickable_activity',
    ];

    if (type === 'section_activity' && payload?.activity) {
        const act = payload.activity;

        return (
            <div className="grid gap-3">
                {payload.section_title && (
                    <p className="text-sm text-muted-foreground">
                        For section:{' '}
                        <span className="font-medium text-foreground">
                            {payload.section_title}
                        </span>
                    </p>
                )}
                <ActivityRenderer
                    activity={{
                        id: suggestion.id,
                        type: (act.type ?? 'reflection') as ActivityType,
                        title: act.title ?? title,
                        instruction: act.instruction ?? content,
                        payload: {
                            question: act.question,
                            choices: act.choices,
                            statement: act.statement,
                            sentence: act.sentence,
                            blank_label: act.blank_label,
                            prompt: act.prompt,
                            pairs: act.pairs,
                            items: act.items,
                            cards: act.cards,
                        },
                        correct_answer: act.correct_answer ?? null,
                        explanation: act.explanation ?? null,
                        submitted_answer: null,
                        submission: null,
                    }}
                />
            </div>
        );
    }

    if (activityTypes.includes(type as ActivityType)) {
        return (
            <ActivityRenderer
                activity={{
                    id: suggestion.id,
                    type: type as ActivityType,
                    title,
                    instruction: content,
                    payload: {
                        question: payload?.question,
                        choices: payload?.choices,
                        statement: payload?.statement,
                        sentence: payload?.sentence,
                        blank_label: payload?.blank_label,
                        prompt: payload?.prompt,
                        pairs: payload?.pairs,
                        items: payload?.items,
                        cards: payload?.cards,
                    },
                    correct_answer: payload?.correct_answer ?? null,
                    explanation: payload?.explanation ?? null,
                    submitted_answer: null,
                    submission: null,
                }}
            />
        );
    }

    if (type === 'media_suggestion' && payload) {
        return (
            <MediaPreview
                mediaItem={{
                    id: suggestion.id,
                    type: payload.media_type ?? 'link',
                    source: 'url',
                    url: payload.url ?? '',
                    caption: payload.caption ?? title,
                }}
            />
        );
    }

    return (
        <div className="grid gap-3">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                {content}
            </p>
        </div>
    );
}
