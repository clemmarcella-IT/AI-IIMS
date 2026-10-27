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

type Category =
    | 'interactivity'
    | 'personalization'
    | 'feedback_timeliness'
    | 'ease_of_use'
    | 'engagement';

const CATEGORY_LABELS: Record<Category, string> = {
    interactivity: 'Interactivity',
    personalization: 'Personalization',
    feedback_timeliness: 'Feedback Timeliness',
    ease_of_use: 'Ease of Use',
    engagement: 'Engagement',
};

type QuestionDraft = {
    id?: number;
    question: string;
    category: Category;
};

export type SurveyFormModel = {
    id: number;
    title: string;
    description: string | null;
    is_published: boolean;
    questions: Array<QuestionDraft>;
};

type FormData = {
    title: string;
    description: string;
    questions: QuestionDraft[];
};

type Errors = Record<string, string | undefined>;

const blankQuestion = (): QuestionDraft => ({
    question: '',
    category: 'interactivity',
});

export function SurveyForm({ survey }: { survey?: SurveyFormModel | null }) {
    const [data, setData] = useState<FormData>({
        title: survey?.title ?? '',
        description: survey?.description ?? '',
        questions: survey?.questions.map((q) => ({
            id: q.id,
            question: q.question,
            category: q.category as Category,
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

        if (survey) {
            router.put(`/admin/surveys/${survey.id}`, data, options);
            return;
        }

        router.post('/admin/surveys', data, options);
    };

    const updateQuestion = (index: number, patch: Partial<QuestionDraft>) => {
        setData((current) => ({
            ...current,
            questions: current.questions.map((q, i) =>
                i === index ? { ...q, ...patch } : q,
            ),
        }));
    };

    const removeQuestion = (index: number) => {
        if (data.questions.length === 1) return;
        setData((current) => ({
            ...current,
            questions: current.questions.filter((_, i) => i !== index),
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
                            <Link href="/admin/surveys">
                                <ArrowLeft className="size-4" />
                                Surveys
                            </Link>
                        </Button>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                            {survey ? 'Edit Survey' : 'Create Survey'}
                        </h1>
                    </div>
                    <Button type="submit" disabled={processing}>
                        <Save className="size-4" />
                        Save Survey
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Survey Details</CardTitle>
                        <CardDescription>
                            Basic information about this questionnaire.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Field label="Title" error={error('title')}>
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData({ ...data, title: e.target.value })
                                }
                                placeholder="e.g. AI-Enhanced Learning Experience Survey"
                            />
                        </Field>
                        <Field
                            label="Description (optional)"
                            error={error('description')}
                        >
                            <Textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Brief instructions or context for students."
                                rows={3}
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Questions</CardTitle>
                            <CardDescription>
                                Each question is rated on a 5-point Likert
                                scale. Assign a category to each question.
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
                        {data.questions.map((q, index) => (
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

                                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                                    <Field
                                        label="Question Text"
                                        error={error(
                                            `questions.${index}.question`,
                                        )}
                                    >
                                        <Input
                                            value={q.question}
                                            onChange={(e) =>
                                                updateQuestion(index, {
                                                    question: e.target.value,
                                                })
                                            }
                                            placeholder="e.g. The materials felt interactive and engaging."
                                        />
                                    </Field>
                                    <Field
                                        label="Category"
                                        error={error(
                                            `questions.${index}.category`,
                                        )}
                                    >
                                        <Select
                                            value={q.category}
                                            onValueChange={(value) =>
                                                updateQuestion(index, {
                                                    category: value as Category,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    Object.entries(
                                                        CATEGORY_LABELS,
                                                    ) as [Category, string][]
                                                ).map(([value, label]) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                        <Link href="/admin/surveys">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        <Save className="size-4" />
                        Save Survey
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
