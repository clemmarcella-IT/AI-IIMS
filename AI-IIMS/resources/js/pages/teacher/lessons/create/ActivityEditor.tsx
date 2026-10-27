import { Copy, Plus, Trash2 } from 'lucide-react';

import {
    activityLabels,
    buildActivity,
    normalizeCards,
    normalizeChoices,
    normalizeItems,
    normalizePairs,
} from './helpers';
import type {
    ActivityType,
    ClickableCard,
    LessonActivity,
    MatchingPair,
} from './types';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from './ui';

function ExplanationField({
    activity,
    onChange,
}: {
    activity: LessonActivity;
    onChange: (patch: Partial<Omit<LessonActivity, 'id'>>) => void;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={`${activity.id}-explanation`}>Explanation</Label>
            <Textarea
                id={`${activity.id}-explanation`}
                value={activity.explanation ?? ''}
                onChange={(event) =>
                    onChange({ explanation: event.target.value })
                }
            />
        </div>
    );
}

export function ActivityEditor({
    activity,
    index,
    onChange,
    onChoiceChange,
    onPairChange,
    onAddPair,
    onRemovePair,
    onItemChange,
    onAddItem,
    onRemoveItem,
    onCardChange,
    onAddCard,
    onRemoveCard,
    onDuplicate,
    onRemove,
}: {
    activity: LessonActivity;
    index: number;
    onChange: (patch: Partial<Omit<LessonActivity, 'id'>>) => void;
    onChoiceChange: (choiceIndex: number, value: string) => void;
    onPairChange: (
        pairIndex: number,
        field: keyof MatchingPair,
        value: string,
    ) => void;
    onAddPair: () => void;
    onRemovePair: (pairIndex: number) => void;
    onItemChange: (itemIndex: number, value: string) => void;
    onAddItem: () => void;
    onRemoveItem: (itemIndex: number) => void;
    onCardChange: (cardIndex: number, patch: Partial<ClickableCard>) => void;
    onAddCard: () => void;
    onRemoveCard: (cardIndex: number) => void;
    onDuplicate: () => void;
    onRemove: () => void;
}) {
    const resetForType = (nextType: ActivityType) => {
        const next = buildActivity(nextType, {
            title: activity.title,
            instruction: activity.instruction,
        });

        onChange({
            type: next.type,
            title: next.title,
            instruction: next.instruction,
            question: next.question,
            statement: next.statement,
            sentence: next.sentence,
            blank_label: next.blank_label,
            prompt: next.prompt,
            choices: next.choices,
            pairs: next.pairs,
            items: next.items,
            cards: next.cards,
            correct_answer: next.correct_answer,
            explanation: next.explanation,
            record_score: next.record_score,
        });
    };

    return (
        <Card className="border-sidebar-border/70 p-4 shadow-none dark:border-sidebar-border">
            <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle className="text-base">
                        Activity {index + 1}
                    </CardTitle>
                    <CardDescription>
                        {activityLabels[activity.type]}
                    </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onDuplicate}
                    >
                        <Copy className="size-4" aria-hidden="true" />
                        Duplicate
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRemove}
                        aria-label="Remove activity"
                        severity="danger"
                        className="shrink-0"
                        icon={<Trash2 className="size-4" aria-hidden="true" />}
                        label="Remove"
                    />
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                    <div className="grid gap-2">
                        <Label>Activity type</Label>
                        <Select
                            value={activity.type}
                            onValueChange={(value) =>
                                resetForType(value as ActivityType)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mini_quiz">
                                    Mini Quiz
                                </SelectItem>
                                <SelectItem value="true_false">
                                    True or False
                                </SelectItem>
                                <SelectItem value="fill_blank">
                                    Fill in the Blank
                                </SelectItem>
                                <SelectItem value="matching">
                                    Drag-and-Drop Matching
                                </SelectItem>
                                <SelectItem value="sequencing">
                                    Sequencing
                                </SelectItem>
                                <SelectItem value="reflection">
                                    Reflection Question
                                </SelectItem>
                                <SelectItem value="clickable_activity">
                                    Clickable Cards
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`${activity.id}-title`}>Title</Label>
                        <Input
                            id={`${activity.id}-title`}
                            value={activity.title}
                            onChange={(event) =>
                                onChange({ title: event.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${activity.id}-instruction`}>
                        {activity.type === 'mini_quiz'
                            ? 'Instruction'
                            : 'Instruction/prompt'}
                    </Label>
                    <Textarea
                        id={`${activity.id}-instruction`}
                        value={activity.instruction}
                        onChange={(event) =>
                            onChange({ instruction: event.target.value })
                        }
                    />
                </div>

                <div className="flex items-start gap-3 rounded-lg border p-4">
                    <Checkbox
                        id={`${activity.id}-record-score`}
                        checked={
                            activity.type !== 'reflection' &&
                            activity.record_score !== false
                        }
                        disabled={activity.type === 'reflection'}
                        onCheckedChange={(checked) =>
                            onChange({ record_score: checked === true })
                        }
                    />
                    <div className="grid gap-1">
                        <Label htmlFor={`${activity.id}-record-score`}>
                            Record score
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Include this activity in lesson score tracking.
                        </p>
                    </div>
                </div>

                {activity.type === 'mini_quiz' && (
                    <div className="grid gap-4 rounded-lg border p-4">
                        <div className="grid gap-2">
                            <Label htmlFor={`${activity.id}-question`}>
                                Question
                            </Label>
                            <Textarea
                                id={`${activity.id}-question`}
                                value={activity.question ?? ''}
                                onChange={(event) =>
                                    onChange({ question: event.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {normalizeChoices(activity.choices).map(
                                (choice, choiceIndex) => (
                                    <div
                                        key={`${activity.id}-choice-${choiceIndex}`}
                                        className="grid gap-2"
                                    >
                                        <Label>
                                            Choice{' '}
                                            {String.fromCharCode(
                                                65 + choiceIndex,
                                            )}
                                        </Label>
                                        <Input
                                            value={choice}
                                            onChange={(event) =>
                                                onChoiceChange(
                                                    choiceIndex,
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Correct answer</Label>
                                <Select
                                    value={
                                        typeof activity.correct_answer ===
                                        'string'
                                            ? activity.correct_answer
                                            : 'A'
                                    }
                                    onValueChange={(value) =>
                                        onChange({ correct_answer: value })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['A', 'B', 'C', 'D'].map((answer) => (
                                            <SelectItem
                                                key={answer}
                                                value={answer}
                                            >
                                                {answer}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`${activity.id}-explanation`}>
                                    Explanation
                                </Label>
                                <Textarea
                                    id={`${activity.id}-explanation`}
                                    value={activity.explanation ?? ''}
                                    onChange={(event) =>
                                        onChange({
                                            explanation: event.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activity.type === 'true_false' && (
                    <div className="grid gap-4 rounded-lg border p-4">
                        <div className="grid gap-2">
                            <Label htmlFor={`${activity.id}-statement`}>
                                Statement
                            </Label>
                            <Textarea
                                id={`${activity.id}-statement`}
                                value={activity.statement ?? ''}
                                onChange={(event) =>
                                    onChange({ statement: event.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Correct answer</Label>
                                <Select
                                    value={
                                        activity.correct_answer === false
                                            ? 'false'
                                            : 'true'
                                    }
                                    onValueChange={(value) =>
                                        onChange({
                                            correct_answer: value === 'true',
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">
                                            True
                                        </SelectItem>
                                        <SelectItem value="false">
                                            False
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <ExplanationField
                                activity={activity}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                )}

                {activity.type === 'fill_blank' && (
                    <div className="grid gap-4 rounded-lg border p-4">
                        <div className="grid gap-2">
                            <Label htmlFor={`${activity.id}-sentence`}>
                                Sentence with blank
                            </Label>
                            <Textarea
                                id={`${activity.id}-sentence`}
                                value={activity.sentence ?? ''}
                                onChange={(event) =>
                                    onChange({ sentence: event.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`${activity.id}-blank-label`}>
                                    Blank label
                                </Label>
                                <Input
                                    id={`${activity.id}-blank-label`}
                                    value={
                                        activity.blank_label ?? 'missing word'
                                    }
                                    onChange={(event) =>
                                        onChange({
                                            blank_label: event.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`${activity.id}-answer`}>
                                    Correct answer
                                </Label>
                                <Input
                                    id={`${activity.id}-answer`}
                                    value={
                                        typeof activity.correct_answer ===
                                        'string'
                                            ? activity.correct_answer
                                            : ''
                                    }
                                    onChange={(event) =>
                                        onChange({
                                            correct_answer: event.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <ExplanationField
                            activity={activity}
                            onChange={onChange}
                        />
                    </div>
                )}

                {activity.type === 'matching' && (
                    <div className="grid gap-4 rounded-lg border p-4">
                        {normalizePairs(activity.pairs).map(
                            (pair, pairIndex) => (
                                <div
                                    key={`${activity.id}-pair-${pairIndex}`}
                                    className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                                >
                                    <div className="grid gap-2">
                                        <Label>Left item</Label>
                                        <Input
                                            value={pair.left}
                                            onChange={(event) =>
                                                onPairChange(
                                                    pairIndex,
                                                    'left',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Right match</Label>
                                        <Input
                                            value={pair.right}
                                            onChange={(event) =>
                                                onPairChange(
                                                    pairIndex,
                                                    'right',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="self-end"
                                        onClick={() => onRemovePair(pairIndex)}
                                        aria-label="Remove pair"
                                        severity="danger"
                                        icon={
                                            <Trash2
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        }
                                        label="Remove"
                                    />
                                </div>
                            ),
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onAddPair}
                            className="w-fit"
                        >
                            <Plus className="size-4" aria-hidden="true" />
                            Add Pair
                        </Button>
                        <ExplanationField
                            activity={activity}
                            onChange={onChange}
                        />
                    </div>
                )}

                {activity.type === 'sequencing' && (
                    <div className="grid gap-4 rounded-lg border p-4">
                        {normalizeItems(activity.items).map(
                            (item, itemIndex) => (
                                <div
                                    key={`${activity.id}-item-${itemIndex}`}
                                    className="grid gap-3 md:grid-cols-[auto_1fr_auto]"
                                >
                                    <Badge
                                        variant="secondary"
                                        className="mt-7 size-8 justify-center rounded-full"
                                    >
                                        {itemIndex + 1}
                                    </Badge>
                                    <div className="grid gap-2">
                                        <Label>Ordered item</Label>
                                        <Input
                                            value={item}
                                            onChange={(event) =>
                                                onItemChange(
                                                    itemIndex,
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="self-end"
                                        onClick={() => onRemoveItem(itemIndex)}
                                        aria-label="Remove item"
                                        severity="danger"
                                        icon={
                                            <Trash2
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        }
                                        label="Remove"
                                    />
                                </div>
                            ),
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onAddItem}
                            className="w-fit"
                        >
                            <Plus className="size-4" aria-hidden="true" />
                            Add Item
                        </Button>
                        <ExplanationField
                            activity={activity}
                            onChange={onChange}
                        />
                    </div>
                )}

                {activity.type === 'reflection' && (
                    <div className="grid gap-2 rounded-lg border p-4">
                        <Label htmlFor={`${activity.id}-prompt`}>Prompt</Label>
                        <Textarea
                            id={`${activity.id}-prompt`}
                            value={activity.prompt ?? activity.instruction}
                            onChange={(event) =>
                                onChange({ prompt: event.target.value })
                            }
                        />
                    </div>
                )}

                {activity.type === 'clickable_activity' && (
                    <div className="grid gap-4 rounded-lg border p-4">
                        <div className="grid gap-2">
                            <Label htmlFor={`${activity.id}-card-question`}>
                                Question
                            </Label>
                            <Textarea
                                id={`${activity.id}-card-question`}
                                value={activity.question ?? ''}
                                onChange={(event) =>
                                    onChange({ question: event.target.value })
                                }
                            />
                        </div>
                        {normalizeCards(activity.cards).map(
                            (card, cardIndex) => (
                                <div
                                    key={`${activity.id}-card-${cardIndex}`}
                                    className="grid gap-3 rounded-lg border p-3 md:grid-cols-[1fr_1fr_auto]"
                                >
                                    <div className="grid gap-2">
                                        <Label>Card label</Label>
                                        <Input
                                            value={card.label}
                                            onChange={(event) =>
                                                onCardChange(cardIndex, {
                                                    label: event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Card description</Label>
                                        <Input
                                            value={card.description}
                                            onChange={(event) =>
                                                onCardChange(cardIndex, {
                                                    description:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <div className="flex h-10 items-center gap-2 rounded-lg border px-3">
                                            <Checkbox
                                                id={`${activity.id}-card-${cardIndex}-correct`}
                                                checked={card.is_correct}
                                                onCheckedChange={(checked) =>
                                                    onCardChange(cardIndex, {
                                                        is_correct:
                                                            checked === true,
                                                    })
                                                }
                                            />
                                            <Label
                                                htmlFor={`${activity.id}-card-${cardIndex}-correct`}
                                            >
                                                Correct
                                            </Label>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onRemoveCard(cardIndex)
                                            }
                                            aria-label="Remove card"
                                            severity="danger"
                                            icon={
                                                <Trash2
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                            }
                                            label="Remove"
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onAddCard}
                            className="w-fit"
                        >
                            <Plus className="size-4" aria-hidden="true" />
                            Add Card
                        </Button>
                        <ExplanationField
                            activity={activity}
                            onChange={onChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
