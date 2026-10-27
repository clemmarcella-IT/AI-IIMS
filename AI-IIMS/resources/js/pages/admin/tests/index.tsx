import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
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

type TestListItem = {
    id: number;
    title: string;
    test_type: 'pretest' | 'posttest';
    subject: string | null;
    topic: string | null;
    is_active: boolean;
    questions_count: number;
    updated_at: string | null;
};

type AdminTestsIndexProps = {
    tests: TestListItem[];
    filters: {
        search: string;
    };
};

export default function AdminTestsIndex({
    tests,
    filters,
}: AdminTestsIndexProps) {
    const form = useForm({});
    const [search, setSearch] = useState(filters.search ?? '');
    const isInitialMount = useRef(true);
    const {
        currentPage,
        from,
        pageCount,
        pageItems: paginatedTests,
        setNextPage,
        setPreviousPage,
        to,
        total,
    } = usePagination(tests);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;

            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                '/admin/tests',
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

    const deleteTest = (test: TestListItem) => {
        form.delete(`/admin/tests/${test.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Test Management" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Pretest and Posttest Management
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                Maintain teacher/admin-defined assessments
                                aligned with Grade 12 lessons.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/admin/tests/create">
                                <Plus className="size-4" />
                                Create Test
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tests</CardTitle>
                            <CardDescription>
                                Active tests are used by the student assessment
                                flow.
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
                                    aria-label="Search tests"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    className="pl-9"
                                    placeholder="Search title, type, subject..."
                                />
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Topic</TableHead>
                                        <TableHead>Questions</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedTests.map((test) => (
                                        <TableRow key={test.id}>
                                            <TableCell className="font-medium">
                                                {test.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {test.test_type ===
                                                    'pretest'
                                                        ? 'Pretest'
                                                        : 'Posttest'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {test.subject ?? 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {test.topic ?? 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {test.questions_count}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        test.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {test.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Link
                                                            href={`/admin/tests/${test.id}/edit`}
                                                            aria-label="Edit test"
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
                                                                aria-label="Delete test"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete test?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will
                                                                    remove{' '}
                                                                    {test.title}
                                                                    and all of
                                                                    its
                                                                    questions.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        deleteTest(
                                                                            test,
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
                                    {tests.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                No tests found.
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

AdminTestsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Tests',
            href: '/admin/tests',
        },
    ],
};
