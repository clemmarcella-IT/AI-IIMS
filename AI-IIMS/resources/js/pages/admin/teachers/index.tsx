import { Head } from '@inertiajs/react';
import { Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

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

type TeacherRow = {
    id: number;
    employee_no: string;
    name: string;
    email: string | null;
    department: string | null;
    specialization: string | null;
    position: string | null;
    lessons_count: number;
    ai_suggestions_count: number;
};

export default function AdminTeachersIndex({
    teachers,
}: {
    teachers: TeacherRow[];
}) {
    const [search, setSearch] = useState('');
    const query = search.trim().toLowerCase();
    const visibleTeachers = useMemo(
        () =>
            query
                ? teachers.filter((teacher) =>
                      [
                          teacher.employee_no,
                          teacher.name,
                          teacher.email ?? '',
                          teacher.department ?? '',
                          teacher.specialization ?? '',
                          teacher.position ?? '',
                      ]
                          .join(' ')
                          .toLowerCase()
                          .includes(query),
                  )
                : teachers,
        [query, teachers],
    );

    return (
        <>
            <Head title="Teachers" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Teachers
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Review teacher profiles and lesson-building
                            activity.
                        </p>
                    </div>

                    <Card>
                        <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Teacher Directory</CardTitle>
                                <CardDescription>
                                    {teachers.length} teacher
                                    {teachers.length === 1 ? '' : 's'} in the
                                    system.
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    aria-label="Search teachers"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search teachers..."
                                    className="pl-9"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead className="text-right">
                                            Lessons
                                        </TableHead>
                                        <TableHead className="text-right">
                                            AI Suggestions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visibleTeachers.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-10 text-center text-muted-foreground"
                                            >
                                                <Users className="mx-auto mb-2 size-5" />
                                                No teachers found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        visibleTeachers.map((teacher) => (
                                            <TableRow key={teacher.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {teacher.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {teacher.employee_no}
                                                        {teacher.email
                                                            ? ` - ${teacher.email}`
                                                            : ''}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.department ??
                                                        'Unassigned'}
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.position ??
                                                        teacher.specialization ??
                                                        'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {teacher.lessons_count}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {
                                                        teacher.ai_suggestions_count
                                                    }
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

AdminTeachersIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Teachers', href: '/admin/teachers' },
    ],
};
