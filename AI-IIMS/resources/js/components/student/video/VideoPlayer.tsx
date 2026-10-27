import { router } from '@inertiajs/react';
import {
    MediaControlBar,
    MediaController,
    MediaFullscreenButton,
    MediaMuteButton,
    MediaPlayButton,
    MediaPlaybackRateButton,
    MediaTimeDisplay,
    MediaTimeRange,
    MediaVolumeRange,
} from 'media-chrome/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactPlayer from 'react-player';

import { InfoPopup } from './InfoPopup';
import { PauseReflect } from './PauseReflect';
import { QuizOverlay } from './QuizOverlay';
import type { VideoCuePoint, VideoMedia } from './types';
import { useVideoProgress } from './useVideoProgress';

export function VideoPlayer({
    initialPositionSeconds,
    lessonId,
    media,
    onCompleted,
}: {
    initialPositionSeconds: number;
    lessonId: number;
    media: VideoMedia;
    onCompleted?: () => void;
}) {
    const wrapperRef = useRef<HTMLElement | null>(null);
    const playerRef = useRef<HTMLVideoElement | null>(null);
    const restoredPosition = useRef(false);
    const lastPlaybackSeconds = useRef(-1);
    const [playing, setPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
        null,
    );
    const [activeCuePoint, setActiveCuePoint] = useState<VideoCuePoint | null>(
        null,
    );
    const saveProgress = useVideoProgress({
        lessonId,
        mediaId: media.id,
        onCompleted,
    });
    const sortedCuePoints = useMemo(
        () =>
            [...media.cue_points].sort(
                (first, second) =>
                    first.timestamp_seconds - second.timestamp_seconds,
            ),
        [media.cue_points],
    );
    const setWrapperRef = useCallback((element: HTMLElement | null) => {
        wrapperRef.current = element;
        setWrapperElement(element);
    }, []);

    useEffect(() => {
        const syncFullscreenState = () => {
            const fullscreenElement = document.fullscreenElement;
            const wrapper = wrapperRef.current;

            if (
                fullscreenElement &&
                wrapper &&
                fullscreenElement !== wrapper &&
                wrapper.contains(fullscreenElement)
            ) {
                void document.exitFullscreen().then(() => {
                    void wrapper.requestFullscreen();
                });

                return;
            }

            setIsFullscreen(fullscreenElement === wrapper);
        };

        document.addEventListener('fullscreenchange', syncFullscreenState);

        return () => {
            document.removeEventListener(
                'fullscreenchange',
                syncFullscreenState,
            );
        };
    }, []);

    const restorePosition = () => {
        if (restoredPosition.current || initialPositionSeconds <= 0) {
            return;
        }

        restoredPosition.current = true;

        if (playerRef.current) {
            playerRef.current.currentTime = initialPositionSeconds;
            lastPlaybackSeconds.current = Math.floor(initialPositionSeconds);
        }
    };

    const maybePauseForCue = (seconds: number) => {
        const previousSeconds = lastPlaybackSeconds.current;
        const currentSeconds = Math.floor(seconds);
        const cuePoint = sortedCuePoints.find(
            (candidate) =>
                previousSeconds < candidate.timestamp_seconds &&
                candidate.timestamp_seconds <= currentSeconds,
        );

        lastPlaybackSeconds.current = currentSeconds;

        if (!cuePoint || activeCuePoint) {
            return;
        }

        setPlaying(false);
        playerRef.current?.pause();
        setActiveCuePoint(cuePoint);
    };

    const completeCuePoint = (answer: string) => {
        if (!activeCuePoint) {
            return;
        }

        router.post(
            `/student/cue-points/${activeCuePoint.id}/respond`,
            { answer },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setActiveCuePoint(null);
                    setPlaying(true);
                },
            },
        );
    };

    const overlayTarget =
        typeof document === 'undefined'
            ? null
            : isFullscreen
              ? wrapperElement
              : document.body;

    const cueOverlay =
        activeCuePoint && overlayTarget
            ? createPortal(
                  <div
                      className="fixed inset-0 z-[1000] flex animate-in items-center justify-center bg-black/70 p-4 duration-200 fade-in-0 motion-reduce:animate-none"
                      role="dialog"
                      aria-modal="true"
                  >
                      <div className="max-h-[calc(100vh-2rem)] animate-in overflow-y-auto duration-200 fade-in-0 zoom-in-95 slide-in-from-bottom-2 motion-reduce:animate-none">
                          {activeCuePoint.type === 'quiz_mcq' ||
                          activeCuePoint.type === 'quiz_open' ? (
                              <QuizOverlay
                                  cuePoint={activeCuePoint}
                                  onComplete={completeCuePoint}
                              />
                          ) : activeCuePoint.type === 'pause_reflect' ? (
                              <PauseReflect
                                  cuePoint={activeCuePoint}
                                  onComplete={completeCuePoint}
                              />
                          ) : (
                              <InfoPopup
                                  cuePoint={activeCuePoint}
                                  onComplete={completeCuePoint}
                              />
                          )}
                      </div>
                  </div>,
                  overlayTarget,
              )
            : null;

    return (
        <MediaController
            ref={setWrapperRef}
            className="student-video-player relative block aspect-video overflow-hidden rounded-lg border bg-black"
        >
            <ReactPlayer
                ref={playerRef}
                src={media.url}
                slot="media"
                controls={false}
                playing={playing}
                width="100%"
                height="100%"
                className="h-full w-full"
                onCanPlay={restorePosition}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(event) => {
                    const seconds = event.currentTarget.currentTime;

                    saveProgress(seconds);
                    maybePauseForCue(seconds);
                }}
                onEnded={(event) => {
                    saveProgress(event.currentTarget.currentTime, true);
                    setPlaying(false);
                }}
            />

            <MediaControlBar>
                <MediaPlayButton />
                <MediaTimeRange />
                <MediaTimeDisplay showDuration />
                <MediaMuteButton />
                <MediaVolumeRange />
                <MediaPlaybackRateButton />
                <MediaFullscreenButton />
            </MediaControlBar>

            {cueOverlay}
        </MediaController>
    );
}
