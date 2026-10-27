import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { VideoCuePoint } from './types';

export function QuizOverlay({
    cuePoint,
    onComplete,
}: {
    cuePoint: VideoCuePoint;
    onComplete: (answer: string) => void;
}) {
    if (cuePoint.type === 'quiz_open') {
        return <OpenQuizOverlay cuePoint={cuePoint} onComplete={onComplete} />;
    }

    return <McqQuizOverlay cuePoint={cuePoint} onComplete={onComplete} />;
}

function McqQuizOverlay({
    cuePoint,
    onComplete,
}: {
    cuePoint: VideoCuePoint;
    onComplete: (answer: string) => void;
}) {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="grid max-h-[90%] w-[min(92vw,38rem)] gap-4 overflow-y-auto rounded-lg bg-background p-5 shadow-xl">
            <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Quick check
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                    {cuePoint.question}
                </h3>
            </div>

            <div className="grid gap-2">
                {cuePoint.options.map((option) => {
                    const optionSelected = selected === option;

                    return (
                        <button
                            key={option}
                            type="button"
                            disabled={selected !== null}
                            onClick={() => setSelected(option)}
                            className={`flex min-h-12 items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default ${selected === null ? 'hover:border-primary' : optionSelected ? 'border-primary bg-primary/10' : 'opacity-55'}`}
                        >
                            <span>{option}</span>
                        </button>
                    );
                })}
            </div>

            {selected !== null && (
                <div className="grid gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
                    <p className="font-medium">Response ready to save.</p>
                    <Button type="button" onClick={() => onComplete(selected)}>
                        Continue watching
                    </Button>
                </div>
            )}
        </div>
    );
}

function OpenQuizOverlay({
    cuePoint,
    onComplete,
}: {
    cuePoint: VideoCuePoint;
    onComplete: (answer: string) => void;
}) {
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="grid w-[min(92vw,38rem)] gap-4 rounded-lg bg-background p-5 shadow-xl">
            <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Reflection check
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                    {cuePoint.question}
                </h3>
            </div>
            <Textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write your answer..."
                className="min-h-32"
                disabled={submitted}
            />
            {submitted ? (
                <div className="grid gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
                    <p className="font-medium">Response saved.</p>
                    <Button type="button" onClick={() => onComplete(answer)}>
                        Continue watching
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    disabled={answer.trim() === ''}
                    onClick={() => setSubmitted(true)}
                >
                    Submit
                </Button>
            )}
        </div>
    );
}
