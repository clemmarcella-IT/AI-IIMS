import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export type TeacherStudentFormModel = {
    id: number;
    name: string;
    email: string;
    student_code: string;
    first_name: string;
    last_name: string;
    grade_level: string;
    section: string;
    consent_status: boolean;
};

type StudentFormData = {
    name: string;
    email: string;
    password: string;
    student_code: string;
    first_name: string;
    last_name: string;
    grade_level: string;
    section: string;
    consent_status: boolean;
};

export function TeacherStudentForm({
    student,
}: {
    student?: TeacherStudentFormModel | null;
}) {
    const form = useForm<StudentFormData>({
        name: student?.name ?? '',
        email: student?.email ?? '',
        password: '',
        student_code: student?.student_code ?? '',
        first_name: student?.first_name ?? '',
        last_name: student?.last_name ?? '',
        grade_level: student?.grade_level ?? '',
        section: student?.section ?? '',
        consent_status: student?.consent_status ?? false,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (student) {
            form.put(`/teacher/students/${student.id}`);
            return;
        }

        form.post('/teacher/students');
    };

    const error = (field: keyof StudentFormData) => (
        <InputError message={form.errors[field]} />
    );

    return (
        <form onSubmit={submit} className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Button asChild variant="ghost" className="-ml-2">
                            <Link href="/teacher/students">
                                <ArrowLeft className="size-4" />
                                Students
                            </Link>
                        </Button>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                            {student ? 'Edit Student' : 'Add Student'}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            {student
                                ? 'Update the student login and academic profile.'
                                : 'Create a student login and academic profile for lesson access.'}
                        </p>
                    </div>

                    <Button type="submit" disabled={form.processing}>
                        <Save className="size-4" />
                        Save Student
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Login details the student will use to access the
                            system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Field label="Full Name" error={error('name')}>
                            <Input
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                autoComplete="name"
                            />
                        </Field>

                        <Field label="Email" error={error('email')}>
                            <Input
                                type="email"
                                value={form.data.email}
                                onChange={(event) =>
                                    form.setData('email', event.target.value)
                                }
                                autoComplete="email"
                            />
                        </Field>

                        <Field
                            label={student ? 'Password (optional)' : 'Password'}
                            error={error('password')}
                        >
                            <Input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData('password', event.target.value)
                                }
                                autoComplete="new-password"
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Profile</CardTitle>
                        <CardDescription>
                            Academic identity and classroom placement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field
                                label="Student Code"
                                error={error('student_code')}
                            >
                                <Input
                                    value={form.data.student_code}
                                    onChange={(event) =>
                                        form.setData(
                                            'student_code',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>

                            <Field
                                label="Grade Level"
                                error={error('grade_level')}
                            >
                                <Input
                                    value={form.data.grade_level}
                                    onChange={(event) =>
                                        form.setData(
                                            'grade_level',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>

                            <Field
                                label="First Name"
                                error={error('first_name')}
                            >
                                <Input
                                    value={form.data.first_name}
                                    onChange={(event) =>
                                        form.setData(
                                            'first_name',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="given-name"
                                />
                            </Field>

                            <Field label="Last Name" error={error('last_name')}>
                                <Input
                                    value={form.data.last_name}
                                    onChange={(event) =>
                                        form.setData(
                                            'last_name',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="family-name"
                                />
                            </Field>

                            <Field label="Section" error={error('section')}>
                                <Input
                                    value={form.data.section}
                                    onChange={(event) =>
                                        form.setData(
                                            'section',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>

                            <div className="flex items-center gap-3 rounded-lg border p-3">
                                <Checkbox
                                    id="consent_status"
                                    checked={form.data.consent_status}
                                    onCheckedChange={(checked) =>
                                        form.setData(
                                            'consent_status',
                                            checked === true,
                                        )
                                    }
                                />
                                <Label htmlFor="consent_status">
                                    Research consent received
                                </Label>
                            </div>
                        </div>
                        {error('consent_status')}
                    </CardContent>
                </Card>

                <Separator />

                <div className="flex justify-end gap-2">
                    <Button asChild variant="outline">
                        <Link href="/teacher/students">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={form.processing}>
                        <Save className="size-4" />
                        Save Student
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
    error?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            {error}
        </div>
    );
}
