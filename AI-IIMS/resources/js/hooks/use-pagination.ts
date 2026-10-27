import { useMemo, useState } from 'react';

const DEFAULT_PAGE_SIZE = 10;

export function usePagination<T>(
    items: T[],
    pageSize: number = DEFAULT_PAGE_SIZE,
) {
    const [page, setPage] = useState(1);
    const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(page, pageCount);
    const start = (currentPage - 1) * pageSize;
    const pageItems = useMemo(
        () => items.slice(start, start + pageSize),
        [items, pageSize, start],
    );

    return {
        currentPage,
        from: items.length === 0 ? 0 : start + 1,
        pageCount,
        pageItems,
        setNextPage: () => setPage((value) => Math.min(value + 1, pageCount)),
        setPreviousPage: () => setPage((value) => Math.max(value - 1, 1)),
        to: Math.min(start + pageSize, items.length),
        total: items.length,
    };
}
