import { Card as PrimeCard } from 'primereact/card';

import type { Summary } from './types';
import { formatPercent } from './utils';

type TeacherSummaryCardsProps = {
    summary: Summary;
};

export function TeacherSummaryCards({ summary }: TeacherSummaryCardsProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <PrimeCard className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                <div className="grid gap-1">
                    <p className="text-sm text-muted-foreground">Students</p>
                    <h2 className="text-2xl font-semibold">
                        {summary.students_count}
                    </h2>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    {formatPercent(summary.average_progress)} average progress
                </div>
            </PrimeCard>
            <PrimeCard className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                <div className="grid gap-1">
                    <p className="text-sm text-muted-foreground">Lessons</p>
                    <h2 className="text-2xl font-semibold">
                        {summary.lessons_count}
                    </h2>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    {formatPercent(summary.average_lesson_score)} average score
                </div>
            </PrimeCard>
            <PrimeCard className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                <div className="grid gap-1">
                    <p className="text-sm text-muted-foreground">
                        Pretest Average
                    </p>
                    <h2 className="text-2xl font-semibold">
                        {formatPercent(summary.average_pretest)}
                    </h2>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    Across submitted attempts
                </div>
            </PrimeCard>
            <PrimeCard className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                <div className="grid gap-1">
                    <p className="text-sm text-muted-foreground">
                        Posttest Average
                    </p>
                    <h2 className="text-2xl font-semibold">
                        {formatPercent(summary.average_posttest)}
                    </h2>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    Across submitted attempts
                </div>
            </PrimeCard>
        </section>
    );
}
