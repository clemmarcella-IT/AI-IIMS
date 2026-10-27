import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    Flag,
    Link as LinkIcon,
    LockKeyhole,
    PartyPopper,
    PlaySquare,
    Presentation,
    Sparkles,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { hasSlideDeck, SlideDeckViewer } from '@/components/lesson-slides';
import RichTextContent from '@/components/rich-text-content';
import { ActivityRenderer } from '@/components/student/activities/ActivityRenderer';
import type {
    StudentActivity,
    SubmitResult,
} from '@/components/student/activities/types';
import {
    StudentEmptyState,
    StudentPage,
    StudentProgress,
    StudentStatus,
} from '@/components/student/student-ui';
import type {
    VideoCuePoint,
    VideoMedia,
} from '@/components/student/video/types';
import { VideoPlayer } from '@/components/student/video/VideoPlayer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard as studentDashboard } from '@/routes/student';
import { index as studentLessons } from '@/routes/student/lessons';

type AnswerKey = 'A' | 'B' | 'C' | 'D';
type FlowStatus = 'completed' | 'current' | 'locked';

type FlowStep = {
    key: string;
    type: 'reading' | 'media' | 'activity' | 'quiz';
    source_id: number | string | null;
    section_id: number | null;
    title: string;
    detail: string;
    media_type?: LessonMedia['type'];
    part_index?: number;
    position_seconds: number;
    is_complete: boolean;
    is_unlocked: boolean;
    status: FlowStatus;
};

type LessonFlow = {
    steps: FlowStep[];
    current_step_key: string | null;
    completed_units: number;
    total_units: number;
    progress_percentage: number;
};

type LessonQuestion = {
    id: number;
    question_text: string;
    options: { id: AnswerKey; label: string }[];
    attempt_count: number;
    mastered: boolean;
    latest_answer: AnswerKey | null;
    latest_is_correct: boolean | null;
};

type LessonMedia = {
    id: number;
    type: 'image' | 'video' | 'link' | 'slides';
    url: string;
    caption: string | null;
    cue_points?: VideoCuePoint[];
};

type LessonSection = {
    id?: number;
    title: string;
    content: string;
    content_type?: 'text' | 'slides';
    media?: LessonMedia[];
    activities?: StudentActivity[];
};

type Lesson = {
    id: number;
    title: string;
    subject: string | null;
    topic: string | null;
    content: string | null;
    objectives: string | null;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    teacher_name: string | null;
    updated_at: string | null;
    sections: LessonSection[];
    media: LessonMedia[];
    activities: StudentActivity[];
    questions: LessonQuestion[];
    flow: LessonFlow;
};

const stepIcons = {
    reading: BookOpen,
    media: PlaySquare,
    activity: Zap,
    quiz: ClipboardCheck,
};

const getCsrfToken = () =>
    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.content ?? '';

async function postJson<T>(url: string, body: object): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error('Request failed.');
    }

    return (await response.json()) as T;
}

