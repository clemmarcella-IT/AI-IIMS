import { Checkbox } from 'primereact/checkbox';
import { useState } from 'react';

import {
    ActivityFrame,
    activityQuestionClassName,
    SubmitButton,
    useActivitySubmission,
} from './activity-utils';
import type { ActivityComponentProps } from './activity-utils';

export function ClickableCardsActivity({
    activity,
    onSubmitted,
}: ActivityComponentProps) {
    const initialLabels = Array.isArray(activity.submitted_answer)
        ? activity.submitted_answer.map(String)
        : [];
    const [selectedLabels, setSelectedLabels] =
        useState<string[]>(initialLabels);
    const { result, isSubmitting, error, submit, isSubmitted, aiFeedback } =
        useActivitySubmission(activity, onSubmitted);
    const cards = activity.payload.cards ?? [];
    const correctLabels =
        result?.is_correct === false && Array.isArray(result.correct_answer)
            ? (result.correct_answer as unknown[]).map(String)
            : null;

    const toggleCard = (label: string) => {
        setSelectedLabels((current) =>
            current.includes(label)
                ? current.filter((item) => item !== label)
                : [...current, label],
        );
    };

    return (
        <ActivityFrame
            activity={activity}
            result={result}
            error={error}
            aiFeedback={aiFeedback}
        >
            <p className={activityQuestionClassName}>
                {activity.payload.question}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => {
                    const isSelected = selectedLabels.includes(card.label);
                    const isCorrect =
                        correctLabels?.includes(card.label) ?? false;
                    const inputId = `clickable-card-${activity.id}-${card.label}`;

                    return (
                        <label
                            key={card.label}
                            htmlFor={inputId}
                            className="student-choice min-h-36 cursor-pointer rounded-xl p-5 text-left"
                            data-selected={isSelected}
                            data-correct={isCorrect ? true : undefined}
                            data-incorrect={
                                result?.is_correct === false &&
                                isSelected &&
                                !isCorrect
                                    ? true
                                    : undefined
                            }
                        >
                            <span className="flex items-center justify-between gap-3 text-base font-semibold">
                                {card.label}
                                <Checkbox
                                    inputId={inputId}
                                    checked={isSelected}
                                    disabled={isSubmitted}
                                    onChange={() => toggleCard(card.label)}
                                />
                            </span>
                            <span className="mt-3 block text-base leading-7 text-muted-foreground">
                                {card.description}
                            </span>
                            {isCorrect && (
                                <span className="mt-2 block text-xs font-semibold text-green-600 dark:text-green-400">
                                    Correct answer
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>
            <SubmitButton
                disabled={selectedLabels.length === 0 || isSubmitted}
                isSubmitting={isSubmitting}
                onClick={() =>
                    submit(selectedLabels, {
                        question: activity.payload.question ?? activity.title,
                        studentAnswer: selectedLabels.join(', '),
                    })
                }
            />
        </ActivityFrame>
    );
}
