import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEvent } from 'react';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type Role = 'admin' | 'teacher' | 'student';

export type UserFormModel = {
    id: number;
    name: string;
    email: string;
    role: Role;
    student: {
        student_code: string;
        first_name: string;
        last_name: string;
        grade_level: string;
        section: string;
        consent_status: boolean;
    } | null;
    teacher: {
        employee_no: string;
        first_name: string;
        last_name: string;
        department: string | null;
        specialization: string | null;
        position: string | null;
    } | null;
};

type UserFormData = {
    name: string;
    email: string;
    password: string;
    role: Role;
    student_code: string;
    student_first_name: string;
    student_last_name: string;
    grade_level: string;
    section: string;
    consent_status: boolean;
    employee_no: string;
    teacher_first_name: string;
    teacher_last_name: string;
    department: string;
    specialization: string;
    position: string;
};

export function AdminUserForm({ user }: { user?: UserFormModel | null }) {
    const form = useForm<UserFormData>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        role: user?.role ?? 'student',
        student_code: user?.student?.student_code ?? '',
        student_first_name: user?.student?.first_name ?? '',
        student_last_name: user?.student?.last_name ?? '',
        grade_level: user?.student?.grade_level ?? '11',
        section: user?.student?.section ?? '',
        consent_status: user?.student?.consent_status ?? false,
        employee_no: user?.teacher?.employee_no ?? '',
        teacher_first_name: user?.teacher?.first_name ?? '',
        teacher_last_name: user?.teacher?.last_name ?? '',
        department: user?.teacher?.department ?? '',
        specialization: user?.teacher?.specialization ?? '',
        position: user?.teacher?.position ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (user) {
            form.put(`/admin/users/${user.id}`);
            return;
        }

        form.post('/admin/users');
    };

    const error = (field: keyof UserFormData) =>
        form.errors[field] ? (
            <p className="text-xs text-destructive">{form.errors[field]}</p>
        ) : null;

    return (
        <form onSubmit={submit} className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Button asChild variant="ghost" className="-ml-2">
                            <Link href="/admin/users">
                                <ArrowLeft className="size-4" />
                                Users
                            </Link>
                        </Button>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                            {user ? 'Edit User' : 'Create User'}
                        </h1>
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        <Save className="size-4" />
                        Save User
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Login details and role assignment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Name" error={error('name')}>
                                <Input
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Email" error={error('email')}>
                                <Input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(event) =>
                                        form.setData(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label={
                                    user ? 'Password (optional)' : 'Password'
                                }
                                error={error('password')}
                            >
                                <Input
                                    type="password"
                                    value={form.data.password}
                                    onChange={(event) =>
                                        form.setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field label="Role" error={error('role')}>
                                <Select
                                    value={form.data.role}
                                    onValueChange={(value) =>
                                        form.setData('role', value as Role)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            Admin
                                        </SelectItem>
                                        <SelectItem value="teacher">
                                            Teacher
                                        </SelectItem>
                                        <SelectItem value="student">
                                            Student
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </CardContent>
                </Card>

                {form.data.role === 'student' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Profile</CardTitle>
                            <CardDescription>
                                Academic identity and research consent.
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
                                    error={error('student_first_name')}
                                >
                                    <Input
                                        value={form.data.student_first_name}
                                        onChange={(event) =>
                                            form.setData(
                                                'student_first_name',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field
                                    label="Last Name"
                                    error={error('student_last_name')}
                                >
                                    <Input
                                        value={form.data.student_last_name}
                                        onChange={(event) =>
                                            form.setData(
                                                'student_last_name',
                                                event.target.value,
                                            )
                                        }
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
                                        checked={form.data.consent_status}
                                        onCheckedChange={(checked) =>
                                            form.setData(
                                                'consent_status',
                                                checked === true,
                                            )
                                        }
                                    />
                                    <Label>Research consent received</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {form.data.role === 'teacher' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Teacher Profile</CardTitle>
                            <CardDescription>
                                Faculty identity and teaching assignment.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field
                                    label="Employee No."
                                    error={error('employee_no')}
                                >
                                    <Input
                                        value={form.data.employee_no}
                                        onChange={(event) =>
                                            form.setData(
                                                'employee_no',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field
                                    label="Department"
                                    error={error('department')}
                                >
                                    <Input
                                        value={form.data.department}
                                        onChange={(event) =>
                                            form.setData(
                                                'department',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field
                                    label="First Name"
                                    error={error('teacher_first_name')}
                                >
                                    <Input
                                        value={form.data.teacher_first_name}
                                        onChange={(event) =>
                                            form.setData(
                                                'teacher_first_name',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field
                                    label="Last Name"
                                    error={error('teacher_last_name')}
                                >
                                    <Input
                                        value={form.data.teacher_last_name}
                                        onChange={(event) =>
                                            form.setData(
                                                'teacher_last_name',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field
                                    label="Specialization"
                                    error={error('specialization')}
                                >
                                    <Input
                                        value={form.data.specialization}
                                        onChange={(event) =>
                                            form.setData(
                                                'specialization',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field
                                    label="Position"
                                    error={error('position')}
                                >
                                    <Input
                                        value={form.data.position}
                                        onChange={(event) =>
                                            form.setData(
                                                'position',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Separator />
                <div className="flex justify-end gap-2">
                    <Button asChild variant="outline">
                        <Link href="/admin/users">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={form.processing}>
                        <Save className="size-4" />
                        Save User
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
    error?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            {error}
        </div>
    );
}
