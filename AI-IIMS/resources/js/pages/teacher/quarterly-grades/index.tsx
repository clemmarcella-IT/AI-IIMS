import { Head, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Grade = {
    id: number;
    subject: string;
    school_year: string | null;
    quarter_1: number | null;
    quarter_2: number | null;
    quarter_3: number | null;
    quarter_4: number | null;
    average: number | null;
};

type StudentRow = {
    id: number;
    student_code: string;
    name: string;
    grade_level: string;
    section: string;
    grades: Grade[];
};

type GradeForm = {
    subject: string;
    school_year: string;
    quarter_1: string;
    quarter_2: string;
    quarter_3: string;
    quarter_4: string;
};

const blankForm = (grade?: Grade): GradeForm => ({
    subject: grade?.subject ?? 'General',
    school_year: grade?.school_year ?? '',
    quarter_1: grade?.quarter_1?.toString() ?? '',
    quarter_2: grade?.quarter_2?.toString() ?? '',
    quarter_3: grade?.quarter_3?.toString() ?? '',
    quarter_4: grade?.quarter_4?.toString() ?? '',
});

const fmt = (value: number | null) =>
    value === null ? 'Pending' : value.toFixed(2);

export default function TeacherQuarterlyGradesIndex({
    students,
}: {
    students: StudentRow[];
}) {
    const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(
        students[0] ?? null,
    );
    const latestGrade = selectedStudent?.grades[0];
    const form = useForm<GradeForm>(blankForm(latestGrade));

    const selectStudent = (student: StudentRow) => {
        setSelectedStudent(student);
        form.clearErrors();
        form.setData(blankForm(student.grades[0]));
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedStudent) {
            return;
        }

        form.put(`/teacher/quarterly-grades/${selectedStudent.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Quarterly Grades" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Quarterly Grades
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                Record teacher-approved academic performance
                                beside pretest and posttest results.
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Students</CardTitle>
                                <CardDescription>
                                    Select a student to enter quarterly grades.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead className="text-right">
                                                Latest Average
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map((student) => (
                                            <TableRow
                                                key={student.id}
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    selectStudent(student)
                                                }
                                            >
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {student.student_code}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    Grade {student.grade_level}{' '}
                                                    - {student.section}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {fmt(
                                                        student.grades[0]
                                                            ?.average ?? null,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>
                                {selectedStudent?.name ?? 'No student selected'}
                            </CardTitle>
                            <CardDescription>
                                Save one subject and school year at a time.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedStudent ? (
                                <form className="grid gap-4" onSubmit={submit}>
                                    <div className="grid gap-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            value={form.data.subject}
                                            onChange={(event) =>
                                                form.setData(
                                                    'subject',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="school_year">
                                            School year
                                        </Label>
                                        <Input
                                            id="school_year"
                                            value={form.data.school_year}
                                            onChange={(event) =>
                                                form.setData(
                                                    'school_year',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="2026-2027"
                                        />
                                    </div>
                                    {[
                                        ['quarter_1', 'Quarter 1'],
                                        ['quarter_2', 'Quarter 2'],
                                        ['quarter_3', 'Quarter 3'],
                                        ['quarter_4', 'Quarter 4'],
                                    ].map(([key, label]) => (
                                        <div key={key} className="grid gap-2">
                                            <Label htmlFor={key}>
                                                {label}
                                            </Label>
                                            <Input
                                                id={key}
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={
                                                    form.data[
                                                        key as keyof GradeForm
                                                    ]
                                                }
                                                onChange={(event) =>
                                                    form.setData(
                                                        key as keyof GradeForm,
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        <Save className="size-4" />
                                        Save Grades
                                    </Button>
                                </form>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Add students before recording grades.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

TeacherQuarterlyGradesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/teacher/dashboard' },
        { title: 'Quarterly Grades', href: '/teacher/quarterly-grades' },
    ],
};
