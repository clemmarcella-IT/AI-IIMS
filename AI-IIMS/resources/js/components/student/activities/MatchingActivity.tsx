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

type SortableMatch = {
    id: string;
    value: string;
};

function rotateArray<T>(arr: T[], seed: number): T[] {
    if (arr.length === 0) {
        return arr;
    }

    const offset = seed % arr.length;

    return [...arr.slice(offset), ...arr.slice(0, offset)];
}

export function MatchingActivity({
    activity,
    onSubmitted,
}: ActivityComponentProps) {
    const pairs = useMemo(
        () => activity.payload.pairs ?? [],
        [activity.payload.pairs],
    );
    const seed = typeof activity.id === 'number' ? activity.id : 0;
    const shuffledRightValues = useMemo(
        () =>
            rotateArray(
                pairs.map((p) => p.right),
                seed + 1,
            ),
        [pairs, seed],
    );
    const initialRightValues = Array.isArray(activity.submitted_answer)
        ? activity.submitted_answer.map((pair) =>
              typeof pair === 'object' && pair !== null && 'right' in pair
                  ? String(pair.right)
                  : '',
          )
        : shuffledRightValues;
    const [matches, setMatches] = useState<SortableMatch[]>(
        initialRightValues.map((value, index) => ({
            id: `match-${index}-${value}`,
            value,
        })),
    );
    const { result, isSubmitting, error, submit, isSubmitted, aiFeedback } =
        useActivitySubmission(activity, onSubmitted);
    const matchIds = useMemo(() => matches.map((match) => match.id), [matches]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id || isSubmitted) {
            return;
        }

        setMatches((current) => {
            const oldIndex = current.findIndex((item) => item.id === active.id);
            const newIndex = current.findIndex((item) => item.id === over.id);

            return arrayMove(current, oldIndex, newIndex);
        });
    };

    const answer = pairs.map((pair, index) => ({
        left: pair.left,
        right: matches[index]?.value ?? '',
    }));

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
            <p className="text-center text-base text-muted-foreground">
                Drag items in the right column to match each item on the left.
            </p>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
                <div className="grid gap-2">
                    {pairs.map((pair, index) => (
                        <div
                            key={pair.left}
                            className="flex min-h-14 items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3 text-base font-medium"
                        >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                {index + 1}
                            </span>
                            {pair.left}
                        </div>
                    ))}
                </div>
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={matchIds}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid gap-2">
                            {matches.map((match) => (
                                <SortableMatchCard
                                    key={match.id}
                                    match={match}
                                    disabled={isSubmitted}
                                    incorrect={result?.is_correct === false}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            <SubmitButton
                disabled={pairs.length === 0 || isSubmitted}
                isSubmitting={isSubmitting}
                onClick={() =>
                    submit(answer, {
                        question: activity.title,
                        studentAnswer: answer
                            .map((p) => `${p.left} → ${p.right}`)
                            .join(', '),
                    })
                }
            />
        </ActivityFrame>
    );
}

function SortableMatchCard({
    match,
    disabled,
    incorrect,
}: {
    match: SortableMatch;
    disabled: boolean;
    incorrect: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: match.id, disabled });

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
            <GripVertical
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
            />
            {match.value}
        </button>
    );
}