export default function StudentLessonShow({ lesson }: { lesson: Lesson }) {
    const [flow, setFlow] = useState(lesson.flow);
    const [activeStepKey, setActiveStepKey] = useState(
        lesson.flow.current_step_key ?? lesson.flow.steps[0]?.key ?? null,
    );
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const activeIndex = Math.max(
        0,
        flow.steps.findIndex((step) => step.key === activeStepKey),
    );
    const activeStep = flow.steps[activeIndex];
    const previousStep = flow.steps[activeIndex - 1];
    const nextStep = flow.steps[activeIndex + 1];
    const lessonComplete =
        flow.total_units > 0 && flow.completed_units === flow.total_units;
    const allActivities = useMemo(
        () => [
            ...lesson.sections.flatMap((section) => section.activities ?? []),
            ...lesson.activities,
        ],
        [lesson.activities, lesson.sections],
    );
    const allMedia = useMemo(
        () => [
            ...lesson.sections.flatMap((section) => section.media ?? []),
            ...lesson.media,
        ],
        [lesson.media, lesson.sections],
    );

    const completeCheckpoint = async (step: FlowStep) => {
        setIsSaving(true);
        setSaveError(null);

        try {
            const response = await postJson<{ flow: LessonFlow }>(
                `/student/lessons/${lesson.id}/checkpoints`,
                { step_key: step.key },
            );
            setFlow(response.flow);
        } catch {
            setSaveError('Your progress could not be saved. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleActivitySubmitted = (
        _activityId: StudentActivity['id'],
        result: SubmitResult,
    ) => {
        if (result.flow) {
            setFlow(result.flow as LessonFlow);
        }
    };

    const markMediaCompleteLocally = () => {
        setFlow((current) => markStepComplete(current, activeStep?.key));
    };

    const goToStep = (step?: FlowStep) => {
        if (!step?.is_unlocked) {
            return;
        }

        setActiveStepKey(step.key);
        setSaveError(null);
        document
            .getElementById('lesson-content')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <Head title={lesson.title} />
            <StudentPage>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href={studentLessons()}
                        className="student-focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to lessons
                    </Link>
                    <StudentStatus tone={lessonComplete ? 'success' : 'info'}>
                        <Flag className="size-3.5" />
                        {lessonComplete
                            ? 'Lesson complete'
                            : `${flow.completed_units}/${flow.total_units} steps`}
                    </StudentStatus>
                </div>

                <header className="student-panel student-reveal overflow-hidden">
                    <div className="h-1.5 bg-linear-to-r from-sky-500 via-cyan-400 to-emerald-400" />
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <StudentStatus tone="info">
                                {lesson.subject ?? 'General'}
                            </StudentStatus>
                            <StudentStatus>
                                {lesson.difficulty_level}
                            </StudentStatus>
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="size-3.5" />
                                Updated {lesson.updated_at ?? 'recently'}
                            </span>
                        </div>
                        <h1 className="mt-4 max-w-4xl text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                            {lesson.title}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Guided by {lesson.teacher_name ?? 'your teacher'} ·
                            Complete each stage to unlock the next.
                        </p>
                        <StudentProgress
                            value={flow.progress_percentage}
                            label="Lesson progress"
                            detail={`${flow.completed_units} of ${flow.total_units} learning steps complete`}
                            className="mt-5 max-w-2xl"
                        />
                    </div>
                </header>

                <MobileFlow
                    flow={flow}
                    activeStepKey={activeStepKey}
                    onSelect={goToStep}
                />

                {flow.steps.length === 0 ? (
                    <StudentEmptyState
                        icon={BookOpen}
                        title="No lesson content available"
                        description="This published lesson does not contain student-visible learning material yet."
                    />
                ) : (
                    <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
                        <main
                            id="lesson-content"
                            className="min-w-0 scroll-mt-4 sm:scroll-mt-6"
                            aria-live="polite"
                        >
                            <section className="student-panel overflow-hidden">
                                <div className="flex flex-wrap items-start justify-between gap-4 border-b bg-muted/25 p-5 sm:p-6">
                                    <div className="flex min-w-0 items-start gap-4">
                                        {activeStep && (
                                            <StepIcon step={activeStep} />
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold tracking-widest text-primary uppercase">
                                                Step {activeIndex + 1} of{' '}
                                                {flow.total_units} ·{' '}
                                                {activeStep?.type}
                                            </p>
                                            <h2 className="mt-1 text-xl font-bold text-balance sm:text-2xl">
                                                {activeStep?.title}
                                            </h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {activeStep?.detail}
                                            </p>
                                        </div>
                                    </div>
                                    {activeStep?.is_complete && (
                                        <StudentStatus tone="success">
                                            <CheckCircle2 className="size-3.5" />
                                            Completed
                                        </StudentStatus>
                                    )}
                                </div>

                                <div className="p-5 sm:p-7">
                                    {activeStep?.type === 'reading' && (
                                        <ReadingStage
                                            lesson={lesson}
                                            step={activeStep}
                                        />
                                    )}
                                    {activeStep?.type === 'media' && (
                                        <MediaStage
                                            lessonId={lesson.id}
                                            media={allMedia.find(
                                                (item) =>
                                                    item.id ===
                                                    Number(
                                                        activeStep.source_id,
                                                    ),
                                            )}
                                            step={activeStep}
                                            onVideoCompleted={
                                                markMediaCompleteLocally
                                            }
                                        />
                                    )}
                                    {activeStep?.type === 'activity' && (
                                        <ActivityStage
                                            activity={allActivities.find(
                                                (item) =>
                                                    item.id ===
                                                    activeStep.source_id,
                                            )}
                                            onSubmitted={
                                                handleActivitySubmitted
                                            }
                                        />
                                    )}
                                    {activeStep?.type === 'quiz' && (
                                        <KnowledgeCheck
                                            question={lesson.questions.find(
                                                (question) =>
                                                    question.id ===
                                                    Number(
                                                        activeStep.source_id,
                                                    ),
                                            )}
                                            onFlow={setFlow}
                                        />
                                    )}

                                    {saveError && (
                                        <Alert
                                            variant="destructive"
                                            className="mt-5"
                                        >
                                            <AlertTitle>
                                                Progress not saved
                                            </AlertTitle>
                                            <AlertDescription>
                                                {saveError}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {activeStep &&
                                        !activeStep.is_complete &&
                                        ['reading', 'media'].includes(
                                            activeStep.type,
                                        ) &&
                                        activeStep.media_type !== 'video' && (
                                            <div className="mt-7 flex justify-end border-t pt-5">
                                                <Button
                                                    type="button"
                                                    disabled={isSaving}
                                                    onClick={() =>
                                                        completeCheckpoint(
                                                            activeStep,
                                                        )
                                                    }
                                                    className="min-h-11"
                                                >
                                                    {isSaving
                                                        ? 'Saving…'
                                                        : activeStep.type ===
                                                            'reading'
                                                          ? 'Finished reading'
                                                          : 'Mark as reviewed'}
                                                    <Check className="size-4" />
                                                </Button>
                                            </div>
                                        )}
                                </div>

                                <nav className="sticky bottom-2 z-10 mx-3 mb-3 flex flex-col gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={!previousStep?.is_unlocked}
                                        onClick={() => goToStep(previousStep)}
                                        className="min-h-11"
                                    >
                                        <ArrowLeft className="size-4" />
                                        Previous
                                    </Button>
                                    {activeStep?.is_complete &&
                                    nextStep?.is_unlocked ? (
                                        <Button
                                            type="button"
                                            onClick={() => goToStep(nextStep)}
                                            className="min-h-11"
                                        >
                                            Continue
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    ) : lessonComplete ? (
                                        <Button
                                            asChild
                                            className="min-h-11 bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            <Link href={studentLessons()}>
                                                Finish lesson
                                                <PartyPopper className="size-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <p className="px-2 text-center text-xs text-muted-foreground sm:text-right">
                                            Complete this step to continue.
                                        </p>
                                    )}
                                </nav>
                            </section>

                            {lessonComplete && (
                                <Alert className="mt-5 border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/50">
                                    <PartyPopper className="size-4 text-emerald-600" />
                                    <AlertTitle>
                                        You completed the lesson!
                                    </AlertTitle>
                                    <AlertDescription>
                                        Every learning step is complete. You can
                                        revisit any stage whenever you need a
                                        review.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </main>

                        <aside className="hidden xl:sticky xl:top-6 xl:block xl:self-start">
                            <FlowRail
                                flow={flow}
                                activeStepKey={activeStepKey}
                                onSelect={goToStep}
                            />
                        </aside>
                    </div>
                )}
            </StudentPage>
        </>
    );
}

function ReadingStage({ lesson, step }: { lesson: Lesson; step: FlowStep }) {
    const section = lesson.sections.find((item) => item.id === step.section_id);
    const isObjectives = step.key === 'legacy:objectives:reading';
    const isLegacyPart = step.key.startsWith('legacy:content:');
    const content =
        section?.content ??
        (isObjectives
            ? lesson.objectives
            : isLegacyPart
              ? splitLegacyContent(lesson.content ?? '')[step.part_index ?? 0]
              : '') ??
        '';
    const isSlides =
        section?.content_type === 'slides' || hasSlideDeck(content);

    return isSlides ? (
        <div className="mx-auto max-w-5xl">
            <SlideDeckViewer html={content} />
        </div>
    ) : (
        <RichTextContent
            html={content}
            className="lesson-prose-adventure mx-auto max-w-[76ch] text-base leading-8 sm:text-lg"
        />
    );
}

function splitLegacyContent(content: string): string[] {
    const trimmed = content.trim();

    if (!trimmed) {
        return [];
    }

    const parts = /<h[1-6]\b/i.test(trimmed)
        ? trimmed.split(/(?=<h[1-6]\b)/i)
        : trimmed.split(/\r?\n\s*\r?\n/);

    return parts.map((part) => part.trim()).filter(Boolean);
}

function MediaStage({
    lessonId,
    media,
    step,
    onVideoCompleted,
}: {
    lessonId: number;
    media?: LessonMedia;
    step: FlowStep;
    onVideoCompleted: () => void;
}) {
    if (!media) {
        return (
            <p className="text-muted-foreground">
                This resource is no longer available.
            </p>
        );
    }

    if (media.type === 'video') {
        return (
            <VideoPlayer
                initialPositionSeconds={step.position_seconds}
                lessonId={lessonId}
                media={media as VideoMedia}
                onCompleted={onVideoCompleted}
            />
        );
    }

    if (media.type === 'image') {
        return (
            <img
                src={media.url}
                alt={media.caption ?? 'Lesson resource'}
                className="mx-auto max-h-[65vh] rounded-xl border object-contain"
            />
        );
    }

    const Icon = media.type === 'slides' ? Presentation : LinkIcon;

    return (
        <a
            href={media.url}
            target="_blank"
            rel="noreferrer"
            className="student-learning-tile student-focus-ring mx-auto flex min-h-64 max-w-2xl flex-col items-center justify-center gap-4 p-8 text-center"
        >
            <Icon className="size-12 text-primary" />
            <span className="text-lg font-semibold">
                Open {media.type === 'slides' ? 'slides' : 'learning resource'}
            </span>
            <span className="text-sm text-muted-foreground">
                {media.caption ?? media.url}
            </span>
        </a>
    );
}

function ActivityStage({
    activity,
    onSubmitted,
}: {
    activity?: StudentActivity;
    onSubmitted: (
        activityId: StudentActivity['id'],
        result: SubmitResult,
    ) => void;
}) {
    return activity ? (
        <div className="mx-auto max-w-5xl">
            <ActivityRenderer activity={activity} onSubmitted={onSubmitted} />
        </div>
    ) : (
        <p className="text-muted-foreground">
            This activity is no longer available.
        </p>
    );
}

function KnowledgeCheck({
    question,
    onFlow,
}: {
    question?: LessonQuestion;
    onFlow: (flow: LessonFlow) => void;
}) {
    const [answer, setAnswer] = useState<AnswerKey | null>(
        question?.latest_answer ?? null,
    );
    const [result, setResult] = useState<{
        isCorrect: boolean;
        feedback: string;
        mastered: boolean;
    } | null>(
        question?.latest_is_correct === null ||
            question?.latest_is_correct === undefined
            ? null
            : {
                  isCorrect: question.latest_is_correct,
                  feedback: question.latest_is_correct
                      ? 'Correct. Nice work.'
                      : 'Review the lesson and try again.',
                  mastered: question.mastered,
              },
    );
    const [aiFeedback, setAiFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!question) {
        return (
            <p className="text-muted-foreground">
                This question is no longer available.
            </p>
        );
    }

    const submit = async () => {
        if (!answer || result?.mastered) {
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setAiFeedback(null);

        try {
            const response = await postJson<{
                is_correct: boolean;
                mastered: boolean;
                feedback: string;
                flow: LessonFlow;
            }>(`/student/lesson-questions/${question.id}/attempts`, {
                selected_answer: answer,
            });
            setResult({
                isCorrect: response.is_correct,
                mastered: response.mastered,
                feedback: response.feedback,
            });
            onFlow(response.flow);

            if (!response.is_correct) {
                const feedback = await postJson<{ explanation: string }>(
                    '/student/ai/explain-wrong-answer',
                    {
                        source_type: 'lesson_question',
                        source_id: question.id,
                    },
                );
                setAiFeedback(feedback.explanation);
            }
        } catch {
            setError('Your answer could not be submitted. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl">
            <h3 className="text-xl leading-8 font-semibold text-balance">
                {question.question_text}
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup">
                {question.options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={answer === option.id}
                        disabled={result?.mastered}
                        onClick={() => setAnswer(option.id)}
                        className={cn(
                            'student-choice student-focus-ring flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left',
                            answer === option.id &&
                                'border-primary bg-primary/10',
                        )}
                    >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold">
                            {option.id}
                        </span>
                        {option.label}
                    </button>
                ))}
            </div>
            {result && (
                <Alert
                    className={cn(
                        'mt-5',
                        result.isCorrect
                            ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                            : 'border-amber-300 bg-amber-50 dark:bg-amber-950/40',
                    )}
                >
                    <Sparkles className="size-4" />
                    <AlertTitle>
                        {result.isCorrect ? 'Correct' : 'Keep learning'}
                    </AlertTitle>
                    <AlertDescription>
                        {aiFeedback ?? result.feedback}
                    </AlertDescription>
                </Alert>
            )}
            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
            <div className="mt-6 flex justify-end">
                <Button
                    disabled={!answer || isSubmitting || result?.mastered}
                    onClick={submit}
                    className="min-h-11"
                >
                    {isSubmitting
                        ? 'Checking…'
                        : result?.isCorrect === false
                          ? 'Try again'
                          : 'Check answer'}
                    <ArrowRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}

function FlowRail({
    flow,
    activeStepKey,
    onSelect,
}: {
    flow: LessonFlow;
    activeStepKey: string | null;
    onSelect: (step: FlowStep) => void;
}) {
    return (
        <section className="student-panel p-5">
            <h2 className="font-semibold">Lesson path</h2>
            <p className="mt-1 text-xs text-muted-foreground">
                Completed stages remain available for review.
            </p>
            <ol className="mt-5 space-y-2">
                {flow.steps.map((step, index) => (
                    <li key={step.key}>
                        <button
                            type="button"
                            disabled={!step.is_unlocked}
                            onClick={() => onSelect(step)}
                            aria-current={
                                step.key === activeStepKey ? 'step' : undefined
                            }
                            className={cn(
                                'student-focus-ring flex min-h-14 w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                                step.key === activeStepKey &&
                                    'border-primary bg-primary/10',
                                step.is_unlocked &&
                                    step.key !== activeStepKey &&
                                    'hover:border-primary/45 hover:bg-primary/5',
                                !step.is_unlocked &&
                                    'cursor-not-allowed bg-muted/40 opacity-60',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                                    step.is_complete
                                        ? 'bg-emerald-500 text-white'
                                        : step.status === 'current'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-muted text-muted-foreground',
                                )}
                            >
                                {step.is_complete ? (
                                    <Check className="size-4" />
                                ) : step.is_unlocked ? (
                                    index + 1
                                ) : (
                                    <LockKeyhole className="size-3.5" />
                                )}
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">
                                    {step.title}
                                </span>
                                <span className="block text-xs text-muted-foreground capitalize">
                                    {step.type}
                                </span>
                            </span>
                        </button>
                    </li>
                ))}
            </ol>
        </section>
    );
}

function MobileFlow({
    flow,
    activeStepKey,
    onSelect,
}: {
    flow: LessonFlow;
    activeStepKey: string | null;
    onSelect: (step: FlowStep) => void;
}) {
    return (
        <details className="student-panel p-4 xl:hidden">
            <summary className="cursor-pointer font-semibold">
                Lesson path · {flow.completed_units}/{flow.total_units}
            </summary>
            <div className="mt-4">
                <FlowRail
                    flow={flow}
                    activeStepKey={activeStepKey}
                    onSelect={onSelect}
                />
            </div>
        </details>
    );
}

function StepIcon({ step }: { step: FlowStep }) {
    const Icon = stepIcons[step.type];

    return (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-5" />
        </span>
    );
}

function markStepComplete(flow: LessonFlow, stepKey?: string): LessonFlow {
    if (!stepKey) {
        return flow;
    }

    const steps = flow.steps.map((step) =>
        step.key === stepKey
            ? { ...step, is_complete: true, status: 'completed' as const }
            : step,
    );
    const completed = steps.filter((step) => step.is_complete).length;
    const nextIncompleteIndex = steps.findIndex((step) => !step.is_complete);

    return {
        ...flow,
        steps: steps.map((step, index) => ({
            ...step,
            status: step.is_complete
                ? 'completed'
                : index === nextIncompleteIndex
                  ? 'current'
                  : 'locked',
            is_unlocked: step.is_complete || index === nextIncompleteIndex,
        })),
        completed_units: completed,
        current_step_key:
            nextIncompleteIndex >= 0
                ? steps[nextIncompleteIndex].key
                : (steps.at(-1)?.key ?? null),
        progress_percentage:
            steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0,
    };
}

StudentLessonShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: studentDashboard() },
        { title: 'Lessons', href: studentLessons() },
        { title: 'Lesson', href: '#' },
    ],
};
