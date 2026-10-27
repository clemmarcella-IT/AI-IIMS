import { Head } from '@inertiajs/react';
import { BookOpen, Search } from 'lucide-react';
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

type LessonRow = {
    id: number;
    title: string;
    subject: string | null;
    topic: string | null;
    teacher_name: string | null;
    difficulty_level: string;
    is_published: boolean;
    activities_count: number;
    questions_count: number;
    students_started: number;
    updated_at: string | null;
};

export default function AdminLessonsIndex({
    lessons,
}: {
    lessons: LessonRow[];
}) {
    const [search, setSearch] = useState('');
    const query = search.trim().toLowerCase();
    const visibleLessons = useMemo(
        () =>
            query
                ? lessons.filter((lesson) =>
                      [
                          lesson.title,
                          lesson.subject ?? '',
                          lesson.topic ?? '',
                          lesson.teacher_name ?? '',
                          lesson.difficulty_level,
                      ]
                          .join(' ')
                          .toLowerCase()
                          .includes(query),
                  )
                : lessons,
        [query, lessons],
    );

    return (
        <>
            <Head title="Lessons" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Lessons
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Audit published and draft instructional materials
                            across teachers.
                        </p>
                    </div>

                    <Card>
                        <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Lesson Directory</CardTitle>
                                <CardDescription>
                                    {lessons.length} lesson
                                    {lessons.length === 1 ? '' : 's'} created.
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    aria-label="Search lessons"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search lessons..."
                                    className="pl-9"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Lesson</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Activities
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Questions
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Started
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visibleLessons.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-10 text-center text-muted-foreground"
                                            >
                                                <BookOpen className="mx-auto mb-2 size-5" />
                                                No lessons found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        visibleLessons.map((lesson) => (
                                            <TableRow key={lesson.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {lesson.title}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {lesson.subject ??
                                                            'General'}{' '}
                                                        -{' '}
                                                        {lesson.topic ??
                                                            lesson.difficulty_level}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {lesson.teacher_name ??
                                                        'Unassigned'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            lesson.is_published
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {lesson.is_published
                                                            ? 'Published'
                                                            : 'Draft'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {lesson.activities_count}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {lesson.questions_count}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {lesson.students_started}
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

AdminLessonsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Lessons', href: '/admin/lessons' },
    ],
};
