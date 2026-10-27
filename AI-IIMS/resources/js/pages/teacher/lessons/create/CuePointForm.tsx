import { useState } from 'react';

import type { CuePoint, CuePointType } from './types';
import {
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from './ui';

const cueTypes: Array<{ label: string; value: CuePointType }> = [
    { label: 'MCQ quiz', value: 'quiz_mcq' },
    { label: 'Open-ended', value: 'quiz_open' },
    { label: 'Pause + reflect', value: 'pause_reflect' },
    { label: 'Info pop-up', value: 'info' },
];

const blankOptions = ['', '', '', ''];

export function CuePointForm({
    cuePoint,
    initialTimestampSeconds = 0,
    onCancel,
    onSave,
}: {
    cuePoint?: CuePoint;
    initialTimestampSeconds?: number;
    onCancel: () => void;
    onSave: (cuePoint: Omit<CuePoint, 'id'>) => void;
}) {
    const [timestampSeconds, setTimestampSeconds] = useState(
        String(cuePoint?.timestamp_seconds ?? initialTimestampSeconds),
    );
    const [type, setType] = useState<CuePointType>(
        cuePoint?.type ?? 'quiz_mcq',
    );
    const [question, setQuestion] = useState(cuePoint?.question ?? '');
    const [options, setOptions] = useState(
        cuePoint?.options?.length ? cuePoint.options : blankOptions,
    );
    const [correctOption, setCorrectOption] = useState(
        cuePoint?.correct_option ?? '',
    );
    const [explanation, setExplanation] = useState(
        cuePoint?.explanation ?? '',
    );
    const [content, setContent] = useState(cuePoint?.content ?? '');

    const save = () => {
        onSave({
            timestamp_seconds: Number.parseInt(timestampSeconds, 10) || 0,
            type,
            question: type === 'info' ? null : question,
            options: type === 'quiz_mcq' ? options : [],
            correct_option: type === 'quiz_mcq' ? correctOption : null,
            explanation: type === 'quiz_mcq' ? explanation : null,
            content: type === 'info' ? content : null,
        });
        onCancel();
    };

    return (
        <div className="grid gap-4 rounded-lg border bg-muted/20 p-4">
            <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                <div className="grid gap-2">
                    <Label htmlFor="cue-timestamp">Timestamp</Label>
                    <Input
                        id="cue-timestamp"
                        inputMode="numeric"
                        min={0}
                        type="number"
                        value={timestampSeconds}
                        onChange={(event) =>
                            setTimestampSeconds(event.target.value)
                        }
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select
                        value={type}
                        onValueChange={(value) => setType(value as CuePointType)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select cue type" />
                        </SelectTrigger>
                        <SelectContent>
                            {cueTypes.map((cueType) => (
                                <SelectItem
                                    key={cueType.value}
                                    value={cueType.value}
                                >
                                    {cueType.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {type === 'info' ? (
                <div className="grid gap-2">
                    <Label htmlFor="cue-content">Info content</Label>
                    <Textarea
                        id="cue-content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                    />
                </div>
            ) : (
                <div className="grid gap-2">
                    <Label htmlFor="cue-question">Prompt</Label>
                    <Textarea
                        id="cue-question"
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                    />
                </div>
            )}

            {type === 'quiz_mcq' && (
                <div className="grid gap-3">
                    <Label>Options</Label>
                    {options.map((option, index) => (
                        <div
                            key={`cue-option-${index}`}
                            className="grid gap-2 sm:grid-cols-[1fr_160px]"
                        >
                            <Input
                                value={option}
                                onChange={(event) =>
                                    setOptions((current) =>
                                        current.map((item, optionIndex) =>
                                            optionIndex === index
                                                ? event.target.value
                                                : item,
                                        ),
                                    )
                                }
                            />
                            <Button
                                type="button"
                                variant={
                                    correctOption === option
                                        ? undefined
                                        : 'outline'
                                }
                                onClick={() => setCorrectOption(option)}
                            >
                                Correct
                            </Button>
                        </div>
                    ))}
                    <div className="grid gap-2">
                        <Label htmlFor="cue-explanation">Explanation</Label>
                        <Textarea
                            id="cue-explanation"
                            value={explanation}
                            onChange={(event) =>
                                setExplanation(event.target.value)
                            }
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="button" onClick={save}>
                    Save cue point
                </Button>
            </div>
        </div>
    );
}
