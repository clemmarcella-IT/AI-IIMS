import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function StudentPage({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <main
            className={cn(
                'student-surface flex min-h-full flex-1 flex-col gap-6 overflow-x-clip p-4 sm:p-6 lg:p-8',
                className,
            )}
        >
            {children}
        </main>
    );
}

export function StudentPageHeader({
    eyebrow,
    icon: Icon,
    title,
    description,
    action,
    children,
    className,
}: {
    eyebrow: string;
    icon: LucideIcon;
    title: ReactNode;
    description: ReactNode;
    action?: ReactNode;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={cn('student-panel student-reveal p-5 sm:p-6', className)}
        >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl min-w-0">
                    <div className="student-eyebrow">
                        <Icon className="size-3.5" aria-hidden="true" />
                        {eyebrow}
                    </div>
                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                        {title}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        {description}
                    </p>
                    {children}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
        </section>
    );
}

export function StudentProgress({
    value,
    label,
    detail,
    className,
}: {
    value: number;
    label: string;
    detail?: string;
    className?: string;
}) {
    const safeValue = Math.max(0, Math.min(100, value));

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{label}</span>
                <span className="font-semibold text-primary tabular-nums">
                    {Math.round(safeValue)}%
                </span>
            </div>
            <Progress value={safeValue} className="h-2.5 bg-primary/10" />
            {detail && (
                <p className="text-xs leading-5 text-muted-foreground">
                    {detail}
                </p>
            )}
        </div>
    );
}

export function StudentStatus({
    children,
    tone = 'neutral',
    className,
}: {
    children: ReactNode;
    tone?: 'neutral' | 'info' | 'success' | 'warning';
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
                tone === 'success' &&
                    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200',
                tone === 'info' &&
                    'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/70 dark:text-sky-200',
                tone === 'warning' &&
                    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/70 dark:text-amber-200',
                tone === 'neutral' &&
                    'border-border bg-muted/60 text-muted-foreground',
                className,
            )}
        >
            {children}
        </span>
    );
}

export function StudentEmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="student-empty-state">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {description}
            </p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
