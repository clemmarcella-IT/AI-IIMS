import { Head, Link, router, useForm } from '@inertiajs/react';
import { BarChart2, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { TablePagination } from '@/components/table-pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePagination } from '@/hooks/use-pagination';

type SurveyListItem = {
    id: number;
    title: string;
    description: string | null;
    is_published: boolean;
    questions_count: number;
    responses_count: number;
    updated_at: string | null;
};

type AdminSurveysIndexProps = {
    surveys: SurveyListItem[];
    filters: {
        search: string;
    };
};

export default function AdminSurveysIndex({
    surveys,
    filters,
}: AdminSurveysIndexProps) {
    const form = useForm({});
    const [search, setSearch] = useState(filters.search ?? '');
    const isInitialMount = useRef(true);
    const {
        currentPage,
        from,
        pageCount,
        pageItems: paginatedSurveys,
        setNextPage,
        setPreviousPage,
        to,
        total,
    } = usePagination(surveys);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;

            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                '/admin/surveys',
                { search },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const deleteSurvey = (survey: SurveyListItem) => {
        form.delete(`/admin/surveys/${survey.id}`, {
            preserveScroll: true,
        });
    };

    const togglePublish = (survey: SurveyListItem) => {
        form.patch(`/admin/surveys/${survey.id}/toggle-publish`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Survey Questionnaires" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Survey Questionnaires
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                Measure student exposure to AI-enhanced
                                instructional materials.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/admin/surveys/create">
                                <Plus className="size-4" />
                                Create Survey
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Surveys</CardTitle>
                            <CardDescription>
                                Published surveys are visible to students.
                                Toggle to control access.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="relative w-full sm:max-w-md">
                                <Search
                                    className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <Input
                                    type="search"
                                    aria-label="Search surveys"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    className="pl-9"
                                    placeholder="Search title or description..."
                                />
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Questions</TableHead>
                                        <TableHead>Responses</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Updated</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedSurveys.map((survey) => (
                                        <TableRow key={survey.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {survey.title}
                                                    </p>
                                                    {survey.description && (
                                                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                            {survey.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {survey.questions_count}
                                            </TableCell>
                                            <TableCell>
                                                {survey.responses_count}
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
                                                        : 'Unpublished'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {survey.updated_at ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            togglePublish(
                                                                survey,
                                                            )
                                                        }
                                                        disabled={
                                                            form.processing
                                                        }
                                                    >
                                                        {survey.is_published
                                                            ? 'Unpublish'
                                                            : 'Publish'}
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Link
                                                            href={`/admin/surveys/${survey.id}/results`}
                                                            aria-label="View results"
                                                        >
                                                            <BarChart2 className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Link
                                                            href={`/admin/surveys/${survey.id}/edit`}
                                                            aria-label="Edit survey"
                                                        >
                                                            <Edit className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                aria-label="Delete survey"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete
                                                                    survey?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will
                                                                    remove{' '}
                                                                    <strong>
                                                                        {
                                                                            survey.title
                                                                        }
                                                                    </strong>{' '}
                                                                    and all
                                                                    student
                                                                    responses.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        deleteSurvey(
                                                                            survey,
                                                                        )
                                                                    }
                                                                    className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {surveys.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                No surveys yet. Create one to
                                                get started.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            {total > 0 && (
                                <TablePagination
                                    currentPage={currentPage}
                                    from={from}
                                    onNext={setNextPage}
                                    onPrevious={setPreviousPage}
                                    pageCount={pageCount}
                                    to={to}
                                    total={total}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminSurveysIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Surveys', href: '/admin/surveys' },
    ],
};
