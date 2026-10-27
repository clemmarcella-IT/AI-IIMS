import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type DataEmptyStateProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    action?: ReactNode;
};

export function DataEmptyState({
    title,
    description,
    icon: Icon,
    action,
}: DataEmptyStateProps) {
    return (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {description}
            </p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
