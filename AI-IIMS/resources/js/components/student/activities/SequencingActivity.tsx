import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
    ActivityFrame,
    activityQuestionClassName,
    SubmitButton,
    useActivitySubmission,
} from './activity-utils';
import type { ActivityComponentProps } from './activity-utils';

type SortableStep = {
    id: string;
    value: string;
};

export function SequencingActivity({
    activity,
    onSubmitted,
}: ActivityComponentProps) {
    const items = activity.payload.items ?? [];
    const initialItems = Array.isArray(activity.submitted_answer)
        ? activity.submitted_answer.map(String)
        : [...items].reverse();
    const [steps, setSteps] = useState<SortableStep[]>(
        initialItems.map((value, index) => ({
            id: `step-${index}-${value}`,
            value,
        })),
    );
    const { result, isSubmitting, error, submit, isSubmitted, aiFeedback } =
        useActivitySubmission(activity, onSubmitted);
    const stepIds = useMemo(() => steps.map((step) => step.id), [steps]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id || isSubmitted) {
            return;
        }

        setSteps((current) => {
            const oldIndex = current.findIndex((item) => item.id === active.id);
            const newIndex = current.findIndex((item) => item.id === over.id);

            return arrayMove(current, oldIndex, newIndex);
        });
    };

    const answer = steps.map((step) => step.value);

    return (
        <ActivityFrame
            activity={activity}
            result={result}
            error={error}
            aiFeedback={aiFeedback}
        >
            <p
                className={`${activityQuestionClassName} section-activity-dialog-prompt hidden`}
            >
                {activity.title}
            </p>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={stepIds}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="grid gap-2">
                        {steps.map((step, index) => (
                            <SortableStepCard
                                key={step.id}
                                step={step}
                                index={index}
                                disabled={isSubmitted}
                                incorrect={result?.is_correct === false}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <SubmitButton
                disabled={steps.length === 0 || isSubmitted}
                isSubmitting={isSubmitting}
                onClick={() =>
                    submit(answer, {
                        question: activity.title,
                        studentAnswer: answer.join(' → '),
                    })
                }
            />
        </ActivityFrame>
    );
}

function SortableStepCard({
    step,
    index,
    disabled,
    incorrect,
}: {
    step: SortableStep;
    index: number;
    disabled: boolean;
    incorrect: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: step.id, disabled });

    return (
        <button
            ref={setNodeRef}
            type="button"
            className="student-choice flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-left text-base font-medium shadow-xs"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            data-incorrect={incorrect ? true : undefined}
            {...attributes}
            {...listeners}
        >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {index + 1}
            </span>
            <GripVertical
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
            />
            {step.value}
        </button>
    );
}
