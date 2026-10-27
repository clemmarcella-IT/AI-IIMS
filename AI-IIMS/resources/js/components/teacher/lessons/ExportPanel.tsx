import { Download } from 'lucide-react';
import { Button as PrimeButton } from 'primereact/button';

import type { Summary } from './types';

type ExportPanelProps = {
    scoresCount: number;
    summary: Summary;
};

export function ExportPanel({ scoresCount, summary }: ExportPanelProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="rounded-lg border p-5">
                <h3 className="font-semibold">Export teacher data</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Download a CSV containing lesson, student progress, score,
                    and question data.
                </p>
                <PrimeButton
                    type="button"
                    className="mt-5"
                    onClick={() => {
                        window.location.href = '/teacher/export';
                    }}
                >
                    <Download className="size-4" aria-hidden="true" />
                    Export CSV
                </PrimeButton>
            </div>
            <div className="grid gap-3 rounded-lg border p-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">
                        {summary.students_count}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium">{summary.lessons_count}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Quiz Items</span>
                    <span className="font-medium">
                        {summary.questions_count}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Scores</span>
                    <span className="font-medium">{scoresCount}</span>
                </div>
            </div>
        </div>
    );
}
