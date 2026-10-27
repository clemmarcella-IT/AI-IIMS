import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';

import { TablePagination } from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePagination } from '@/hooks/use-pagination';

import type { Student } from './types';
import { formatPercent } from './utils';

type StudentsTableProps = {
    students: Student[];
    onDeleteStudent: (student: Student) => void;
    onEditStudent: (student: Student) => void;
};

export function StudentsTable({
    students,
    onDeleteStudent,
    onEditStudent,
}: StudentsTableProps) {
    const {
        currentPage,
        from,
        pageCount,
        pageItems: paginatedStudents,
        setNextPage,
        setPreviousPage,
        to,
        total,
    } = usePagination(students);

    return (
        <div className="grid gap-4">
            <Table className="min-w-[54rem]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Lesson Score</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Pretest</TableHead>
                        <TableHead>Posttest</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedStudents.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No matching records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedStudents.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <div className="font-medium">
                                        {student.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {student.student_code}
                                    </div>
                                </TableCell>
                                <TableCell>{student.grade_level}</TableCell>
                                <TableCell>{student.section}</TableCell>
                                <TableCell>
                                    {formatPercent(student.average_progress)}
                                </TableCell>
                                <TableCell>
                                    {formatPercent(
                                        student.average_lesson_score,
                                    )}
                                </TableCell>
                                <TableCell>
                                    {student.completed_lessons}
                                </TableCell>
                                <TableCell>
                                    {formatPercent(student.pretest_percentage)}
                                </TableCell>
                                <TableCell>
                                    {formatPercent(student.posttest_percentage)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    aria-label={`Open actions for ${student.name}`}
                                                >
                                                    <MoreHorizontal
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-36"
                                            >
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onSelect={() =>
                                                        onEditStudent(student)
                                                    }
                                                >
                                                    <Edit
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    variant="destructive"
                                                    onSelect={() =>
                                                        onDeleteStudent(student)
                                                    }
                                                >
                                                    <Trash2
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
        </div>
    );
}
