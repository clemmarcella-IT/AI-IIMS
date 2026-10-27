import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button as PrimeButton } from 'primereact/button';
import { Card as PrimeCard } from 'primereact/card';

import type { ActivityAnswerReview } from '@/components/teacher/lessons/types';
import {
    formatActivityType,
    formatAnswerValue,
    formatDate,
    formatPercent,
    formatScoreValue,
} from '@/components/teacher/lessons/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard as teacherDashboard } from '@/routes/teacher';

type ReviewStudent = {
    id: number;
    student_code: string;
    name: string;
    grade_level: string;
    section: string;
};

type ReviewLesson = {
    id: number;
    title: string;
    subject: string | null;
    topic: string | null;
};

type ReviewSummary = {
    answered_count: number;
    total_activities: number;
    correct_count: number;
    needs_review_count: number;
    score: number;
    total_score: number;
    score_percentage: number | null;
};

type TeacherActivityReviewProps = {
    student: ReviewStudent;
    lesson: ReviewLesson;
    summary: ReviewSummary;
    activityAnswers: ActivityAnswerReview[];
};

const resultLabel = (answer: ActivityAnswerReview) => {
    if (!answer.has_answer) {
        return 'Not submitted';
    }

    if (answer.is_correct === true) {
        return 'Correct';
    }

    if (answer.is_correct === false) {
        return 'Needs work';
    }

    return 'Needs review';
};

const resultClassName = (answer: ActivityAnswerReview) => {
    if (!answer.has_answer) {
        return 'border-muted bg-muted/40 text-muted-foreground';
    }

    if (answer.is_correct === true) {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300';
    }

    if (answer.is_correct === false) {
        return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300';
    }

    return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300';
};

export default function TeacherActivityReview({
    student,
    lesson,
    summary,
    activityAnswers,
}: TeacherActivityReviewProps) {
    return (
        <>
            <Head title={`${student.name} - ${lesson.title}`} />

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <PrimeButton
                                type="button"
                                outlined
                                onClick={() =>
                                    router.visit('/teacher/activities')
                                }
                            >
                                <ArrowLeft
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Submissions
                            </PrimeButton>

                            <div className="mt-5">
                                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    {student.name}
                                </h1>
                                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                    {student.student_code} - Grade{' '}
                                    {student.grade_level} - Section{' '}
                                    {student.section}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground sm:text-right">
                            <div className="font-medium text-foreground">
                                {lesson.title}
                            </div>
                            <div>{lesson.subject ?? 'No subject'}</div>
                            <div>{lesson.topic ?? 'No topic'}</div>
                        </div>
                    </div>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <PrimeCard className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                            <p className="text-sm text-muted-foreground">
                                Answered
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold">
                                {summary.answered_count}/
                                {summary.total_activities}
                            </h2>
                        </PrimeCard>
                        <PrimeCard className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                            <p className="text-sm text-muted-foreground">
                                Correct
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold">
                                {summary.correct_count}
                            </h2>
                        </PrimeCard>
                        <PrimeCard className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                            <p className="text-sm text-muted-foreground">
                                Needs Review
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold">
                                {summary.needs_review_count}
                            </h2>
                        </PrimeCard>
                        <PrimeCard className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                            <p className="text-sm text-muted-foreground">
                                Score
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold">
                                {formatScoreValue(summary.score)}/
                                {formatScoreValue(summary.total_score)}
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {formatPercent(summary.score_percentage)}
                            </p>
                        </PrimeCard>
                    </section>

                    <PrimeCard className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                        <Table className="min-w-[76rem]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Activity</TableHead>
                                    <TableHead>Answer</TableHead>
                                    <TableHead>Correct Answer</TableHead>
                                    <TableHead>Result</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Feedback</TableHead>
                                    <TableHead>Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activityAnswers.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No activities found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activityAnswers.map((answer) => (
                                        <TableRow key={answer.activity_id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {answer.activity_title}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatActivityType(
                                                        answer.activity_type,
                                                    )}
                                                </div>
                                                {answer.activity_instruction && (
                                                    <div className="mt-1 max-w-xs text-xs text-muted-foreground">
                                                        {
                                                            answer.activity_instruction
                                                        }
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs text-sm whitespace-pre-wrap">
                                                    {answer.has_answer
                                                        ? formatAnswerValue(
                                                              answer.answer,
                                                          )
                                                        : 'Not submitted'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs text-sm whitespace-pre-wrap">
                                                    {formatAnswerValue(
                                                        answer.correct_answer,
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${resultClassName(
                                                        answer,
                                                    )}`}
                                                >
                                                    {resultLabel(answer)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {answer.score === null
                                                    ? 'N/A'
                                                    : formatScoreValue(
                                                          answer.score,
                                                      )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs text-sm whitespace-pre-wrap">
                                                    {answer.feedback ?? 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(
                                                    answer.submitted_at,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </PrimeCard>
                </div>
            </div>
        </>
    );
}

TeacherActivityReview.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: teacherDashboard(),
        },
        {
            title: 'Submissions',
            href: '/teacher/activities',
        },
        {
            title: 'Review',
            href: '#',
        },
    ],
};
