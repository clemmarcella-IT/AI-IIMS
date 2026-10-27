import { Head, router } from '@inertiajs/react';

import { GraduationCap, ShieldCheck } from 'lucide-react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function SelectRole() {
    return (
        <>
            <Head title="Select Registration Type" />

            <div className="flex min-h-screen flex-col items-center bg-muted/40 px-4 py-10">
                <div className="w-full max-w-4xl">
                    {/* Header */}

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create an Account
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Select what type of account you want to register.
                        </p>
                    </div>

                    {/* Role Cards */}

                    <div className="grid gap-6 md:grid-rows-2">
                        {/* Student */}

                        <Card className="transition-all hover:shadow-lg">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <GraduationCap className="h-8 w-8 text-primary" />
                                </div>

                                <h2 className="text-xl font-semibold">
                                    Student Account
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Access interactive lessons, quizzes,
                                    assessments, and AI-powered learning
                                    support.
                                </p>

                                <Button
                                    type="button"
                                    label="Register as Student"
                                    className="mt-4 w-full"
                                    onClick={() =>
                                        router.visit('/register/student')
                                    }
                                />
                            </div>
                        </Card>

                        {/* Teacher */}

                        <Card className="transition-all hover:shadow-lg">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>

                                <h2 className="text-xl font-semibold">
                                    Teacher Account
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Manage lessons, monitor student progress,
                                    assessments, and system analytics.
                                </p>

                                <Button
                                    type="button"
                                    label="Register as Teacher"
                                    severity="secondary"
                                    className="mt-4 w-full"
                                    onClick={() =>
                                        router.visit('/register/teacher')
                                    }
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Footer */}

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <a
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Log in
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
