import { Head, router, useForm } from '@inertiajs/react';
import {
    BarChart3,
    ClipboardCheck,
    FileQuestion,
    Plus,
    Search,
    UserPlus,
    Users,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { ActivityAnswersTable } from '@/components/teacher/lessons/ActivityAnswersTable';
import { emptyQuestionForm } from '@/components/teacher/lessons/constants';
import { DataEmptyState } from '@/components/teacher/lessons/DataEmptyState';
import { ExportPanel } from '@/components/teacher/lessons/ExportPanel';
import { LessonPreviewDialog } from '@/components/teacher/lessons/LessonPreviewDialog';
import { LessonsPanel } from '@/components/teacher/lessons/LessonsPanel';
import { QuestionFormDialog } from '@/components/teacher/lessons/QuestionFormDialog';
import { QuestionsTable } from '@/components/teacher/lessons/QuestionsTable';
import { ScoresTable } from '@/components/teacher/lessons/ScoresTable';
import { StudentsTable } from '@/components/teacher/lessons/StudentsTable';
import type {
    ActivityAnswerSummary,
    Lesson,
    LessonQuestion,
    Panel,
    QuestionFormData,
    Score,
    Student,
    Summary,
} from '@/components/teacher/lessons/types';
import {
    formatPercent,
    lessonUrl,
    questionUrl,
} from '@/components/teacher/lessons/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard as teacherDashboard } from '@/routes/teacher';
import { index as teacherLessons } from '@/routes/teacher/lessons';

type TeacherLessonsIndexProps = {
    lessons?: Lesson[];
    students?: Student[];
    questions?: LessonQuestion[];
    scores?: Score[];
    activityAnswerSummaries?: ActivityAnswerSummary[];
    initialPanel?: Panel;
    summary?: Summary;
};

type DeleteTarget =
    | { type: 'lesson'; item: Lesson }
    | { type: 'lessons'; items: Lesson[] }
    | { type: 'student'; item: Student }
    | { type: 'question'; item: LessonQuestion };

const defaultSummary: Summary = {
    students_count: 0,
    lessons_count: 0,
    questions_count: 0,
    average_progress: null,
    average_pretest: null,
    average_posttest: null,
    average_lesson_score: null,
};

const allSubjectsValue = '__all_subjects__';

const subjectLabel = (subject: string | null) => subject?.trim() || 'General';

const pageMeta: Record<
    Panel,
    {
        description: string;
        href: string;
        searchPlaceholder: string;
        title: string;
    }
> = {
    students: {
        title: 'Students',
        description: 'Review student accounts, progress, and test performance.',
        href: '/teacher/students',
        searchPlaceholder: 'Search students...',
    },
    lessons: {
        title: 'Lessons',
        description:
            'Manage lesson drafts, published lessons, progress, and quick actions.',
        href: '/teacher/lessons',
        searchPlaceholder: 'Search lessons...',
    },
    questions: {
        title: 'Quiz Items',
        description: 'Manage end-of-lesson mini quiz items for lessons.',
        href: '/teacher/questions',
        searchPlaceholder: 'Search quiz items...',
    },
    scores: {
        title: 'Scores',
        description: 'View submitted pretest, posttest, and lesson scores.',
        href: '/teacher/results',
        searchPlaceholder: 'Search scores...',
    },
    activity_answers: {
        title: 'Submissions',
        description: 'Review student activity submissions by lesson.',
        href: '/teacher/activities',
        searchPlaceholder: 'Search submissions...',
    },
    export: {
        title: 'Export',
        description: 'Download teacher workspace data for offline review.',
        href: '/teacher/export',
        searchPlaceholder: 'Search export data...',
    },
};

export default function TeacherLessonsIndex({
    lessons = [],
    students = [],
    questions = [],
    scores = [],
    activityAnswerSummaries = [],
    initialPanel = 'lessons',
    summary = defaultSummary,
}: TeacherLessonsIndexProps) {
    const currentPage = pageMeta[initialPanel] ?? pageMeta.lessons;
    const [search, setSearch] = useState('');
    const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
    const [subjectFilter, setSubjectFilter] = useState(allSubjectsValue);
    const [editingQuestion, setEditingQuestion] =
        useState<LessonQuestion | null>(null);
    const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
    const [republishTarget, setRepublishTarget] = useState<Lesson[] | null>(
        null,
    );

    const questionForm = useForm<QuestionFormData>({
        ...emptyQuestionForm,
        lesson_id: lessons[0]?.id.toString() ?? '',
    });

    const query = search.trim().toLowerCase();

    const filteredStudents = useMemo(() => {
        if (!query) {
            return students;
        }

        return students.filter((student) =>
            [
                student.student_code,
                student.name,
                student.grade_level,
                student.section,
                formatPercent(student.average_progress),
                formatPercent(student.average_lesson_score),
                formatPercent(student.pretest_percentage),
                formatPercent(student.posttest_percentage),
            ]
                .join(' ')
                .toLowerCase()
                .includes(query),
        );
    }, [query, students]);

    const filteredQuestions = useMemo(() => {
        if (!query) {
            return questions;
        }

        return questions.filter((question) =>
            [
                question.lesson_title ?? '',
                question.question_text,
                question.option_a,
                question.option_b,
                question.option_c,
                question.option_d,
                question.correct_answer,
            ]
                .join(' ')
                .toLowerCase()
                .includes(query),
        );
    }, [query, questions]);

    const filteredScores = useMemo(() => {
        if (!query) {
            return scores;
        }

        return scores.filter((score) =>
            [
                score.student_code ?? '',
                score.student_name,
                score.score_type,
                score.lesson_title ?? '',
                score.score,
                score.total_items,
                score.percentage,
            ]
                .join(' ')
                .toLowerCase()
                .includes(query),
        );
    }, [query, scores]);

    const subjectOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    activityAnswerSummaries.map((summary) =>
                        subjectLabel(summary.lesson_subject),
                    ),
                ),
            ).sort((firstSubject, secondSubject) =>
                firstSubject.localeCompare(secondSubject),
            ),
        [activityAnswerSummaries],
    );

    const filteredActivityAnswerSummaries = useMemo(() => {
        return activityAnswerSummaries.filter((summary) => {
            const matchesSubject =
                subjectFilter === allSubjectsValue ||
                subjectLabel(summary.lesson_subject) === subjectFilter;

            if (!matchesSubject) {
                return false;
            }

            if (!query) {
                return true;
            }

            return [
                summary.student_code ?? '',
                summary.student_name,
                subjectLabel(summary.lesson_subject),
                summary.lesson_title,
                summary.answered_count,
                summary.total_activities,
                summary.correct_count,
                summary.needs_review_count,
                summary.score,
                summary.total_score,
                formatPercent(summary.score_percentage),
            ]
                .join(' ')
                .toLowerCase()
                .includes(query);
        });
    }, [activityAnswerSummaries, query, subjectFilter]);

    const setQuestionFormData = <K extends keyof QuestionFormData>(
        key: K,
        value: QuestionFormData[K],
    ) => {
        questionForm.setData((currentData) => ({
            ...currentData,
            [key]: value,
        }));
    };

    const createLesson = () => {
        router.visit('/teacher/lessons/create');
    };

    const createStudent = () => {
        router.visit('/teacher/students/create');
    };

    const editLesson = (lesson: Lesson) => {
        router.visit(`/teacher/lessons/${lesson.id}/edit`);
    };

    const editStudent = (student: Student) => {
        router.visit(`/teacher/students/${student.id}/edit`);
    };

    const duplicateLesson = (lesson: Lesson) => {
        router.post(
            `/teacher/lessons/${lesson.id}/duplicate`,
            {},
            { preserveScroll: true },
        );
    };

    const deleteLesson = (lesson: Lesson) => {
        setDeleteTarget({ type: 'lesson', item: lesson });
    };

    const batchDeleteLessons = (selectedLessons: Lesson[]) => {
        if (selectedLessons.length === 0) {
            return;
        }

        setDeleteTarget({ type: 'lessons', items: selectedLessons });
    };

    const batchRepublishLessons = (selectedLessons: Lesson[]) => {
        if (selectedLessons.length === 0) {
            return;
        }

        setRepublishTarget(selectedLessons);
    };

    const deleteStudent = (student: Student) => {
        setDeleteTarget({ type: 'student', item: student });
    };

    const resetQuestionForm = () => {
        setEditingQuestion(null);
        questionForm.clearErrors();
        questionForm.setData({
            ...emptyQuestionForm,
            lesson_id: lessons[0]?.id.toString() ?? '',
        });
    };

    const openCreateQuestionDialog = () => {
        resetQuestionForm();
        setIsQuestionFormOpen(true);
    };

    const openEditQuestionDialog = (question: LessonQuestion) => {
        setEditingQuestion(question);
        questionForm.clearErrors();
        questionForm.setData({
            lesson_id: question.lesson_id.toString(),
            question_text: question.question_text,
            option_a: question.option_a,
            option_b: question.option_b,
            option_c: question.option_c,
            option_d: question.option_d,
            correct_answer: question.correct_answer,
            explanation: question.explanation ?? '',
        });
        setIsQuestionFormOpen(true);
    };

    const closeQuestionFormDialog = () => {
        setIsQuestionFormOpen(false);
        resetQuestionForm();
    };

    const changeQuestionFormOpen = (open: boolean) => {
        if (!open) {
            closeQuestionFormDialog();

            return;
        }

        setIsQuestionFormOpen(true);
    };

    const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: closeQuestionFormDialog,
        };

        if (editingQuestion) {
            questionForm.put(questionUrl(editingQuestion), options);

            return;
        }

        questionForm.post('/teacher/questions', options);
    };

    const deleteQuestion = (question: LessonQuestion) => {
        setDeleteTarget({ type: 'question', item: question });
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        if (deleteTarget.type === 'lesson') {
            router.delete(lessonUrl(deleteTarget.item), {
                preserveScroll: true,
                onFinish: () => setDeleteTarget(null),
            });

            return;
        }

        if (deleteTarget.type === 'lessons') {
            router.post(
                '/teacher/lessons/batch-delete',
                {
                    lesson_ids: deleteTarget.items.map((lesson) => lesson.id),
                },
                {
                    preserveScroll: true,
                    onFinish: () => setDeleteTarget(null),
                },
            );

            return;
        }

        if (deleteTarget.type === 'student') {
            router.delete(`/teacher/students/${deleteTarget.item.id}`, {
                preserveScroll: true,
                onFinish: () => setDeleteTarget(null),
            });

            return;
        }

        router.delete(questionUrl(deleteTarget.item), {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    };

    const confirmRepublish = () => {
        if (!republishTarget) {
            return;
        }

        router.post(
            '/teacher/lessons/batch-republish',
            {
                lesson_ids: republishTarget.map((lesson) => lesson.id),
            },
            {
                preserveScroll: true,
                onFinish: () => setRepublishTarget(null),
            },
        );
    };

    const deleteDialogTitle =
        deleteTarget?.type === 'lesson'
            ? 'Delete lesson?'
            : deleteTarget?.type === 'lessons'
              ? 'Delete selected lessons?'
              : deleteTarget?.type === 'student'
                ? 'Delete student?'
                : 'Delete quiz item?';

    const deleteDialogDescription =
        deleteTarget?.type === 'lesson'
            ? 'This will remove the lesson and its related lesson data.'
            : deleteTarget?.type === 'lessons'
              ? 'This will remove the selected lessons and their related lesson data.'
              : deleteTarget?.type === 'student'
                ? 'This will remove the student login and progress records.'
                : 'This will remove this quiz item from the lesson.';

    const deleteTargetName = (
        deleteTarget?.type === 'lesson'
            ? deleteTarget.item.title
            : deleteTarget?.type === 'lessons'
              ? `${deleteTarget.items.length} selected lessons`
              : deleteTarget?.type === 'student'
                ? deleteTarget.item.name
                : deleteTarget?.item.question_text
    )?.trim();

    const deleteTargetContext =
        deleteTarget?.type === 'question' && deleteTarget.item.lesson_title
            ? `Lesson: ${deleteTarget.item.lesson_title}`
            : null;

    const truncatedDeleteTargetName =
        deleteTargetName && deleteTargetName.length > 120
            ? `${deleteTargetName.slice(0, 117)}...`
            : deleteTargetName;

    const isDeleteDialogOpen = deleteTarget !== null;
    const isRepublishDialogOpen = republishTarget !== null;

    const changeDeleteDialogOpen = (open: boolean) => {
        if (!open) {
            setDeleteTarget(null);
        }
    };

    const changeRepublishDialogOpen = (open: boolean) => {
        if (!open) {
            setRepublishTarget(null);
        }
    };

    const pageAction =
        initialPanel === 'students' ? (
            <Button type="button" variant="outline" onClick={createStudent}>
                <UserPlus className="size-4" aria-hidden="true" />
                Add Student
            </Button>
        ) : initialPanel === 'questions' && lessons.length > 0 ? (
            <Button
                type="button"
                variant="outline"
                onClick={openCreateQuestionDialog}
            >
                <FileQuestion className="size-4" aria-hidden="true" />
                Add Quiz Item
            </Button>
        ) : initialPanel === 'lessons' ? (
            <Button type="button" onClick={createLesson}>
                <Plus className="size-4" aria-hidden="true" />
                Create Lesson
            </Button>
        ) : null;

    const pageContent =
        initialPanel === 'students' ? (
            students.length === 0 ? (
                <DataEmptyState
                    icon={Users}
                    title="No students yet"
                    description="Add a student account so they can sign in and take lessons."
                    action={
                        <Button type="button" onClick={createStudent}>
                            <UserPlus className="size-4" aria-hidden="true" />
                            Add Student
                        </Button>
                    }
                />
            ) : (
                <StudentsTable
                    students={filteredStudents}
                    onDeleteStudent={deleteStudent}
                    onEditStudent={editStudent}
                />
            )
        ) : initialPanel === 'questions' ? (
            questions.length === 0 ? (
                <DataEmptyState
                    icon={FileQuestion}
                    title="No quiz items yet"
                    description="Add Mini Quiz activities inside a lesson so students can be assessed."
                    action={
                        lessons.length > 0 ? (
                            <Button
                                type="button"
                                onClick={openCreateQuestionDialog}
                            >
                                <Plus className="size-4" aria-hidden="true" />
                                Add Quiz Item
                            </Button>
                        ) : undefined
                    }
                />
            ) : (
                <QuestionsTable
                    questions={filteredQuestions}
                    onDeleteQuestion={deleteQuestion}
                    onEditQuestion={openEditQuestionDialog}
                />
            )
        ) : initialPanel === 'scores' ? (
            scores.length === 0 ? (
                <DataEmptyState
                    icon={BarChart3}
                    title="No scores yet"
                    description="Submitted pretest and posttest attempts will appear here."
                />
            ) : (
                <ScoresTable scores={filteredScores} />
            )
        ) : initialPanel === 'activity_answers' ? (
            activityAnswerSummaries.length === 0 ? (
                <DataEmptyState
                    icon={ClipboardCheck}
                    title="No submissions yet"
                    description="Student and lesson submissions will appear here for review."
                />
            ) : (
                <ActivityAnswersTable
                    activityAnswers={filteredActivityAnswerSummaries}
                />
            )
        ) : initialPanel === 'export' ? (
            <ExportPanel scoresCount={scores.length} summary={summary} />
        ) : (
            <LessonsPanel
                lessons={lessons}
                sourceLessons={lessons}
                onBatchDeleteLessons={batchDeleteLessons}
                onBatchRepublishLessons={batchRepublishLessons}
                onCreateLesson={createLesson}
                onDeleteLesson={deleteLesson}
                onDuplicateLesson={duplicateLesson}
                onEditLesson={editLesson}
                onViewLesson={setViewingLesson}
            />
        );

    return (
        <>
            <Head title={currentPage.title} />

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex w-full min-w-0 flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                {currentPage.title}
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                {currentPage.description}
                            </p>
                        </div>

                        {pageAction && (
                            <div className="flex flex-col gap-2 sm:flex-row">
                                {pageAction}
                            </div>
                        )}
                    </div>

                    <main className="min-w-0">
                        <Card className="border border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                            <CardContent className="min-w-0">
                                {initialPanel !== 'lessons' && (
                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                                        <div className="relative w-full sm:max-w-md">
                                            <Search
                                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                                aria-hidden="true"
                                            />
                                            <Input
                                                type="search"
                                                aria-label={
                                                    currentPage.searchPlaceholder
                                                }
                                                value={search}
                                                onChange={(event) =>
                                                    setSearch(
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    currentPage.searchPlaceholder
                                                }
                                                className="w-full pl-9"
                                            />
                                        </div>

                                        {initialPanel === 'activity_answers' &&
                                            subjectOptions.length > 0 && (
                                                <Select
                                                    value={subjectFilter}
                                                    onValueChange={
                                                        setSubjectFilter
                                                    }
                                                >
                                                    <SelectTrigger
                                                        aria-label="Filter submissions by subject"
                                                        className="w-full sm:w-56"
                                                    >
                                                        <SelectValue placeholder="Subject" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem
                                                            value={
                                                                allSubjectsValue
                                                            }
                                                        >
                                                            All subjects
                                                        </SelectItem>
                                                        {subjectOptions.map(
                                                            (subject) => (
                                                                <SelectItem
                                                                    key={
                                                                        subject
                                                                    }
                                                                    value={
                                                                        subject
                                                                    }
                                                                >
                                                                    {subject}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                    </div>
                                )}

                                <div className="min-w-0">{pageContent}</div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>

            <QuestionFormDialog
                data={questionForm.data}
                editingQuestion={editingQuestion}
                errors={questionForm.errors}
                lessons={lessons}
                open={isQuestionFormOpen}
                processing={questionForm.processing}
                onOpenChange={changeQuestionFormOpen}
                onSetData={setQuestionFormData}
                onSubmit={submitQuestion}
            />

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={changeDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete{' '}
                            <strong className="font-medium text-foreground">
                                {truncatedDeleteTargetName ?? 'this item'}
                            </strong>
                            . {deleteDialogDescription}
                            {deleteTargetContext && (
                                <span className="mt-2 block">
                                    {deleteTargetContext}
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                            onClick={confirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={isRepublishDialogOpen}
                onOpenChange={changeRepublishDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Republish selected lessons?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will publish and restart{' '}
                            <strong className="font-medium text-foreground">
                                {republishTarget?.length ?? 0} selected lessons
                            </strong>
                            . Student progress, scores, activity answers, and
                            video cue responses for these lessons will be reset.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRepublish}>
                            Republish lessons
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <LessonPreviewDialog
                lesson={viewingLesson}
                onOpenChange={(open) => {
                    if (!open) {
                        setViewingLesson(null);
                    }
                }}
            />
        </>
    );
}

TeacherLessonsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: teacherDashboard(),
        },
        {
            title: 'Teacher Workspace',
            href: teacherLessons(),
        },
    ],
};
