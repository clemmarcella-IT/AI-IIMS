import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import type { StudentActivity, SubmitResult } from './types';

export type ActivityComponentProps = {
    activity: StudentActivity;
    onSubmitted?: (
        activityId: StudentActivity['id'],
        result: SubmitResult,
    ) => void;
};

export type ActivityAiContext = {
    question: string;
    studentAnswer: string;
};

export type ActivityAiFeedback = {
    explanation: string | null;
    isLoading: boolean;
    error: string | null;
};

export const activityQuestionClassName =
    'student-activity-question text-lg font-bold leading-7 text-foreground sm:text-xl sm:leading-8';

const activitySpeechStartedEvent = 'student-activity-speech-started';
let activeActivitySpeechToken: string | null = null;

export function getCsrfToken() {
    if (typeof document === 'undefined') {
        return '';
    }

    return (
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? ''
    );
}

const cleanSpeechText = (value: unknown) =>
    typeof value === 'string'
        ? value.replace(/\s+/g, ' ').trim()
        : value === null || value === undefined
          ? ''
          : String(value).replace(/\s+/g, ' ').trim();

const joinSpeechParts = (parts: unknown[]) =>
    parts.map(cleanSpeechText).filter(Boolean).join('. ');

function getActivitySpeechText(activity: StudentActivity) {
    const { payload } = activity;
    const prompt =
        payload.question ??
        payload.statement ??
        payload.sentence ??
        payload.prompt ??
        activity.instruction ??
        activity.title;

    if (activity.type === 'mini_quiz') {
        return joinSpeechParts([
            prompt,
            ...(payload.choices ?? []).map(
                (choice, index) => `Choice ${index + 1}: ${choice}`,
            ),
        ]);
    }

    if (activity.type === 'true_false') {
        return joinSpeechParts([prompt, 'Choice 1: True', 'Choice 2: False']);
    }

    if (activity.type === 'fill_blank') {
        return cleanSpeechText(prompt);
    }

    if (activity.type === 'matching') {
        const leftItems = (payload.pairs ?? []).map(
            (pair, index) => `Left item ${index + 1}: ${pair.left}`,
        );
        const rightItems = (payload.pairs ?? []).map(
            (pair, index) => `Choice ${index + 1}: ${pair.right}`,
        );

        return joinSpeechParts([prompt, ...leftItems, ...rightItems]);
    }

    if (activity.type === 'sequencing') {
        return joinSpeechParts([
            prompt,
            ...(payload.items ?? []).map(
                (item, index) => `Choice ${index + 1}: ${item}`,
            ),
        ]);
    }

    if (activity.type === 'clickable_activity') {
        return joinSpeechParts([
            prompt,
            ...(payload.cards ?? []).map((card, index) =>
                joinSpeechParts([
                    `Choice ${index + 1}: ${card.label}`,
                    card.description,
                ]),
            ),
        ]);
    }

    return cleanSpeechText(prompt);
}

export async function submitActivity(
    activityId: StudentActivity['id'],
    answer: unknown,
) {
    const response = await fetch(`/student/activities/${activityId}/submit`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ answer }),
    });

    if (!response.ok) {
        throw new Error('Unable to submit activity.');
    }

    return (await response.json()) as SubmitResult;
}

