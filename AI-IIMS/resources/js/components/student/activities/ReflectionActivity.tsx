import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';
import type { ActivityComponentProps } from './activity-utils';
import {
    ActivityFrame,
    activityQuestionClassName,
    SubmitButton,
    useActivitySubmission,
} from './activity-utils';

export function ReflectionActivity({
    activity,
    onSubmitted,
}: ActivityComponentProps) {
    const initialAnswer =
        typeof activity.submitted_answer === 'string'
            ? activity.submitted_answer
            : '';
    const [answer, setAnswer] = useState(initialAnswer);
    const [isReviewing, setIsReviewing] = useState(false);
    const { result, isSubmitting, error, submit, isSubmitted } =
        useActivitySubmission(activity, onSubmitted);
    const prompt =
        activity.payload.prompt ||
        activity.payload.question ||
        activity.instruction ||
        activity.title;

    return (
        <ActivityFrame activity={activity} result={result} error={error}>
            <p className={activityQuestionClassName}>{prompt}</p>
            {isReviewing && !isSubmitted ? (
                <>
                    <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm leading-6 whitespace-pre-wrap">
                        {answer}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Review your answer above. Submit when you're ready or go
                        back to edit.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <SubmitButton
                            isSubmitting={isSubmitting}
                            onClick={() => submit(answer)}
                        />
                        <button
                            type="button"
                            onClick={() => setIsReviewing(false)}
                            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                        >
                            Edit answer
                        </button>
                    </div>
                </>
            ) : (
                <div className="reflection-answer-panel grid w-full gap-4 self-stretch">
                    <InputTextarea
                        value={answer}
                        disabled={isSubmitted}
                        onChange={(event) => setAnswer(event.target.value)}
                        rows={10}
                        autoResize
                        className="reflection-answer-textarea min-h-[34vh] w-full text-lg leading-7"
                    />
                    <SubmitButton
                        disabled={answer.trim() === '' || isSubmitted}
                        isSubmitting={isSubmitting}
                        onClick={() => setIsReviewing(true)}
                    />
                </div>
            )}
        </ActivityFrame>
    );
}
