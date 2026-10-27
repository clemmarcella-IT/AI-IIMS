import { Head } from '@inertiajs/react';
import { Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
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

type StudentRow = {
    id: number;
    student_code: string;
    name: string;
    email: string | null;
    grade_level: string;
    section: string;
    consent_status: boolean;
    pretest: number | null;
    posttest: number | null;
    completed_lessons: number;
    average_progress: number | null;
    quarterly_average: number | null;
};

const fmt = (value: number | null) =>
    value === null ? 'Pending' : `${Number(value).toFixed(2)}%`;

export default function AdminStudentsIndex({
    students,
}: {
    students: StudentRow[];
}) {
    const [search, setSearch] = useState('');
    const query = search.trim().toLowerCase();
    const visibleStudents = useMemo(
        () =>
            query
                ? students.filter((student) =>
                      [
                          student.student_code,
                          student.name,
                          student.email ?? '',
                          student.grade_level,
                          student.section,
                      ]
                          .join(' ')
                          .toLowerCase()
                          .includes(query),
                  )
                : students,
        [query, students],
    );

    return (
        <>
            <Head title="Students" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Students
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Monitor learner records, consent, assessments, and
                            quarterly grades.
                        </p>
                    </div>

                    <Card>
                        <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Student Directory</CardTitle>
                                <CardDescription>
                                    {students.length} enrolled student
                                    {students.length === 1 ? '' : 's'}.
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    aria-label="Search students"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search students..."
                                    className="pl-9"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Consent</TableHead>
                                        <TableHead className="text-right">
                                            Pretest
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Posttest
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Progress
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Quarterly
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visibleStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-10 text-center text-muted-foreground"
                                            >
                                                <Users className="mx-auto mb-2 size-5" />
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        visibleStudents.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {student.student_code}
                                                        {student.email
                                                            ? ` - ${student.email}`
                                                            : ''}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    Grade {student.grade_level}{' '}
                                                    - {student.section}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            student.consent_status
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {student.consent_status
                                                            ? 'Consented'
                                                            : 'Pending'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {fmt(student.pretest)}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {fmt(student.posttest)}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {fmt(
                                                        student.average_progress,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {fmt(
                                                        student.quarterly_average,
                                                    )}
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

AdminStudentsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Students', href: '/admin/students' },
    ],
};
