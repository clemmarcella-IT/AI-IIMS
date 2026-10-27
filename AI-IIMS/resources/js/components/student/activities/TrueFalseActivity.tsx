import { RadioButton } from 'primereact/radiobutton';
import { useState } from 'react';

import {
    ActivityFrame,
    activityQuestionClassName,
    SubmitButton,
    useActivitySubmission,
} from './activity-utils';
import type { ActivityComponentProps } from './activity-utils';

export function TrueFalseActivity({
    activity,
    onSubmitted,
}: ActivityComponentProps) {
    const initialAnswer =
        typeof activity.submitted_answer === 'boolean'
            ? String(activity.submitted_answer)
            : '';
    const [answer, setAnswer] = useState(initialAnswer);
    const { result, isSubmitting, error, submit, isSubmitted, aiFeedback } =
        useActivitySubmission(activity, onSubmitted);

    const correctAnswer =
        result?.is_correct === false && result.correct_answer !== undefined
            ? String(result.correct_answer)
            : null;

    return (
        <ActivityFrame
            activity={activity}
            result={result}
            error={error}
            aiFeedback={aiFeedback}
        >
            <p className={activityQuestionClassName}>
                {activity.payload.statement}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
                {['true', 'false'].map((value) => (
                    <label
                        key={value}
                        htmlFor={`true-false-${activity.id}-${value}`}
                        className="student-choice flex min-h-16 cursor-pointer items-center justify-center gap-3 rounded-xl px-5 py-4 text-lg font-semibold capitalize"
                        data-selected={answer === value}
                        data-correct={
                            correctAnswer === value ? true : undefined
                        }
                        data-incorrect={
                            result?.is_correct === false &&
                            answer === value &&
                            correctAnswer !== value
                                ? true
                                : undefined
                        }
                    >
                        <RadioButton
                            inputId={`true-false-${activity.id}-${value}`}
                            value={value}
                            checked={answer === value}
                            disabled={isSubmitted}
                            onChange={(event) => setAnswer(String(event.value))}
                        />
                        {value}
                        {correctAnswer === value && (
                            <span className="ml-auto text-xs font-semibold text-green-600 dark:text-green-400">
                                Correct answer
                            </span>
                        )}
                    </label>
                ))}
            </div>
            <SubmitButton
                disabled={!answer || isSubmitted}
                isSubmitting={isSubmitting}
                onClick={() =>
                    submit(answer === 'true', {
                        question: activity.payload.statement ?? activity.title,
                        studentAnswer: answer,
                    })
                }
            />
        </ActivityFrame>
    );
}
