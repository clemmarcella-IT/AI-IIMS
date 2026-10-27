import { Dialog as PrimeDialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';

import { difficultyClassNames, statusClassNames } from './constants';
import type { Lesson } from './types';
import { formatDate, formatDifficulty } from './utils';

type LessonPreviewDialogProps = {
    lesson: Lesson | null;
    onOpenChange: (open: boolean) => void;
};

export function LessonPreviewDialog({
    lesson,
    onOpenChange,
}: LessonPreviewDialogProps) {
    return (
        <PrimeDialog
            className="w-[min(92vw,48rem)]"
            modal
            visible={Boolean(lesson)}
            onHide={() => onOpenChange(false)}
        >
            <div className="mb-4">
                <h2 className="text-lg font-semibold">{lesson?.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {lesson?.subject ?? 'N/A'} / {lesson?.topic ?? 'N/A'}
                </p>
            </div>

            {lesson && (
                <div className="grid gap-4">
                    <div className="flex flex-wrap gap-2">
                        <Tag
                            className={
                                difficultyClassNames[lesson.difficulty_level]
                            }
                            value={formatDifficulty(lesson.difficulty_level)}
                        />
                        <Tag
                            className={
                                lesson.is_published
                                    ? statusClassNames.published
                                    : statusClassNames.draft
                            }
                            value={lesson.is_published ? 'Published' : 'Draft'}
                        />
                    </div>

                    <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 whitespace-pre-wrap">
                        {lesson.content ||
                            'No lesson content has been added yet.'}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Last updated {formatDate(lesson.updated_at)}
                    </p>
                </div>
            )}
        </PrimeDialog>
    );
}
