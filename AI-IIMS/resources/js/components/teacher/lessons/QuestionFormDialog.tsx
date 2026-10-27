import { Button as PrimeButton } from 'primereact/button';
import { Dialog as PrimeDialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import type { FormEvent } from 'react';

import type {
    AnswerKey,
    Lesson,
    LessonQuestion,
    QuestionFormData,
} from './types';

type QuestionFormErrors = Partial<Record<keyof QuestionFormData, string>>;

type QuestionFormDialogProps = {
    data: QuestionFormData;
    editingQuestion: LessonQuestion | null;
    errors: QuestionFormErrors;
    lessons: Lesson[];
    open: boolean;
    processing: boolean;
    onOpenChange: (open: boolean) => void;
    onSetData: <K extends keyof QuestionFormData>(
        key: K,
        value: QuestionFormData[K],
    ) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function QuestionFormDialog({
    data,
    editingQuestion,
    errors,
    lessons,
    open,
    processing,
    onOpenChange,
    onSetData,
    onSubmit,
}: QuestionFormDialogProps) {
    return (
        <PrimeDialog
            className="w-[min(92vw,48rem)]"
            modal
            visible={open}
            onHide={() => onOpenChange(false)}
        >
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    {editingQuestion ? 'Edit Quiz Item' : 'Add Quiz Item'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Quiz items are attached to a lesson.
                </p>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <label htmlFor="lesson_id" className="text-sm font-medium">
                        Lesson
                    </label>
                    <Dropdown
                        inputId="lesson_id"
                        className="w-full"
                        value={data.lesson_id || null}
                        options={lessons.map((lesson) => ({
                            label: lesson.title,
                            value: lesson.id.toString(),
                        }))}
                        placeholder="Select lesson"
                        onChange={(event: DropdownChangeEvent) =>
                            onSetData('lesson_id', String(event.value))
                        }
                    />
                    {errors.lesson_id && (
                        <p className="text-xs text-destructive">
                            {errors.lesson_id}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <label
                        htmlFor="question_text"
                        className="text-sm font-medium"
                    >
                        Quiz Item
                    </label>
                    <InputTextarea
                        id="question_text"
                        autoResize
                        className="w-full"
                        value={data.question_text}
                        onChange={(event) =>
                            onSetData('question_text', event.target.value)
                        }
                        aria-invalid={Boolean(errors.question_text)}
                    />
                    {errors.question_text && (
                        <p className="text-xs text-destructive">
                            {errors.question_text}
                        </p>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {(['a', 'b', 'c', 'd'] as const).map((key) => {
                        const field = `option_${key}` as const;

                        return (
                            <div key={field} className="grid gap-2">
                                <label
                                    htmlFor={field}
                                    className="text-sm font-medium"
                                >
                                    Option {key.toUpperCase()}
                                </label>
                                <InputText
                                    id={field}
                                    className="w-full"
                                    value={data[field]}
                                    onChange={(event) =>
                                        onSetData(field, event.target.value)
                                    }
                                    aria-invalid={Boolean(errors[field])}
                                />
                                {errors[field] && (
                                    <p className="text-xs text-destructive">
                                        {errors[field]}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-2">
                    <label
                        htmlFor="correct_answer"
                        className="text-sm font-medium"
                    >
                        Correct Answer
                    </label>
                    <Dropdown
                        inputId="correct_answer"
                        className="w-full"
                        value={data.correct_answer}
                        options={['A', 'B', 'C', 'D'].map((answer) => ({
                            label: answer,
                            value: answer,
                        }))}
                        placeholder="Select answer"
                        onChange={(event: DropdownChangeEvent) =>
                            onSetData(
                                'correct_answer',
                                String(event.value) as AnswerKey,
                            )
                        }
                    />
                    {errors.correct_answer && (
                        <p className="text-xs text-destructive">
                            {errors.correct_answer}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <label
                        htmlFor="explanation"
                        className="text-sm font-medium"
                    >
                        Explanation
                    </label>
                    <InputTextarea
                        id="explanation"
                        autoResize
                        className="w-full"
                        value={data.explanation}
                        onChange={(event) =>
                            onSetData('explanation', event.target.value)
                        }
                        aria-invalid={Boolean(errors.explanation)}
                    />
                    {errors.explanation && (
                        <p className="text-xs text-destructive">
                            {errors.explanation}
                        </p>
                    )}
                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-2">
                    <PrimeButton
                        type="button"
                        outlined
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </PrimeButton>
                    <PrimeButton
                        type="submit"
                        disabled={processing || lessons.length === 0}
                    >
                        {editingQuestion ? 'Save Changes' : 'Create'}
                    </PrimeButton>
                </div>
            </form>
        </PrimeDialog>
    );
}
