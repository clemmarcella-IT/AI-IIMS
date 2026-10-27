import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePagination } from '@/hooks/use-pagination';

type Role = 'admin' | 'teacher' | 'student';

type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at: string | null;
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

type UsersIndexProps = {
    users: AdminUser[];
    filters: {
        search: string;
        role: string;
    };
};

const roleBadgeVariant: Record<Role, 'destructive' | 'default' | 'secondary'> =
    {
        admin: 'destructive',
        teacher: 'default',
        student: 'secondary',
    };

const profileText = (user: AdminUser) => {
    if (user.role === 'student' && user.student) {
        return `${user.student.student_code} / Grade ${user.student.grade_level} - ${user.student.section}`;
    }

    if (user.role === 'teacher' && user.teacher) {
        return `${user.teacher.employee_no} / ${user.teacher.department ?? 'No department'}`;
    }

    return 'System account';
};

export default function AdminUsersIndex({ users, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? 'all');
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
    const form = useForm({});
    const {
        currentPage,
        from,
        pageCount,
        pageItems: paginatedUsers,
        setNextPage,
        setPreviousPage,
        to,
        total,
    } = usePagination(users);

    // Track whether the user has interacted, so the debounce effect doesn't
    // fire a redundant request on initial mount.
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;

            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                '/admin/users',
                { search, role },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, role]);

    const confirmDelete = () => {
        if (!userToDelete) {
            return;
        }

        form.delete(`/admin/users/${userToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => setUserToDelete(null),
        });
    };

    return (
        <>
            <Head title="User Management" />

            <AlertDialog
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete user?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove {userToDelete?.name}'s account and
                            linked safe-to-delete profile data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={confirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                User Management
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                Manage administrator, teacher, and student
                                access with linked profile records.
                            </p>
                        </div>
                        <Button
                            onClick={() => router.visit('/admin/users/create')}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create User
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>
                                Search accounts and filter by assigned role.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        aria-label="Search users"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-9"
                                        placeholder="Search name, email, code..."
                                    />
                                </div>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All roles
                                        </SelectItem>
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
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Profile</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            roleBadgeVariant[
                                                                user.role
                                                            ]
                                                        }
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {profileText(user)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            aria-label="Edit user"
                                                            onClick={() =>
                                                                router.visit(
                                                                    `/admin/users/${user.id}/edit`,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            aria-label="Delete user"
                                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() =>
                                                                setUserToDelete(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
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

AdminUsersIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Users', href: '/admin/users' },
    ],
};
