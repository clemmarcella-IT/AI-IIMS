import { useState } from 'react';

import {
    ActivityFrame,
    activityQuestionClassName,
    SubmitButton,
    useActivitySubmission,
} from './activity-utils';
import type { ActivityComponentProps } from './activity-utils';

export function MiniQuizActivity({
    activity,
    onSubmitted,
}: ActivityComponentProps) {
    const initialAnswer =
        typeof activity.submitted_answer === 'string'
            ? activity.submitted_answer
            : '';
    const [selectedAnswer, setSelectedAnswer] = useState(initialAnswer);
    const { result, isSubmitting, error, submit, isSubmitted, aiFeedback } =
        useActivitySubmission(activity, onSubmitted);
    const choices = activity.payload.choices ?? [];
    const correctAnswer =
        result?.is_correct === false &&
        typeof result.correct_answer === 'string'
            ? result.correct_answer
            : null;

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
            <div className="grid gap-3 sm:grid-cols-2">
                {choices.map((choice: string) => (
                    <button
                        key={choice}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => setSelectedAnswer(choice)}
                        className="student-choice min-h-16 rounded-xl border px-5 py-4 text-center text-base font-semibold transition-colors"
                        data-selected={selectedAnswer === choice}
                        data-correct={
                            correctAnswer === choice ? true : undefined
                        }
                        data-incorrect={
                            result?.is_correct === false &&
                            selectedAnswer === choice &&
                            correctAnswer !== choice
                                ? true
                                : undefined
                        }
                    >
                        {choice}
                        {correctAnswer === choice && (
                            <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                ✓
                            </span>
                        )}
                    </button>
                ))}
            </div>
            <SubmitButton
                disabled={!selectedAnswer || isSubmitted}
                isSubmitting={isSubmitting}
                onClick={() =>
                    submit(selectedAnswer, {
                        question: activity.payload.question ?? activity.title,
                        studentAnswer: selectedAnswer,
                    })
                }
            />
        </ActivityFrame>
    );
}
