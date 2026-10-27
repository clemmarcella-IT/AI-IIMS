import { Button } from '@/components/ui/button';

import type { VideoCuePoint } from './types';

export function InfoPopup({
    cuePoint,
    onComplete,
}: {
    cuePoint: VideoCuePoint;
    onComplete: (answer: string) => void;
}) {
    return (
        <div className="grid w-[min(92vw,34rem)] gap-4 rounded-lg bg-background p-5 shadow-xl">
            <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Note
                </p>
                <div className="mt-2 text-sm leading-6 whitespace-pre-wrap">
                    {cuePoint.content}
                </div>
            </div>
            <Button type="button" onClick={() => onComplete('acknowledged')}>
                Continue watching
            </Button>
        </div>
    );
}
