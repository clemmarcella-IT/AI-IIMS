import { Button } from '@/components/ui/button';

type TablePaginationProps = {
    currentPage: number;
    from: number;
    onNext: () => void;
    onPrevious: () => void;
    pageCount: number;
    to: number;
    total: number;
};

export function TablePagination({
    currentPage,
    from,
    onNext,
    onPrevious,
    pageCount,
    to,
    total,
}: TablePaginationProps) {
    return (
        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
                Showing {from}-{to} of {total}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onPrevious}
                    disabled={currentPage <= 1}
                >
                    Previous
                </Button>
                <span className="min-w-20 text-center">
                    Page {currentPage} of {pageCount}
                </span>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onNext}
                    disabled={currentPage >= pageCount}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
