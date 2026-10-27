import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    MessageSquareText,
    Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    StudentEmptyState,
    StudentPage,
    StudentPageHeader,
    StudentProgress,
    StudentStatus,
} from '@/components/student/student-ui';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SurveyQuestion = { id: number; question: string; category: string };
type Survey = {
    id: number;
    title: string;
    description: string | null;
    questions: SurveyQuestion[];
};

const LIKERT_LABELS: Record<number, string> = {
    1: 'Strongly disagree',
    2: 'Disagree',
    3: 'Neutral',
    4: 'Agree',
    5: 'Strongly agree',
};

const CATEGORY_LABELS: Record<string, string> = {
    interactivity: 'Interactivity',
    personalization: 'Personalization',
    feedback_timeliness: 'Feedback timeliness',
    ease_of_use: 'Ease of use',
    engagement: 'Engagement',
};

export default function StudentSurveyIndex({
    survey,
    alreadySubmitted,
}: {
    survey: Survey | null;
    alreadySubmitted: boolean;
}) {
    const storageKey = survey
        ? `student-survey-draft:${survey.id}`
        : 'student-survey-draft';
    const { errors } = usePage().props;
    const [answers, setAnswers] = useState<Record<number, number>>(() => {
        if (typeof window === 'undefined' || !survey) {
            return {};
        }

        try {
            return JSON.parse(
                sessionStorage.getItem(`student-survey-draft:${survey.id}`) ??
                    '{}',
            );
        } catch {
            return {};
        }
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const totalQuestions = survey?.questions.length ?? 0;
    const answeredCount =
        survey?.questions.filter((question) => answers[question.id]).length ??
        0;
    const canSubmit =
        !alreadySubmitted &&
        totalQuestions > 0 &&
        answeredCount === totalQuestions;
    const currentQuestion = survey?.questions[currentIndex];

    useEffect(() => {
        if (survey && !alreadySubmitted) {
            sessionStorage.setItem(storageKey, JSON.stringify(answers));
        }
    }, [alreadySubmitted, answers, storageKey, survey]);

    const openQuestion = (index: number) => {
        setCurrentIndex(index);
        setIsReviewing(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const submit = () => {
        if (!canSubmit || !survey) {
            return;
        }

        setIsSubmitting(true);
        router.post(
            `/student/survey/${survey.id}/submit`,
            {
                answers: survey.questions.map((question) => ({
                    question_id: question.id,
                    rating: answers[question.id],
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => sessionStorage.removeItem(storageKey),
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    if (!survey || alreadySubmitted) {
        return (
            <>
                <Head title="Survey" />
                <StudentPage className="justify-center">
                    <StudentEmptyState
                        icon={
                            alreadySubmitted ? CheckCircle2 : MessageSquareText
                        }
                        title={
                            alreadySubmitted
                                ? 'Survey completed'
                                : 'No survey available'
                        }
                        description={
                            alreadySubmitted
                                ? 'Thank you. Your feedback has been recorded and your learning journey is complete.'
                                : 'There is no published survey right now. Check back after completing your posttest.'
                        }
                    />
                </StudentPage>
            </>
        );
    }

    return (
        <>
            <Head title={survey.title} />
            <StudentPage className="mx-auto w-full max-w-6xl">
                <StudentPageHeader
                    eyebrow="Final reflection"
                    icon={MessageSquareText}
                    title={survey.title}
                    description={
                        survey.description ??
                        'Tell us how the learning materials supported your experience.'
                    }
                    action={
                        <StudentStatus tone="info">
                            1–5 rating scale
                        </StudentStatus>
                    }
                />

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertTitle>We could not submit your survey</AlertTitle>
                        <AlertDescription>
                            Your ratings are still saved in this browser. Please
                            try again.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                    <section
                        className="student-panel min-h-[26rem] p-5 sm:p-7"
                        aria-live="polite"
                    >
                        {isReviewing ? (
                            <>
                                <StudentStatus
                                    tone={canSubmit ? 'success' : 'warning'}
                                >
                                    {canSubmit
                                        ? 'Ready to submit'
                                        : 'Some ratings are missing'}
                                </StudentStatus>
                                <h2 className="mt-4 text-2xl font-bold">
                                    Review your feedback
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Select a statement to change its rating.
                                </p>
                                <ol className="mt-6 grid gap-2 sm:grid-cols-2">
                                    {survey.questions.map((question, index) => (
                                        <li key={question.id}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openQuestion(index)
                                                }
                                                className="student-focus-ring flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border bg-card p-3 text-left hover:border-primary/50"
                                            >
                                                <span className="min-w-0">
                                                    <span className="block text-xs text-muted-foreground">
                                                        Statement {index + 1}
                                                    </span>
                                                    <span className="mt-1 block truncate text-sm font-medium">
                                                        {question.question}
                                                    </span>
                                                </span>
                                                <StudentStatus
                                                    tone={
                                                        answers[question.id]
                                                            ? 'success'
                                                            : 'warning'
                                                    }
                                                >
                                                    {answers[question.id] ??
                                                        'Missing'}
                                                </StudentStatus>
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                                <div className="mt-8 flex flex-wrap justify-between gap-3 border-t pt-5">
                                    <Button
                                        variant="outline"
                                        onClick={() => openQuestion(0)}
                                        className="min-h-11"
                                    >
                                        <ArrowLeft className="size-4" />
                                        Back to statements
                                    </Button>
                                    <Button
                                        disabled={!canSubmit || isSubmitting}
                                        onClick={submit}
                                        className="min-h-11"
                                    >
                                        {isSubmitting
                                            ? 'Submitting…'
                                            : 'Submit survey'}
                                        <Check className="size-4" />
                                    </Button>
                                </div>
                            </>
                        ) : currentQuestion ? (
                            <>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <StudentStatus tone="info">
                                        Statement {currentIndex + 1} of{' '}
                                        {totalQuestions}
                                    </StudentStatus>
                                    <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                                        {CATEGORY_LABELS[
                                            currentQuestion.category
                                        ] ?? currentQuestion.category}
                                    </span>
                                </div>
                                <h2 className="mt-7 max-w-3xl text-xl leading-8 font-semibold text-balance sm:text-2xl">
                                    {currentQuestion.question}
                                </h2>
                                <div
                                    className="mt-8 grid gap-2 sm:grid-cols-5"
                                    role="radiogroup"
                                    aria-label="Agreement rating"
                                >
                                    {[1, 2, 3, 4, 5].map((rating) => {
                                        const selected =
                                            answers[currentQuestion.id] ===
                                            rating;

                                        return (
                                            <button
                                                key={rating}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                onClick={() =>
                                                    setAnswers((current) => ({
                                                        ...current,
                                                        [currentQuestion.id]:
                                                            rating,
                                                    }))
                                                }
                                                className={cn(
                                                    'student-focus-ring flex min-h-24 flex-row items-center gap-3 rounded-2xl border p-3 text-left transition-all sm:flex-col sm:justify-center sm:text-center',
                                                    selected
                                                        ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15'
                                                        : 'bg-card hover:border-primary/45 hover:bg-primary/5',
                                                )}
                                            >
                                                <span className="text-2xl font-bold">
                                                    {rating}
                                                </span>
                                                <span className="text-xs leading-4">
                                                    {LIKERT_LABELS[rating]}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
                                    <Button
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
                                    <Button
                                        onClick={() =>
                                            currentIndex === totalQuestions - 1
                                                ? setIsReviewing(true)
                                                : setCurrentIndex(
                                                      (value) => value + 1,
                                                  )
                                        }
                                        className="min-h-11"
                                    >
                                        {currentIndex === totalQuestions - 1
                                            ? 'Review'
                                            : 'Next'}
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </div>
                            </>
                        ) : null}
                    </section>

                    <aside className="lg:sticky lg:top-6 lg:self-start">
                        <div className="student-panel p-5">
                            <StudentProgress
                                value={
                                    totalQuestions
                                        ? (answeredCount / totalQuestions) * 100
                                        : 0
                                }
                                label="Rated"
                                detail={`${answeredCount} of ${totalQuestions} statements rated`}
                            />
                            <div className="mt-5 grid grid-cols-5 gap-2">
                                {survey.questions.map((question, index) => (
                                    <button
                                        key={question.id}
                                        type="button"
                                        onClick={() => openQuestion(index)}
                                        aria-label={`Statement ${index + 1}${answers[question.id] ? ', rated' : ', not rated'}`}
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
                            <div className="mt-5 rounded-xl bg-primary/5 p-4 text-xs leading-5 text-muted-foreground">
                                <Sparkles className="mb-2 size-4 text-primary" />
                                There are no right or wrong answers. Choose the
                                rating that best matches your experience.
                            </div>
                        </div>
                    </aside>
                </div>
            </StudentPage>
        </>
    );
}

StudentSurveyIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/student/dashboard' },
        { title: 'Survey', href: '#' },
    ],
};