export function useActivitySubmission(
    activity: StudentActivity,
    onSubmitted?: ActivityComponentProps['onSubmitted'],
) {
    const [result, setResult] = useState<SubmitResult | null>(
        activity.submission
            ? {
                  ...activity.submission,
              }
            : null,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiFeedback, setAiFeedback] = useState<ActivityAiFeedback | null>(
        null,
    );

    const requestActivityAiFeedback = async () => {
        setAiFeedback({ explanation: null, isLoading: true, error: null });

        try {
            const response = await fetch('/student/ai/explain-wrong-answer', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    source_type: 'activity',
                    source_id: activity.id,
                }),
            });

            if (!response.ok) {
                throw new Error('AI feedback unavailable.');
            }

            const data = (await response.json()) as { explanation?: string };
            setAiFeedback({
                explanation:
                    data.explanation ?? 'No explanation was generated.',
                isLoading: false,
                error: null,
            });
        } catch {
            setAiFeedback({
                explanation: null,
                isLoading: false,
                error: 'AI feedback is currently unavailable.',
            });
        }
    };

    const submit = async (answer: unknown, aiContext?: ActivityAiContext) => {
        if (result?.mastered || typeof activity.id !== 'number') {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const nextResult = await submitActivity(activity.id, answer);
            setResult(nextResult);
            onSubmitted?.(activity.id, nextResult);

            if (nextResult.is_correct === false && aiContext) {
                void requestActivityAiFeedback();
            }
        } catch {
            setError('Unable to submit this activity. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        result,
        isSubmitting,
        error,
        submit,
        isSubmitted: result?.mastered ?? false,
        aiFeedback,
    };
}

export function ActivityFrame({
    activity,
    result,
    error,
    aiFeedback,
    children,
}: {
    activity: StudentActivity;
    result: SubmitResult | null;
    error?: string | null;
    aiFeedback?: ActivityAiFeedback | null;
    children: ReactNode;
}) {
    const header = (
        <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
                <Tag
                    value={activity.type.replace(/_/g, ' ')}
                    severity="info"
                    rounded
                />
                {result && <ResultBadge result={result} />}
            </div>
            <div>
                <h3 className="text-lg font-semibold">{activity.title}</h3>
                {activity.instruction && (
                    <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                        {activity.instruction}
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <Card
            title={header}
            className="student-prime-card border-sidebar-border/70 shadow-sm dark:border-sidebar-border"
        >
            <div className="flex w-full flex-col gap-4">
                <ReadActivityButton activity={activity} />
                {children}
                {error && <Message severity="error" text={error} />}
                {result && (
                    <Message
                        severity={
                            result.is_correct === null
                                ? 'info'
                                : result.is_correct
                                  ? 'success'
                                  : 'warn'
                        }
                        content={
                            <div className="grid gap-2 text-sm">
                                <p className="font-medium">
                                    {result.is_correct === null
                                        ? 'Submitted'
                                        : result.is_correct
                                          ? 'Correct'
                                          : 'Review this answer'}
                                </p>
                                {result.is_correct === false ? (
                                    aiFeedback?.isLoading ? (
                                        <p className="animate-pulse leading-6 opacity-60">
                                            Getting AI feedback for your
                                            answer...
                                        </p>
                                    ) : aiFeedback?.explanation ? (
                                        <p className="leading-6">
                                            {aiFeedback.explanation}
                                        </p>
                                    ) : aiFeedback?.error ? (
                                        <p className="leading-6 opacity-70">
                                            {aiFeedback.error}
                                        </p>
                                    ) : result.feedback ? (
                                        <p className="leading-6">
                                            {result.feedback}
                                        </p>
                                    ) : null
                                ) : (
                                    <>
                                        {result.feedback && (
                                            <p className="leading-6">
                                                {result.feedback}
                                            </p>
                                        )}
                                        {activity.explanation && (
                                            <p className="leading-6">
                                                {activity.explanation}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        }
                    />
                )}
            </div>
        </Card>
    );
}

export function ReadActivityButton({
    activity,
    label: visibleLabel = 'Read Aloud',
    className = '',
}: {
    activity: StudentActivity;
    label?: string;
    className?: string;
}) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const tokenRef = useRef(`activity-${activity.id}`);
    const text = useMemo(() => getActivitySpeechText(activity), [activity]);
    const isSupported =
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        'SpeechSynthesisUtterance' in window;

    useEffect(() => {
        const token = tokenRef.current;
        const handleSpeechStarted = (event: Event) => {
            const nextToken = (event as CustomEvent<string>).detail;

            if (nextToken !== token) {
                setIsSpeaking(false);
            }
        };

        window.addEventListener(
            activitySpeechStartedEvent,
            handleSpeechStarted,
        );

        return () => {
            window.removeEventListener(
                activitySpeechStartedEvent,
                handleSpeechStarted,
            );

            if (activeActivitySpeechToken === token) {
                window.speechSynthesis.cancel();
                activeActivitySpeechToken = null;
            }
        };
    }, []);

    if (!text) {
        return null;
    }

    const stop = () => {
        if (activeActivitySpeechToken === tokenRef.current) {
            activeActivitySpeechToken = null;
        }

        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const speak = () => {
        const token = tokenRef.current;
        const utterance = new SpeechSynthesisUtterance(text);

        window.speechSynthesis.cancel();
        activeActivitySpeechToken = token;
        window.dispatchEvent(
            new CustomEvent(activitySpeechStartedEvent, { detail: token }),
        );
        setIsSpeaking(true);

        utterance.onend = () => {
            if (activeActivitySpeechToken === token) {
                activeActivitySpeechToken = null;
                setIsSpeaking(false);
            }
        };
        utterance.onerror = utterance.onend;

        window.speechSynthesis.speak(utterance);
    };

    const label = isSpeaking ? 'Stop reading' : 'Read question and choices';
    const buttonLabel = isSpeaking ? 'Stop Reading' : visibleLabel;

    return (
        <Button
            type="button"
            icon={isSpeaking ? 'pi pi-stop-circle' : 'pi pi-volume-up'}
            label={buttonLabel}
            rounded
            outlined
            severity={isSpeaking ? 'danger' : 'secondary'}
            aria-label={label}
            title={
                isSupported
                    ? label
                    : 'Read aloud is not supported in this browser.'
            }
            onClick={isSpeaking ? stop : speak}
            disabled={!isSupported}
            className={`mx-auto w-fit shrink-0 ${className}`}
        />
    );
}

export function SubmitButton({
    disabled,
    isSubmitting,
    onClick,
}: {
    disabled?: boolean;
    isSubmitting: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            type="button"
            icon="pi pi-sparkles"
            label={isSubmitting ? 'Submitting...' : 'Submit Answer'}
            onClick={onClick}
            disabled={disabled || isSubmitting}
            loading={isSubmitting}
            className="mx-auto w-full justify-center sm:w-fit"
        />
    );
}

function ResultBadge({ result }: { result: SubmitResult }) {
    if (result.is_correct === null) {
        return <Tag value="Saved" severity="info" rounded />;
    }

    return (
        <Tag
            value={result.is_correct ? 'Correct' : 'Incorrect'}
            icon={
                result.is_correct
                    ? 'pi pi-check-circle'
                    : 'pi pi-exclamation-circle'
            }
            severity={result.is_correct ? 'success' : 'warning'}
            rounded
        />
    );
}
