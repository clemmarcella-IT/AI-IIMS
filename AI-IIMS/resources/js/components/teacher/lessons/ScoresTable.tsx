import { TablePagination } from '@/components/table-pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePagination } from '@/hooks/use-pagination';

import type { Score } from './types';
import {
    formatDate,
    formatPercent,
    formatScoreType,
    formatScoreValue,
} from './utils';

type ScoresTableProps = {
    scores: Score[];
};

export function ScoresTable({ scores }: ScoresTableProps) {
    const {
        currentPage,
        from,
        pageCount,
        pageItems: paginatedScores,
        setNextPage,
        setPreviousPage,
        to,
        total,
    } = usePagination(scores);

    return (
        <div className="grid gap-4">
            <Table className="min-w-[54rem]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Lesson</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Submitted</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedScores.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No matching records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedScores.map((score) => (
                            <TableRow key={score.id}>
                                <TableCell>
                                    <div className="font-medium">
                                        {score.student_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {score.student_code ?? 'N/A'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {formatScoreType(score.score_type)}
                                </TableCell>
                                <TableCell>
                                    {score.lesson_title ?? 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {formatScoreValue(score.score)}/
                                    {formatScoreValue(score.total_items)}
                                </TableCell>
                                <TableCell>
                                    {formatPercent(score.percentage)}
                                </TableCell>
                                <TableCell>
                                    {formatDate(score.submitted_at)}
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
