import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactPlayer from 'react-player';

import { CuePointForm } from './CuePointForm';
import type { CuePoint, CuePointType } from './types';
import { Badge, Button } from './ui';

const typeLabels: Record<CuePointType, string> = {
    quiz_mcq: 'MCQ',
    quiz_open: 'Open',
    pause_reflect: 'Reflect',
    info: 'Info',
};

const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const previewFor = (cuePoint: CuePoint) =>
    cuePoint.question?.trim() ||
    cuePoint.content?.trim() ||
    'Untitled cue point';

const createCuePointId = () =>
    `cue-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function CueTimeline({
    cuePoints,
    mediaUrl,
    onChange,
}: {
    cuePoints: CuePoint[];
    mediaUrl: string;
    onChange: (cuePoints: CuePoint[]) => void;
}) {
    const [editingCuePoint, setEditingCuePoint] = useState<CuePoint | null>(
        null,
    );
    const [adding, setAdding] = useState(false);
    const [initialTimestampSeconds, setInitialTimestampSeconds] = useState(0);
    const [currentTimestampSeconds, setCurrentTimestampSeconds] = useState(0);
    const sortedCuePoints = useMemo(
        () =>
            [...cuePoints].sort(
                (first, second) =>
                    first.timestamp_seconds - second.timestamp_seconds,
            ),
        [cuePoints],
    );

    const addCuePointAt = (seconds: number) => {
        setEditingCuePoint(null);
        setInitialTimestampSeconds(seconds);
        setAdding(true);
    };

    const deleteCuePoint = (cuePoint: CuePoint) => {
        if (!window.confirm('Delete this cue point?')) {
            return;
        }

        onChange(cuePoints.filter((item) => item.id !== cuePoint.id));
    };

    const saveCuePoint = (payload: Omit<CuePoint, 'id'>) => {
        if (editingCuePoint) {
            onChange(
                cuePoints.map((cuePoint) =>
                    cuePoint.id === editingCuePoint.id
                        ? { ...payload, id: cuePoint.id }
                        : cuePoint,
                ),
            );

            return;
        }

        onChange([...cuePoints, { ...payload, id: createCuePointId() }]);
    };

    return (
        <div className="grid gap-3 rounded-lg border bg-background p-3">
            {mediaUrl ? (
                <div className="grid gap-3">
                    <div className="overflow-hidden rounded-lg border bg-black">
                        <ReactPlayer
                            src={mediaUrl}
                            controls
                            width="100%"
                            height="100%"
                            className="aspect-video"
                            onTimeUpdate={(event) =>
                                setCurrentTimestampSeconds(
                                    Math.floor(event.currentTarget.currentTime),
                                )
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={() =>
                                addCuePointAt(currentTimestampSeconds)
                            }
                            className="w-fit rounded-md bg-muted px-3 py-2 text-sm font-semibold tabular-nums transition-colors hover:bg-muted/80"
                        >
                            {formatTimestamp(currentTimestampSeconds)}
                        </button>
                        <p className="text-sm text-muted-foreground">
                            Cue points are saved with Save Draft or Publish.
                        </p>
                    </div>
                </div>
            ) : (
                <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                    Add a video URL or upload a video to preview it.
                </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium">Cue points</p>
                    <p className="text-xs text-muted-foreground">
                        Pause playback for checks, reflections, or notes.
                    </p>
                </div>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!mediaUrl}
                    onClick={() => {
                        addCuePointAt(currentTimestampSeconds);
                    }}
                >
                    <Plus className="size-4" aria-hidden="true" />
                    Add cue point
                </Button>
            </div>

            {adding && (
                <CuePointForm
                    initialTimestampSeconds={initialTimestampSeconds}
                    onCancel={() => setAdding(false)}
                    onSave={saveCuePoint}
                />
            )}

            {editingCuePoint && (
                <CuePointForm
                    cuePoint={editingCuePoint}
                    onCancel={() => setEditingCuePoint(null)}
                    onSave={saveCuePoint}
                />
            )}

            {sortedCuePoints.length === 0 ? (
                <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                    No cue points yet.
                </p>
            ) : (
                <div className="grid gap-2">
                    {sortedCuePoints.map((cuePoint) => (
                        <div
                            key={cuePoint.id}
                            className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[72px_88px_1fr_auto]"
                        >
                            <span className="h-fit rounded-md bg-muted px-2 py-1 text-center text-xs font-semibold tabular-nums">
                                {formatTimestamp(
                                    cuePoint.timestamp_seconds,
                                )}
                            </span>
                            <Badge>{typeLabels[cuePoint.type]}</Badge>
                            <p className="min-w-0 text-sm leading-6 break-words">
                                {previewFor(cuePoint)}
                            </p>
                            <div className="flex gap-2 sm:justify-end">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    aria-label="Edit cue point"
                                    onClick={() => {
                                        setAdding(false);
                                        setEditingCuePoint(cuePoint);
                                    }}
                                >
                                    <Pencil
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    aria-label="Delete cue point"
                                    onClick={() => deleteCuePoint(cuePoint)}
                                >
                                    <Trash2
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
