import { Head, Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowRight,
    BarChart3,
    BookOpenCheck,
    BrainCircuit,
    ChartNoAxesCombined,
    ClipboardCheck,
    GraduationCap,
    Lightbulb,
    MonitorCheck,
    PenTool,
    Sparkles,
    UsersRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login } from '@/routes';
import type { Auth } from '@/types';

type Feature = {
    title: string;
    description: string;
    icon: LucideIcon;
};

type Step = {
    title: string;
    description: string;
    icon: LucideIcon;
};

type WelcomeAuth = {
    user?: Auth['user'] | null;
};

const registerPath = '/register/select-role';

const features: Feature[] = [
    {
        title: 'AI-Assisted Lesson Builder',
        description:
            'Help teachers draft, refine, and enrich learning materials with AI-supported suggestions.',
        icon: PenTool,
    },
    {
        title: 'Interactive Student Lessons',
        description:
            'Guide learners through engaging materials, checkpoints, and activities built for Grade 11.',
        icon: BookOpenCheck,
    },
    {
        title: 'Pretest and Posttest Tracking',
        description:
            'Measure readiness and growth with assessments before and after each learning experience.',
        icon: ClipboardCheck,
    },
    {
        title: 'AI Feedback and Recommendations',
        description:
            'Surface timely feedback that helps students understand gaps and plan their next steps.',
        icon: BrainCircuit,
    },
    {
        title: 'Teacher Analytics',
        description:
            'Give teachers a clearer view of lesson performance, participation, and class outcomes.',
        icon: ChartNoAxesCombined,
    },
    {
        title: 'Student Progress Monitoring',
        description:
            'Track individual progress so students and teachers can see improvement over time.',
        icon: BarChart3,
    },
];

const steps: Step[] = [
    {
        title: 'Teacher creates lessons',
        description:
            'Teachers prepare interactive instructional materials aligned with their class goals.',
        icon: GraduationCap,
    },
    {
        title: 'AI suggests enhancements',
        description:
            'The platform recommends refinements, activities, questions, and feedback opportunities.',
        icon: Sparkles,
    },
    {
        title: 'Students learn and improve',
        description:
            'Students complete lessons and quizzes while progress data helps guide improvement.',
        icon: MonitorCheck,
    },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props as unknown as { auth?: WelcomeAuth };
    const currentUser = auth?.user;

    return (
        <>
            <Head title="AI Learning Materials" />

            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
                    <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm font-semibold sm:text-base"
                        >
                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                                <GraduationCap className="size-5" />
                            </span>
                            <span>AI Learning Materials</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {currentUser ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard()}>
                                        Dashboard
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="sm" variant="ghost">
                                        <Link href={login()}>Log In</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild size="sm">
                                            <Link href={registerPath}>
                                                Register
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main>
                    <section className="border-b">
                        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
                            <div className="max-w-3xl">
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
                                    <Lightbulb className="size-4 text-amber-500" />
                                    Built for Grade 11 interactive learning
                                </div>
                                <h1 className="text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
                                    AI-Enhanced Interactive Instructional
                                    Materials
                                </h1>
                                <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    A web-based learning platform that helps
                                    teachers create interactive lessons and
                                    supports Grade 11 students through AI
                                    feedback, quizzes, and progress tracking.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    {canRegister && (
                                        <Button asChild className="h-11 px-5">
                                            <Link href={registerPath}>
                                                Get Started
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </Button>
                                    )}
                                    <Button
                                        asChild
                                        className="h-11 px-5"
                                        variant="outline"
                                    >
                                        <Link href={login()}>Log In</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="rounded-xl border bg-card p-4 shadow-sm">
                                    <div className="mb-4 flex items-center justify-between border-b pb-4">
                                        <div>
                                            <p className="text-sm font-medium">
                                                Lesson Progress
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Grade 11 learner dashboard
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                            Active
                                        </span>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg border bg-background p-4">
                                            <UsersRound className="mb-4 size-5 text-primary" />
                                            <p className="text-2xl font-semibold">
                                                84%
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                quiz completion
                                            </p>
                                        </div>
                                        <div className="rounded-lg border bg-background p-4">
                                            <BrainCircuit className="mb-4 size-5 text-amber-500" />
                                            <p className="text-2xl font-semibold">
                                                12
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                AI recommendations
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 rounded-lg border bg-background p-4">
                                        <div className="mb-3 flex items-center justify-between text-sm">
                                            <span className="font-medium">
                                                Posttest improvement
                                            </span>
                                            <span className="text-muted-foreground">
                                                +31%
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-2 rounded-full bg-muted">
                                                <div className="h-2 w-7/12 rounded-full bg-primary" />
                                            </div>
                                            <div className="h-2 rounded-full bg-muted">
                                                <div className="h-2 w-10/12 rounded-full bg-emerald-500" />
                                            </div>
                                            <div className="h-2 rounded-full bg-muted">
                                                <div className="h-2 w-8/12 rounded-full bg-amber-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <p className="text-sm font-medium text-primary">
                                Platform Features
                            </p>
                            <h2 className="mt-3 text-3xl font-semibold">
                                Tools for teaching, feedback, and measurable
                                growth
                            </h2>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <Card key={feature.title}>
                                        <CardHeader>
                                            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="size-5" />
                                            </div>
                                            <CardTitle>
                                                {feature.title}
                                            </CardTitle>
                                            <CardDescription>
                                                {feature.description}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    <section className="border-y bg-muted/30">
                        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                            <div className="max-w-2xl">
                                <p className="text-sm font-medium text-primary">
                                    How It Works
                                </p>
                                <h2 className="mt-3 text-3xl font-semibold">
                                    From lesson design to student improvement
                                </h2>
                            </div>

                            <div className="mt-8 grid gap-4 lg:grid-cols-3">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;

                                    return (
                                        <Card key={step.title}>
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-9 items-center justify-center rounded-lg bg-background text-sm font-semibold ring-1 ring-border">
                                                        {index + 1}
                                                    </span>
                                                    <Icon className="size-5 text-primary" />
                                                </div>
                                                <CardTitle>
                                                    {step.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    {step.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>AI Learning Materials</p>
                    <p>
                        AI-enhanced instructional support for Grade 11 learning.
                    </p>
                </footer>
            </div>
        </>
    );
}
