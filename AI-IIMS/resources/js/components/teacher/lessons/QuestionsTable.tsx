import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';

import { TablePagination } from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
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

import type { LessonQuestion } from './types';
import { formatDate } from './utils';

type QuestionsTableProps = {
    questions: LessonQuestion[];
    onDeleteQuestion: (question: LessonQuestion) => void;
    onEditQuestion: (question: LessonQuestion) => void;
};

export function QuestionsTable({
    questions,
    onDeleteQuestion,
    onEditQuestion,
}: QuestionsTableProps) {
    const {
        currentPage,
        from,
        pageCount,
        pageItems: paginatedQuestions,
        setNextPage,
        setPreviousPage,
        to,
        total,
    } = usePagination(questions);

    return (
        <div className="grid gap-4">
            <Table className="min-w-[52rem]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Quiz Item</TableHead>
                        <TableHead>Lesson</TableHead>
                        <TableHead>Correct</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedQuestions.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No matching records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedQuestions.map((question) => (
                            <TableRow key={question.id}>
                                <TableCell>
                                    <div className="max-w-lg truncate font-medium">
                                        {question.question_text}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        A: {question.option_a} / B:{' '}
                                        {question.option_b}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {question.lesson_title ?? 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {question.correct_answer}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {formatDate(question.updated_at)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    aria-label="Open quiz item actions"
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
                                                        onEditQuestion(question)
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
                                                        onDeleteQuestion(
                                                            question,
                                                        )
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
