import {
    Copy,
    Edit,
    Eye,
    MoreHorizontal,
    RotateCcw,
    Search,
    SignalLow,
    Trash2,
    WifiOff,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { TablePagination } from '@/components/table-pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePagination } from '@/hooks/use-pagination';

import { difficultyClassNames, statusClassNames } from './constants';
import type { Lesson } from './types';
import { formatDifficulty, formatPercent } from './utils';

type NetworkConnection = {
    effectiveType?: string;
    saveData?: boolean;
    addEventListener?: (type: 'change', listener: () => void) => void;
    removeEventListener?: (type: 'change', listener: () => void) => void;
};

type NetworkState = {
    online: boolean;
    effectiveType?: string;
    saveData: boolean;
    constrained: boolean;
};

const constrainedConnectionTypes = new Set(['slow-2g', '2g', '3g']);

const getNetworkConnection = () => {
    if (typeof navigator === 'undefined') {
        return undefined;
    }

    return (navigator as Navigator & { connection?: NetworkConnection })
        .connection;
};

const readNetworkState = (): NetworkState => {
    const connection = getNetworkConnection();
    const effectiveType = connection?.effectiveType;
    const saveData = connection?.saveData ?? false;

    return {
        online: typeof navigator === 'undefined' ? true : navigator.onLine,
        effectiveType,
        saveData,
        constrained:
            saveData || constrainedConnectionTypes.has(effectiveType ?? ''),
    };
};

type LessonsTableProps = {
    lessons: Lesson[];
    onBatchDeleteLessons: (lessons: Lesson[]) => void;
    onBatchRepublishLessons: (lessons: Lesson[]) => void;
    onDeleteLesson: (lesson: Lesson) => void;
    onDuplicateLesson: (lesson: Lesson) => void;
    onEditLesson: (lesson: Lesson) => void;
    onViewLesson: (lesson: Lesson) => void;
};

export function LessonsTable({
    lessons,
    onBatchDeleteLessons,
    onBatchRepublishLessons,
    onDeleteLesson,
    onDuplicateLesson,
    onEditLesson,
    onViewLesson,
}: LessonsTableProps) {
    const [search, setSearch] = useState('');
    const [networkState, setNetworkState] = useState(readNetworkState);
    const [selectedLessons, setSelectedLessons] = useState<Lesson[]>([]);
    const lessonIds = useMemo(
        () => new Set(lessons.map((lesson) => lesson.id)),
        [lessons],
    );
    const activeSelectedLessons = useMemo(
        () => selectedLessons.filter((lesson) => lessonIds.has(lesson.id)),
        [lessonIds, selectedLessons],
    );
    const publishedCount = lessons.filter(
        (lesson) => lesson.is_published,
    ).length;
    const draftCount = lessons.length - publishedCount;
    const selectedCount = activeSelectedLessons.length;

    const filteredLessons = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return lessons;
        }

        return lessons.filter((lesson) =>
            [
                lesson.title,
                lesson.subject ?? '',
                lesson.topic ?? '',
                lesson.content ?? '',
                lesson.difficulty_level,
                lesson.is_published ? 'published' : 'draft',
                formatPercent(lesson.average_progress),
                formatPercent(lesson.average_score),
            ]
                .join(' ')
                .toLowerCase()
                .includes(query),
        );
    }, [lessons, search]);

    const {
        currentPage,
        from,
        pageCount,
        pageItems: paginatedLessons,
        setNextPage,
        setPreviousPage,
        to,
        total,
    } = usePagination(filteredLessons);
    const selectedIds = useMemo(
        () => new Set(activeSelectedLessons.map((lesson) => lesson.id)),
        [activeSelectedLessons],
    );
    const allPageItemsSelected =
        paginatedLessons.length > 0 &&
        paginatedLessons.every((lesson) => selectedIds.has(lesson.id));
    const somePageItemsSelected = paginatedLessons.some((lesson) =>
        selectedIds.has(lesson.id),
    );
    const isOffline = !networkState.online;
    const showNetworkNotice = isOffline || networkState.constrained;
    const NetworkIcon = isOffline ? WifiOff : SignalLow;
    const networkNoticeTitle = isOffline
        ? 'Offline mode'
        : 'Slow connection detected';
    const networkNoticeDescription = isOffline
        ? 'Search, selection, and lesson preview still use the loaded data. Editing, deleting, duplicating, and republishing need the connection to return.'
        : `This lesson list keeps search and paging local for low-bandwidth classrooms. ${networkState.saveData ? 'Data saver is on.' : `Connection reports ${networkState.effectiveType ?? 'limited speed'}.`}`;

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const updateNetworkState = () => setNetworkState(readNetworkState());
        const connection = getNetworkConnection();

        window.addEventListener('online', updateNetworkState);
        window.addEventListener('offline', updateNetworkState);
        connection?.addEventListener?.('change', updateNetworkState);

        return () => {
            window.removeEventListener('online', updateNetworkState);
            window.removeEventListener('offline', updateNetworkState);
            connection?.removeEventListener?.('change', updateNetworkState);
        };
    }, []);

    const toggleLessonSelection = (lesson: Lesson, checked: boolean) => {
        setSelectedLessons((currentLessons) => {
            const activeCurrentLessons = currentLessons.filter((item) =>
                lessonIds.has(item.id),
            );

            if (checked) {
                return selectedIds.has(lesson.id)
                    ? activeCurrentLessons
                    : [...activeCurrentLessons, lesson];
            }

            return activeCurrentLessons.filter((item) => item.id !== lesson.id);
        });
    };

    const togglePageSelection = (checked: boolean) => {
        setSelectedLessons((currentLessons) => {
            const activeCurrentLessons = currentLessons.filter((lesson) =>
                lessonIds.has(lesson.id),
            );

            if (checked) {
                const currentIds = new Set(
                    activeCurrentLessons.map((lesson) => lesson.id),
                );

                return [
                    ...activeCurrentLessons,
                    ...paginatedLessons.filter(
                        (lesson) => !currentIds.has(lesson.id),
                    ),
                ];
            }

            const pageIds = new Set(
                paginatedLessons.map((lesson) => lesson.id),
            );

            return activeCurrentLessons.filter(
                (lesson) => !pageIds.has(lesson.id),
            );
        });
    };

    const actionsBody = (lesson: Lesson) => (
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Open actions for ${lesson.title}`}
                    >
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => onViewLesson(lesson)}
                    >
                        <Eye className="size-4" aria-hidden="true" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => onDuplicateLesson(lesson)}
                        disabled={isOffline}
                    >
                        <Copy className="size-4" aria-hidden="true" />
                        Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => onEditLesson(lesson)}
                        disabled={isOffline}
                    >
                        <Edit className="size-4" aria-hidden="true" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        variant="destructive"
                        onSelect={() => onDeleteLesson(lesson)}
                        disabled={isOffline}
                    >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    return (
        <div className="grid gap-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <h3 className="text-base font-semibold">All lessons</h3>
                    <p className="text-sm text-muted-foreground">
                        Published and draft lessons are shown here.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge
                        className={statusClassNames.published}
                        variant="outline"
                    >
                        {publishedCount} Published
                    </Badge>
                    <Badge className={statusClassNames.draft} variant="outline">
                        {draftCount} Draft
                    </Badge>
                </div>
            </div>

            {showNetworkNotice && (
                <Alert className="border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                    <NetworkIcon className="size-4" aria-hidden="true" />
                    <AlertTitle>{networkNoticeTitle}</AlertTitle>
                    <AlertDescription className="text-amber-900/80 dark:text-amber-100/80">
                        {networkNoticeDescription}
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        type="search"
                        aria-label="Search lessons"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search lessons..."
                        className="w-full pl-9"
                    />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <span className="text-sm text-muted-foreground">
                        {selectedCount} selected
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={selectedCount === 0 || isOffline}
                        onClick={() =>
                            onBatchRepublishLessons(activeSelectedLessons)
                        }
                    >
                        <RotateCcw className="size-4" aria-hidden="true" />
                        Republish lessons
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={selectedCount === 0 || isOffline}
                        onClick={() =>
                            onBatchDeleteLessons(activeSelectedLessons)
                        }
                    >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Batch delete
                    </Button>
                </div>
            </div>

            <Table className="min-w-[58rem]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10">
                            <Checkbox
                                aria-label="Select visible lessons"
                                checked={
                                    allPageItemsSelected
                                        ? true
                                        : somePageItemsSelected
                                          ? 'indeterminate'
                                          : false
                                }
                                onCheckedChange={(checked) =>
                                    togglePageSelection(checked === true)
                                }
                            />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Quiz Items</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedLessons.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No matching records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedLessons.map((lesson) => (
                            <TableRow
                                key={lesson.id}
                                data-state={
                                    selectedIds.has(lesson.id)
                                        ? 'selected'
                                        : undefined
                                }
                            >
                                <TableCell>
                                    <Checkbox
                                        aria-label={`Select ${lesson.title}`}
                                        checked={selectedIds.has(lesson.id)}
                                        onCheckedChange={(checked) =>
                                            toggleLessonSelection(
                                                lesson,
                                                checked === true,
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">
                                        {lesson.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {lesson.topic ?? 'N/A'}
                                    </div>
                                </TableCell>
                                <TableCell>{lesson.subject ?? 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            difficultyClassNames[
                                                lesson.difficulty_level
                                            ]
                                        }
                                        variant="outline"
                                    >
                                        {formatDifficulty(
                                            lesson.difficulty_level,
                                        )}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            lesson.is_published
                                                ? statusClassNames.published
                                                : statusClassNames.draft
                                        }
                                        variant="outline"
                                    >
                                        {lesson.is_published
                                            ? 'Published'
                                            : 'Draft'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{lesson.questions_count}</TableCell>
                                <TableCell>
                                    {formatPercent(lesson.average_progress)}
                                </TableCell>
                                <TableCell>
                                    {formatPercent(lesson.average_score)}
                                </TableCell>
                                <TableCell>{actionsBody(lesson)}</TableCell>
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
