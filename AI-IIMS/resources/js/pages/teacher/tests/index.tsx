import { Head } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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

type TestRow = {
    id: number;
    title: string;
    test_type: 'pretest' | 'posttest';
    subject: string | null;
    topic: string | null;
    is_active: boolean;
    questions_count: number;
    attempts_count: number;
    updated_at: string | null;
};

export default function TeacherTestsIndex({ tests }: { tests: TestRow[] }) {
    return (
        <>
            <Head title="Tests" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Tests
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            View the active pretest and posttest instruments
                            students use for research measurement.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Assessment Instruments</CardTitle>
                            <CardDescription>
                                Admin-managed tests are shown here for teacher
                                reference.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Test</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Questions
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Attempts
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tests.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-10 text-center text-muted-foreground"
                                            >
                                                <ClipboardList className="mx-auto mb-2 size-5" />
                                                No tests have been created.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        tests.map((test) => (
                                            <TableRow key={test.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {test.title}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {test.subject ??
                                                            'General'}{' '}
                                                        - {test.topic ?? 'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {test.test_type}
                                                    </Badge>
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
                                                <TableCell className="text-right tabular-nums">
                                                    {test.questions_count}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {test.attempts_count}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

TeacherTestsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/teacher/dashboard' },
        { title: 'Tests', href: '/teacher/tests' },
    ],
};
