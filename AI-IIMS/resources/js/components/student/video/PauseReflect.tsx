import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { VideoCuePoint } from './types';

export function PauseReflect({
    cuePoint,
    onComplete,
}: {
    cuePoint: VideoCuePoint;
    onComplete: (answer: string) => void;
}) {
    const [answer, setAnswer] = useState('');

    return (
        <div className="grid w-[min(92vw,38rem)] gap-4 rounded-lg bg-background p-5 shadow-xl">
            <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Pause and reflect
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                    {cuePoint.question}
                </h3>
            </div>
            <Textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write your reflection..."
                className="min-h-32"
            />
            <Button
                type="button"
                disabled={answer.trim() === ''}
                onClick={() => onComplete(answer)}
            >
                Continue watching
            </Button>
        </div>
    );
}
