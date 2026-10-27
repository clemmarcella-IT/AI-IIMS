import { router } from '@inertiajs/react';
import { Eye } from 'lucide-react';

import { TablePagination } from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePagination } from '@/hooks/use-pagination';

import type { ActivityAnswerSummary } from './types';
import { formatDate, formatPercent, formatScoreValue } from './utils';

type ActivityAnswersTableProps = {
    activityAnswers: ActivityAnswerSummary[];
};

const reviewSummary = (summary: ActivityAnswerSummary) => {
    router.visit(summary.review_url);
};

export function ActivityAnswersTable({
    activityAnswers,
}: ActivityAnswersTableProps) {
    const {
        currentPage,
        from,
        pageCount,
        pageItems: paginatedActivityAnswers,
        setNextPage,
        setPreviousPage,
        to,
        total,
    } = usePagination(activityAnswers);

    return (
        <div className="grid gap-4">
            <Table className="min-w-[64rem]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Lesson</TableHead>
                        <TableHead>Answered</TableHead>
                        <TableHead>Correct</TableHead>
                        <TableHead>Needs Review</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Latest Submission</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedActivityAnswers.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No matching records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedActivityAnswers.map((summary) => (
                            <TableRow
                                key={summary.id}
                                className="cursor-pointer"
                                onClick={() => reviewSummary(summary)}
                            >
                                <TableCell>
                                    <div className="font-medium">
                                        {summary.student_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {summary.student_code ?? 'N/A'}
                                    </div>
                                </TableCell>
                                <TableCell>{summary.lesson_title}</TableCell>
                                <TableCell>
                                    {summary.answered_count}/
                                    {summary.total_activities}
                                </TableCell>
                                <TableCell>{summary.correct_count}</TableCell>
                                <TableCell>
                                    {summary.needs_review_count}
                                </TableCell>
                                <TableCell>
                                    {formatScoreValue(summary.score)}/
                                    {formatScoreValue(summary.total_score)}
                                </TableCell>
                                <TableCell>
                                    {formatPercent(summary.score_percentage)}
                                </TableCell>
                                <TableCell>
                                    {formatDate(summary.latest_submitted_at)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                reviewSummary(summary);
                                            }}
                                            aria-label={`Review ${summary.student_name}'s answers for ${summary.lesson_title}`}
                                        >
                                            <Eye
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                            Review
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
        </div>
    );
}
