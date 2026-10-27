import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type AnswerKey = 'A' | 'B' | 'C' | 'D';
type TestType = 'pretest' | 'posttest';

type Question = {
    question: string;
    choices: Record<AnswerKey, string>;
    correct_answer: AnswerKey;
    explanation: string;
    points: number;
};

export type TestFormModel = {
    id: number;
    title: string;
    test_type: TestType;
    subject: string | null;
    topic: string | null;
    is_active: boolean;
    questions: Array<Question & { id?: number }>;
};

type TestFormData = {
    title: string;
    test_type: TestType;
    subject: string;
    topic: string;
    is_active: boolean;
    questions: Question[];
};

const blankQuestion = (): Question => ({
    question: '',
    choices: {
        A: '',
        B: '',
        C: '',
        D: '',
    },
    correct_answer: 'A',
    explanation: '',
    points: 1,
});

type Errors = Record<string, string | undefined>;

export function AdminTestForm({ test }: { test?: TestFormModel | null }) {
    const [data, setData] = useState<TestFormData>({
        title: test?.title ?? '',
        test_type: test?.test_type ?? 'pretest',
        subject: test?.subject ?? 'Physical Science',
        topic: test?.topic ?? "Newton's Laws of Motion",
        is_active: test?.is_active ?? true,
        questions: test?.questions.map((question) => ({
            question: question.question,
            choices: {
                A: question.choices.A ?? '',
                B: question.choices.B ?? '',
                C: question.choices.C ?? '',
                D: question.choices.D ?? '',
            },
            correct_answer: question.correct_answer,
            explanation: question.explanation ?? '',
            points: question.points,
        })) ?? [blankQuestion()],
    });
    const [errors, setErrors] = useState<Errors>({});
    const [processing, setProcessing] = useState(false);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProcessing(true);

        const options = {
            onError: (nextErrors: Errors) => setErrors(nextErrors),
            onFinish: () => setProcessing(false),
        };

        if (test) {
            router.put(`/admin/tests/${test.id}`, data, options);
            return;
        }

        router.post('/admin/tests', data, options);
    };

    const updateQuestion = (index: number, patch: Partial<Question>) => {
        setData((current) => ({
            ...current,
            questions: current.questions.map((question, questionIndex) =>
                questionIndex === index ? { ...question, ...patch } : question,
            ),
        }));
    };

    const updateChoice = (index: number, answer: AnswerKey, value: string) => {
        setData((current) => ({
            ...current,
            questions: current.questions.map((question, questionIndex) =>
                questionIndex === index
                    ? {
                          ...question,
                          choices: {
                              ...question.choices,
                              [answer]: value,
                          },
                      }
                    : question,
            ),
        }));
    };

    const removeQuestion = (index: number) => {
        setData((current) => ({
            ...current,
            questions:
                current.questions.length === 1
                    ? current.questions
                    : current.questions.filter(
                          (_, questionIndex) => questionIndex !== index,
                      ),
        }));
    };

    const error = (field: string) =>
        errors[field] ? (
            <p className="text-xs text-destructive">{errors[field]}</p>
        ) : null;

    return (
        <form onSubmit={submit} className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Button asChild variant="ghost" className="-ml-2">
                            <Link href="/admin/tests">
                                <ArrowLeft className="size-4" />
                                Tests
                            </Link>
                        </Button>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                            {test ? 'Edit Test' : 'Create Test'}
                        </h1>
                    </div>
                    <Button type="submit" disabled={processing}>
                        <Save className="size-4" />
                        Save Test
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Test Details</CardTitle>
                        <CardDescription>
                            Define the assessment metadata used by students.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Field label="Title" error={error('title')}>
                            <Input
                                value={data.title}
                                onChange={(event) =>
                                    setData({
                                        ...data,
                                        title: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Test Type" error={error('test_type')}>
                            <Select
                                value={data.test_type}
                                onValueChange={(value) =>
                                    setData({
                                        ...data,
                                        test_type: value as TestType,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pretest">
                                        Pretest
                                    </SelectItem>
                                    <SelectItem value="posttest">
                                        Posttest
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Subject" error={error('subject')}>
                            <Input
                                value={data.subject}
                                onChange={(event) =>
                                    setData({
                                        ...data,
                                        subject: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field label="Topic" error={error('topic')}>
                            <Input
                                value={data.topic}
                                onChange={(event) =>
                                    setData({
                                        ...data,
                                        topic: event.target.value,
                                    })
                                }
                            />
                        </Field>
                        <div className="flex items-center gap-3 rounded-lg border p-3 md:col-span-2">
                            <Checkbox
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData({
                                        ...data,
                                        is_active: checked === true,
                                    })
                                }
                            />
                            <Label>Active test for this subject/topic</Label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Question Builder</CardTitle>
                            <CardDescription>
                                Add multiple-choice questions with four choices.
                            </CardDescription>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setData({
                                    ...data,
                                    questions: [
                                        ...data.questions,
                                        blankQuestion(),
                                    ],
                                })
                            }
                        >
                            <Plus className="size-4" />
                            Add Question
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-5">
                        {data.questions.map((question, index) => (
                            <div
                                key={index}
                                className="grid gap-4 rounded-lg border p-4"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="font-medium">
                                        Question {index + 1}
                                    </h2>
                                    {data.questions.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeQuestion(index)
                                            }
                                            aria-label="Remove question"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                </div>

                                <Field
                                    label="Question Text"
                                    error={error(`questions.${index}.question`)}
                                >
                                    <Textarea
                                        value={question.question}
                                        onChange={(event) =>
                                            updateQuestion(index, {
                                                question: event.target.value,
                                            })
                                        }
                                    />
                                </Field>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {(['A', 'B', 'C', 'D'] as AnswerKey[]).map(
                                        (answer) => (
                                            <Field
                                                key={answer}
                                                label={`Choice ${answer}`}
                                                error={error(
                                                    `questions.${index}.choices.${answer}`,
                                                )}
                                            >
                                                <Input
                                                    value={
                                                        question.choices[answer]
                                                    }
                                                    onChange={(event) =>
                                                        updateChoice(
                                                            index,
                                                            answer,
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </Field>
                                        ),
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-[220px_160px_1fr]">
                                    <Field
                                        label="Correct Answer"
                                        error={error(
                                            `questions.${index}.correct_answer`,
                                        )}
                                    >
                                        <Select
                                            value={question.correct_answer}
                                            onValueChange={(value) =>
                                                updateQuestion(index, {
                                                    correct_answer:
                                                        value as AnswerKey,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    [
                                                        'A',
                                                        'B',
                                                        'C',
                                                        'D',
                                                    ] as AnswerKey[]
                                                ).map((answer) => (
                                                    <SelectItem
                                                        key={answer}
                                                        value={answer}
                                                    >
                                                        {answer}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field
                                        label="Points"
                                        error={error(
                                            `questions.${index}.points`,
                                        )}
                                    >
                                        <Input
                                            type="number"
                                            min={1}
                                            value={question.points}
                                            onChange={(event) =>
                                                updateQuestion(index, {
                                                    points: Number(
                                                        event.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Explanation"
                                        error={error(
                                            `questions.${index}.explanation`,
                                        )}
                                    >
                                        <Textarea
                                            value={question.explanation}
                                            onChange={(event) =>
                                                updateQuestion(index, {
                                                    explanation:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                </div>
                            </div>
                        ))}
                        {error('questions')}
                    </CardContent>
                </Card>

                <Separator />
                <div className="flex justify-end gap-2">
                    <Button asChild variant="outline">
                        <Link href="/admin/tests">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        <Save className="size-4" />
                        Save Test
                    </Button>
                </div>
            </div>
        </form>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            {error}
        </div>
    );
}
