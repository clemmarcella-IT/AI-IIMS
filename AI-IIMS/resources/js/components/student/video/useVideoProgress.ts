import { router } from '@inertiajs/react';
import { useCallback, useRef } from 'react';

export function useVideoProgress({
    lessonId,
    mediaId,
    onCompleted,
}: {
    lessonId: number;
    mediaId: number;
    onCompleted?: () => void;
}) {
    const lastSavedAt = useRef(0);

    return useCallback(
        (positionSeconds: number, completed = false) => {
            const now = Date.now();

            if (!completed && now - lastSavedAt.current < 10000) {
                return;
            }

            lastSavedAt.current = now;

            router.post(
                '/student/video-progress',
                {
                    lesson_id: lessonId,
                    media_id: mediaId,
                    position_seconds: Math.max(0, Math.floor(positionSeconds)),
                    completed,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        if (completed) {
                            onCompleted?.();
                        }
                    },
                },
            );
        },
        [lessonId, mediaId, onCompleted],
    );
}
