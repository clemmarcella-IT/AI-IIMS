import { Head, useForm } from '@inertiajs/react';
import { ClipboardCheck, Microscope, Save } from 'lucide-react';
import type { FormEvent } from 'react';

import { Badge } from '@/components/ui/badge';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

type SurveyReliability = {
    id: number;
    title: string;
    is_published: boolean;
    questions_count: number;
    responses_count: number;
    cronbach_alpha: number | null;
    alpha_status: string;
};

type InstrumentReview = {
    id: number;
    survey_title: string;
    review_type: 'expert_review' | 'pilot_test';
    reviewer_name: string;
    reviewer_role: string | null;
    validity_rating: number | null;
    comments: string | null;
    reviewed_at: string | null;
};

type ReviewForm = {
    survey_id: string;
    review_type: 'expert_review' | 'pilot_test';
    reviewer_name: string;
    reviewer_role: string;
    validity_rating: string;
    comments: string;
    reviewed_at: string;
};

const blankForm: ReviewForm = {
    survey_id: '',
    review_type: 'expert_review',
    reviewer_name: '',
    reviewer_role: '',
    validity_rating: '',
    comments: '',
    reviewed_at: '',
};

const alphaLabel = (value: number | null) =>
    value === null ? 'Pending' : value.toFixed(4);

const alphaVariant = (value: number | null) => {
    if (value === null) return 'secondary';
    if (value >= 0.7) return 'default';
    return 'destructive';
};

export default function AdminInstrumentsIndex({
    surveys,
    reviews,
}: {
    surveys: SurveyReliability[];
    reviews: InstrumentReview[];
}) {
    const form = useForm<ReviewForm>(blankForm);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post('/admin/instruments/reviews', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <>
            <Head title="Instrument Validation" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
                    <div className="flex flex-col gap-6">
                        <section>
                            <Badge variant="secondary">
                                <Microscope className="size-3.5" />
                                Research Instruments
                            </Badge>
                            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                                Instrument Validation
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                                Track expert review, pilot-test notes, and
                                internal consistency for the student exposure
                                questionnaire.
                            </p>
                        </section>

                        <Card>
                            <CardHeader>
                                <CardTitle>Survey Reliability</CardTitle>
                                <CardDescription>
                                    Cronbach&apos;s alpha uses complete student
                                    responses across all survey questions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Instrument</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Questions
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Responses
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Alpha
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {surveys.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="py-10 text-center text-muted-foreground"
                                                >
                                                    No surveys found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            surveys.map((survey) => (
                                                <TableRow key={survey.id}>
                                                    <TableCell>
                                                        <div className="font-medium">
                                                            {survey.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                survey.alpha_status
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                survey.is_published
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {survey.is_published
                                                                ? 'Published'
                                                                : 'Draft'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {
                                                            survey.questions_count
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {
                                                            survey.responses_count
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge
                                                            variant={alphaVariant(
                                                                survey.cronbach_alpha,
                                                            )}
                                                        >
                                                            {alphaLabel(
                                                                survey.cronbach_alpha,
                                                            )}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Review Log</CardTitle>
                                <CardDescription>
                                    Expert validation and pilot-test records.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reviewer</TableHead>
                                            <TableHead>Instrument</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="text-right">
                                                Rating
                                            </TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reviews.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="py-10 text-center text-muted-foreground"
                                                >
                                                    No review records yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            reviews.map((review) => (
                                                <TableRow key={review.id}>
                                                    <TableCell>
                                                        <div className="font-medium">
                                                            {
                                                                review.reviewer_name
                                                            }
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {review.reviewer_role ??
                                                                'No role'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {review.survey_title}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {review.review_type.replaceAll(
                                                                '_',
                                                                ' ',
                                                            )}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {review.validity_rating ??
                                                            'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {review.reviewed_at ??
                                                            'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="h-fit">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ClipboardCheck className="size-5" />
                                </span>
                                <div>
                                    <CardTitle>Record Review</CardTitle>
                                    <CardDescription>
                                        Add expert or pilot feedback.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form className="grid gap-4" onSubmit={submit}>
                                <div className="grid gap-2">
                                    <Label htmlFor="survey_id">
                                        Instrument
                                    </Label>
                                    <Select
                                        value={form.data.survey_id}
                                        onValueChange={(value) =>
                                            form.setData('survey_id', value)
                                        }
                                    >
                                        <SelectTrigger id="survey_id">
                                            <SelectValue placeholder="General instrument" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {surveys.map((survey) => (
                                                <SelectItem
                                                    key={survey.id}
                                                    value={String(survey.id)}
                                                >
                                                    {survey.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="review_type">Type</Label>
                                    <Select
                                        value={form.data.review_type}
                                        onValueChange={(value) =>
                                            form.setData(
                                                'review_type',
                                                value as ReviewForm['review_type'],
                                            )
                                        }
                                    >
                                        <SelectTrigger id="review_type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="expert_review">
                                                Expert review
                                            </SelectItem>
                                            <SelectItem value="pilot_test">
                                                Pilot test
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="reviewer_name">
                                        Reviewer name
                                    </Label>
                                    <Input
                                        id="reviewer_name"
                                        value={form.data.reviewer_name}
                                        onChange={(event) =>
                                            form.setData(
                                                'reviewer_name',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="reviewer_role">
                                        Reviewer role
                                    </Label>
                                    <Input
                                        id="reviewer_role"
                                        value={form.data.reviewer_role}
                                        onChange={(event) =>
                                            form.setData(
                                                'reviewer_role',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Teacher, adviser, panelist"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="validity_rating">
                                        Validity rating
                                    </Label>
                                    <Input
                                        id="validity_rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={form.data.validity_rating}
                                        onChange={(event) =>
                                            form.setData(
                                                'validity_rating',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="1-5"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="reviewed_at">Date</Label>
                                    <Input
                                        id="reviewed_at"
                                        type="date"
                                        value={form.data.reviewed_at}
                                        onChange={(event) =>
                                            form.setData(
                                                'reviewed_at',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="comments">Comments</Label>
                                    <Textarea
                                        id="comments"
                                        value={form.data.comments}
                                        onChange={(event) =>
                                            form.setData(
                                                'comments',
                                                event.target.value,
                                            )
                                        }
                                        rows={4}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                >
                                    <Save className="size-4" />
                                    Save Review
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminInstrumentsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Instruments', href: '/admin/instruments' },
    ],
};
