import { Head } from '@inertiajs/react';
import { Download, FileSpreadsheet } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type ReportsProps = {
    summary: {
        students: number;
        lessons: number;
        export_fields: string[];
    };
};

export default function AdminReportsIndex({ summary }: ReportsProps) {
    return (
        <>
            <Head title="Research Reports" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Research Reports
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                Export student performance data for academic and
                                research analysis.
                            </p>
                        </div>
                        <Button asChild>
                            <a href="/admin/reports/export">
                                <Download className="size-4" />
                                Export Research Data
                            </a>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <FileSpreadsheet className="size-5" />
                                </span>
                                <div>
                                    <CardTitle>CSV Export</CardTitle>
                                    <CardDescription>
                                        Excel-compatible research dataset.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-lg border p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Students
                                    </div>
                                    <div className="mt-1 text-2xl font-semibold">
                                        {summary.students}
                                    </div>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Lessons
                                    </div>
                                    <div className="mt-1 text-2xl font-semibold">
                                        {summary.lessons}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h2 className="font-medium">Included fields</h2>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {summary.export_fields.map((field) => (
                                        <Badge key={field} variant="secondary">
                                            {field}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
                                Use this export for academic and research
                                analysis. Confirm consent status before using
                                student-level records in formal reporting.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminReportsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Reports',
            href: '/admin/reports',
        },
    ],
};
