import { FileText, Lightbulb, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { DataEmptyState } from './DataEmptyState';
import { LessonsTable } from './LessonsTable';
import type { Lesson } from './types';

type LessonsPanelProps = {
    lessons: Lesson[];
    sourceLessons: Lesson[];
    onBatchDeleteLessons: (lessons: Lesson[]) => void;
    onBatchRepublishLessons: (lessons: Lesson[]) => void;
    onCreateLesson: () => void;
    onDeleteLesson: (lesson: Lesson) => void;
    onDuplicateLesson: (lesson: Lesson) => void;
    onEditLesson: (lesson: Lesson) => void;
    onViewLesson: (lesson: Lesson) => void;
};

export function LessonsPanel({
    lessons,
    sourceLessons,
    onBatchDeleteLessons,
    onBatchRepublishLessons,
    onCreateLesson,
    onDeleteLesson,
    onDuplicateLesson,
    onEditLesson,
    onViewLesson,
}: LessonsPanelProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                    <Lightbulb className="size-5" aria-hidden="true" />
                </span>
                <div>
                    <h3 className="font-medium">AI lesson suggestions</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Future AI suggestions will help identify topics,
                        examples, questions, and support materials to include in
                        lessons.
                    </p>
                </div>
            </div>
            {sourceLessons.length === 0 ? (
                <DataEmptyState
                    icon={FileText}
                    title="No lessons yet"
                    description="Create your first instructional material to get started."
                    action={
                        <Button type="button" onClick={onCreateLesson}>
                            <Plus className="size-4" aria-hidden="true" />
                            Create Lesson
                        </Button>
                    }
                />
            ) : (
                <LessonsTable
                    lessons={lessons}
                    onBatchDeleteLessons={onBatchDeleteLessons}
                    onBatchRepublishLessons={onBatchRepublishLessons}
                    onDeleteLesson={onDeleteLesson}
                    onDuplicateLesson={onDuplicateLesson}
                    onEditLesson={onEditLesson}
                    onViewLesson={onViewLesson}
                />
            )}
        </div>
    );
}
