import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    ClipboardCheck,
    Flag,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
    StudentPage,
    StudentPageHeader,
    StudentProgress,
    StudentStatus,
} from '@/components/student/student-ui';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type TestType = 'pretest' | 'posttest';
type ChoiceRecord = Record<string, string>;

type TestQuestion = {
    id: number;
    question: string;
    choices: ChoiceRecord | string[];
    points: number;
};

type StudentTest = {
    id: number;
    title: string;
    test_type: TestType;
    subject: string | null;
    topic: string | null;
    questions: TestQuestion[];
};

const getChoices = (choices: ChoiceRecord | string[]) =>
    Array.isArray(choices)
        ? choices.map((label, index) => ({
              value: String.fromCharCode(65 + index),
              label,
          }))
        : Object.entries(choices).map(([value, label]) => ({ value, label }));

export default function StudentTestTake({ test }: { test: StudentTest }) {
    const storageKey = `student-test-draft:${test.id}`;
    const { errors } = usePage().props;
    const [answers, setAnswers] = useState<Record<number, string>>(() => {
        if (typeof window === 'undefined') {
            return {};
        }

        try {
            return JSON.parse(sessionStorage.getItem(storageKey) ?? '{}');
        } catch {
            return {};
        }
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const totalQuestions = test.questions.length;
    const answeredCount = test.questions.filter(
        (question) => answers[question.id],
    ).length;
    const progress =
        totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
    const canSubmit = totalQuestions > 0 && answeredCount === totalQuestions;
    const currentQuestion = test.questions[currentIndex];

    useEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(answers));
    }, [answers, storageKey]);

    const payload = useMemo(
        () => ({
            answers: test.questions.map((question) => ({
                question_id: question.id,
                selected_answer: answers[question.id],
            })),
        }),
        [answers, test.questions],
    );

    const openQuestion = (index: number) => {
        setCurrentIndex(index);
        setIsReviewing(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const submit = () => {
        if (!canSubmit) {
            return;
        }

        setIsSubmitting(true);
        router.post(`/student/tests/${test.id}/submit`, payload, {
            preserveScroll: true,
            onSuccess: () => sessionStorage.removeItem(storageKey),
            onError: () => setIsConfirmOpen(false),
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <>
            <Head title={test.title} />
            <StudentPage className="mx-auto w-full max-w-6xl">
                <StudentPageHeader
                    eyebrow={
                        test.test_type === 'pretest'
                            ? 'Baseline check'
                            : 'Mastery check'
                    }
                    icon={test.test_type === 'pretest' ? ClipboardCheck : Flag}
                    title={test.title}
                    description="Work through one question at a time. Your choices are kept in this browser until you submit."
                    action={
                        <StudentStatus
                            tone={
                                test.test_type === 'pretest'
                                    ? 'info'
                                    : 'success'
                            }
                        >
                            {test.subject ?? 'Physical Science'}
                        </StudentStatus>
                    }
                />

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertTitle>
                            We could not submit your assessment
                        </AlertTitle>
                        <AlertDescription>
                            Your answers are still here. Review them and try
                            again.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                    <section
                        className="student-panel min-h-[28rem] p-5 sm:p-7"
                        aria-live="polite"
                    >
                        {isReviewing ? (
                            <ReviewAnswers
                                test={test}
                                answers={answers}
                                canSubmit={canSubmit}
                                onOpenQuestion={openQuestion}
                                onSubmit={() => setIsConfirmOpen(true)}
                            />
                        ) : currentQuestion ? (
                            <>
                                <div className="flex items-center justify-between gap-3">
                                    <StudentStatus tone="info">
                                        Question {currentIndex + 1} of{' '}
                                        {totalQuestions}
                                    </StudentStatus>
                                    <span className="text-sm text-muted-foreground">
                                        {currentQuestion.points} point
                                        {currentQuestion.points === 1
                                            ? ''
                                            : 's'}
                                    </span>
                                </div>
                                <h2 className="mt-6 max-w-3xl text-xl leading-8 font-semibold text-balance sm:text-2xl">
                                    {currentQuestion.question}
                                </h2>
                                <div
                                    className="mt-7 grid gap-3"
                                    role="radiogroup"
                                    aria-label="Answer choices"
                                >
                                    {getChoices(currentQuestion.choices).map(
                                        (choice) => {
                                            const isSelected =
                                                answers[currentQuestion.id] ===
                                                choice.value;

                                            return (
                                                <button
                                                    key={choice.value}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={isSelected}
                                                    onClick={() =>
                                                        setAnswers(
                                                            (current) => ({
                                                                ...current,
                                                                [currentQuestion.id]:
                                                                    choice.value,
                                                            }),
                                                        )
                                                    }
                                                    className={cn(
                                                        'student-focus-ring flex min-h-14 items-start gap-4 rounded-2xl border p-4 text-left transition-all',
                                                        isSelected
                                                            ? 'border-primary bg-primary/8 shadow-sm ring-1 ring-primary/30'
                                                            : 'bg-card hover:border-primary/45 hover:bg-primary/4',
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'flex size-8 shrink-0 items-center justify-center rounded-xl border text-sm font-bold',
                                                            isSelected
                                                                ? 'border-primary bg-primary text-primary-foreground'
                                                                : 'bg-muted text-muted-foreground',
                                                        )}
                                                    >
                                                        {isSelected ? (
                                                            <Check className="size-4" />
                                                        ) : (
                                                            choice.value
                                                        )}
                                                    </span>
                                                    <span className="pt-1 text-sm leading-6 sm:text-base">
                                                        {choice.label}
                                                    </span>
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                                <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={currentIndex === 0}
                                        onClick={() =>
                                            setCurrentIndex(
                                                (value) => value - 1,
                                            )
                                        }
                                        className="min-h-11"
                                    >
                                        <ArrowLeft className="size-4" />
                                        Previous
                                    </Button>
                                    {currentIndex === totalQuestions - 1 ? (
                                        <Button
                                            type="button"
                                            onClick={() => setIsReviewing(true)}
                                            className="min-h-11"
                                        >
                                            Review answers
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setCurrentIndex(
                                                    (value) => value + 1,
                                                )
                                            }
                                            className="min-h-11"
                                        >
                                            Next
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground">
                                No questions are available for this assessment.
                            </p>
                        )}
                    </section>

                    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                        <div className="student-panel p-5">
                            <StudentProgress
                                value={progress}
                                label="Answered"
                                detail={`${answeredCount} of ${totalQuestions} questions answered`}
                            />
                            <div
                                className="mt-5 grid grid-cols-5 gap-2"
                                aria-label="Question navigation"
                            >
                                {test.questions.map((question, index) => (
                                    <button
                                        key={question.id}
                                        type="button"
                                        onClick={() => openQuestion(index)}
                                        aria-label={`Question ${index + 1}${answers[question.id] ? ', answered' : ', unanswered'}`}
                                        aria-current={
                                            !isReviewing &&
                                            index === currentIndex
                                                ? 'step'
                                                : undefined
                                        }
                                        className={cn(
                                            'student-focus-ring flex size-10 items-center justify-center rounded-xl border text-sm font-semibold',
                                            answers[question.id]
                                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                : 'bg-card text-muted-foreground',
                                            !isReviewing &&
                                                index === currentIndex &&
                                                'ring-2 ring-primary ring-offset-2 ring-offset-background',
                                        )}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant={isReviewing ? 'default' : 'outline'}
                                onClick={() => setIsReviewing(true)}
                                className="mt-5 min-h-11 w-full"
                            >
                                Review all answers
                            </Button>
                        </div>
                    </aside>
                </div>
            </StudentPage>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit assessment?</DialogTitle>
                        <DialogDescription>
                            You answered all {totalQuestions} questions. Your
                            result will be recorded and cannot be submitted
                            again.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmOpen(false)}
                        >
                            Keep reviewing
                        </Button>
                        <Button
                            disabled={!canSubmit || isSubmitting}
                            onClick={submit}
                        >
                            {isSubmitting ? 'Submitting…' : 'Submit assessment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function ReviewAnswers({
    test,
    answers,
    canSubmit,
    onOpenQuestion,
    onSubmit,
}: {
    test: StudentTest;
    answers: Record<number, string>;
    canSubmit: boolean;
    onOpenQuestion: (index: number) => void;
    onSubmit: () => void;
}) {
    return (
        <>
            <StudentStatus tone={canSubmit ? 'success' : 'warning'}>
                {canSubmit ? 'Ready to submit' : 'Some answers are missing'}
            </StudentStatus>
            <h2 className="mt-4 text-2xl font-bold tracking-tight">
                Review your answers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Open any question to change your choice before submitting.
            </p>
            <ol className="mt-6 grid gap-2 sm:grid-cols-2">
                {test.questions.map((question, index) => (
                    <li key={question.id}>
                        <button
                            type="button"
                            onClick={() => onOpenQuestion(index)}
                            className="student-focus-ring flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border bg-card p-3 text-left hover:border-primary/50"
                        >
                            <span className="min-w-0">
                                <span className="block text-xs text-muted-foreground">
                                    Question {index + 1}
                                </span>
                                <span className="mt-1 block truncate text-sm font-medium">
                                    {question.question}
                                </span>
                            </span>
                            <StudentStatus
                                tone={
                                    answers[question.id] ? 'success' : 'warning'
                                }
                            >
                                {answers[question.id] ?? 'Missing'}
                            </StudentStatus>
                        </button>
                    </li>
                ))}
            </ol>
            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t pt-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenQuestion(0)}
                    className="min-h-11"
                >
                    <ArrowLeft className="size-4" />
                    Back to questions
                </Button>
                <Button
                    type="button"
                    disabled={!canSubmit}
                    onClick={onSubmit}
                    className="min-h-11"
                >
                    Submit assessment
                    <Flag className="size-4" />
                </Button>
            </div>
        </>
    );
}

StudentTestTake.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'Assessment', href: '#' },
    ],
};
