import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type CategoryAverage = {
    label: string;
    average: number | null;
    count: number;
};

type QuestionResult = {
    id: number;
    question: string;
    category: string;
    average: number | null;
};

type SurveyResultsProps = {
    survey: {
        id: number;
        title: string;
        description: string | null;
        is_published: boolean;
    };
    categoryAverages: Record<string, CategoryAverage>;
    totalResponses: number;
    questions: QuestionResult[];
};

const CATEGORY_ORDER = [
    'interactivity',
    'personalization',
    'feedback_timeliness',
    'ease_of_use',
    'engagement',
];

function ratingColor(avg: number | null): string {
    if (avg === null) return 'text-muted-foreground';
    if (avg >= 4.5) return 'text-green-600';
    if (avg >= 3.5) return 'text-blue-600';
    if (avg >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
}

function RatingBar({ value }: { value: number | null }) {
    if (value === null) {
        return <span className="text-xs text-muted-foreground">No data</span>;
    }
    const pct = ((value - 1) / 4) * 100;
    return (
        <div className="flex items-center gap-3">
            <div className="relative h-2 w-32 overflow-hidden rounded-full bg-muted">
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className={`text-sm font-medium ${ratingColor(value)}`}>
                {value.toFixed(2)}
            </span>
        </div>
    );
}

export default function AdminSurveyResults({
    survey,
    categoryAverages,
    totalResponses,
    questions,
}: SurveyResultsProps) {
    const overallAvg =
        Object.values(categoryAverages)
            .filter((c) => c.average !== null)
            .map((c) => c.average as number)
            .reduce((sum, avg, _, arr) => sum + avg / arr.length, 0) || null;

    return (
        <>
            <Head title={`Results — ${survey.title}`} />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <Button asChild variant="ghost" className="-ml-2">
                                <Link href="/admin/surveys">
                                    <ArrowLeft className="size-4" />
                                    Surveys
                                </Link>
                            </Button>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    {survey.title}
                                </h1>
                                <Badge
                                    variant={
                                        survey.is_published
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {survey.is_published
                                        ? 'Published'
                                        : 'Unpublished'}
                                </Badge>
                            </div>
                            {survey.description && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {survey.description}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold">
                                {totalResponses}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                total responses
                            </p>
                        </div>
                    </div>

                    {totalResponses === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No responses yet. Publish the survey so students
                                can complete it.
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Category Averages</CardTitle>
                                    <CardDescription>
                                        Average rating per dimension (1 =
                                        Strongly Disagree, 5 = Strongly Agree)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {CATEGORY_ORDER.map((key) => {
                                            const cat = categoryAverages[key];
                                            if (!cat) return null;
                                            return (
                                                <div
                                                    key={key}
                                                    className="flex flex-col gap-2 rounded-lg border p-4"
                                                >
                                                    <p className="text-sm font-medium">
                                                        {cat.label}
                                                    </p>
                                                    <RatingBar
                                                        value={cat.average}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        {cat.count} answer
                                                        {cat.count !== 1
                                                            ? 's'
                                                            : ''}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                        {overallAvg !== null && (
                                            <div className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:col-span-2 lg:col-span-3">
                                                <p className="text-sm font-semibold">
                                                    Overall Average
                                                </p>
                                                <RatingBar value={overallAvg} />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Per-Question Averages</CardTitle>
                                    <CardDescription>
                                        Individual item breakdown
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>#</TableHead>
                                                <TableHead>Question</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Average</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {questions.map((q, index) => (
                                                <TableRow key={q.id}>
                                                    <TableCell className="text-muted-foreground">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {q.question}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {q.category.replace(
                                                                '_',
                                                                ' ',
                                                            )}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <RatingBar
                                                            value={q.average}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

AdminSurveyResults.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Surveys', href: '/admin/surveys' },
        { title: 'Results', href: '#' },
    ],
};
