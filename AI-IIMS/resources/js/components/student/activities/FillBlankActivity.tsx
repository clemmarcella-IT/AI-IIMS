import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

import {
    ActivityFrame,
    activityQuestionClassName,
    SubmitButton,
    useActivitySubmission,
} from './activity-utils';
import type { ActivityComponentProps } from './activity-utils';

export function FillBlankActivity({
    activity,
    onSubmitted,
}: ActivityComponentProps) {
    const initialAnswer =
        typeof activity.submitted_answer === 'string'
            ? activity.submitted_answer
            : '';
    const [answer, setAnswer] = useState(initialAnswer);
    const { result, isSubmitting, error, submit, isSubmitted, aiFeedback } =
        useActivitySubmission(activity, onSubmitted);

    return (
        <ActivityFrame
            activity={activity}
            result={result}
            error={error}
            aiFeedback={aiFeedback}
        >
            <p className={activityQuestionClassName}>
                {activity.payload.sentence}
            </p>
            <div className="mx-auto grid w-full max-w-2xl gap-2">
                <label
                    htmlFor={`fill-blank-${activity.id}`}
                    className="text-base font-medium"
                >
                    {activity.payload.blank_label ?? 'Answer'}
                </label>
                <InputText
                    id={`fill-blank-${activity.id}`}
                    value={answer}
                    disabled={isSubmitted}
                    onChange={(event) => setAnswer(event.target.value)}
                    className={`w-full text-lg ${
                        result?.is_correct === false
                            ? 'border-red-500 bg-red-50 text-red-950 dark:border-red-400 dark:bg-red-950/30 dark:text-red-100'
                            : ''
                    }`}
                />
            </div>
            {result &&
                !result.is_correct &&
                result.correct_answer !== undefined &&
                result.correct_answer !== null && (
                    <p className="text-sm text-muted-foreground">
                        Correct answer:{' '}
                        <span className="font-medium text-foreground">
                            {String(result.correct_answer)}
                        </span>
                    </p>
                )}
            <SubmitButton
                disabled={answer.trim() === '' || isSubmitted}
                isSubmitting={isSubmitting}
                onClick={() =>
                    submit(answer, {
                        question: activity.payload.sentence ?? activity.title,
                        studentAnswer: answer,
                    })
                }
            />
        </ActivityFrame>
    );
}
