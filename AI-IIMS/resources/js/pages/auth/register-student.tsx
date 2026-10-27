import { Form, Head } from '@inertiajs/react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';

import { login } from '@/routes';

export default function RegisterStudent() {
    const [step, setStep] = useState(1);
    const [consent, setConsent] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const canProceed =
        name.trim() !== '' &&
        email.trim() !== '' &&
        password.trim() !== '' &&
        passwordConfirmation.trim() !== '' &&
        password === passwordConfirmation;

    return (
        <>
            <Head title="Student Registration" />

            <Form
                action="/register/student"
                method="post"
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {step === 1 && (
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label
                                        htmlFor="name"
                                        className="font-medium"
                                    >
                                        Full Name
                                    </label>
                                    <InputText
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                        autoFocus
                                        autoComplete="name"
                                        placeholder="Full name"
                                        className="w-full"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="email"
                                        className="font-medium"
                                    >
                                        Email Address
                                    </label>
                                    <InputText
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="w-full"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="password"
                                        className="font-medium"
                                    >
                                        Password
                                    </label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        autoComplete="new-password"
                                        placeholder="Password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="password_confirmation"
                                        className="font-medium"
                                    >
                                        Confirm Password
                                    </label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={passwordConfirmation}
                                        onChange={(e) =>
                                            setPasswordConfirmation(
                                                e.target.value,
                                            )
                                        }
                                        required
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
                                    />
                                    {passwordConfirmation &&
                                        password !== passwordConfirmation && (
                                            <p className="text-sm text-red-500">
                                                Passwords do not match
                                            </p>
                                        )}
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    label="Next"
                                    className="mt-2 w-full"
                                    onClick={() => setStep(2)}
                                    disabled={!canProceed}
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-6">
                                <input type="hidden" name="name" value={name} />
                                <input
                                    type="hidden"
                                    name="email"
                                    value={email}
                                />
                                <input
                                    type="hidden"
                                    name="password"
                                    value={password}
                                />
                                <input
                                    type="hidden"
                                    name="password_confirmation"
                                    value={passwordConfirmation}
                                />
                                <div className="grid gap-2">
                                    <label
                                        htmlFor="student_code"
                                        className="font-medium"
                                    >
                                        Student Code
                                    </label>
                                    <InputText
                                        id="student_code"
                                        name="student_code"
                                        type="text"
                                        required
                                        placeholder="e.g. STU-0001"
                                        className="w-full"
                                    />
                                    <InputError message={errors.student_code} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="first_name"
                                            className="font-medium"
                                        >
                                            First Name
                                        </label>
                                        <InputText
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            required
                                            placeholder="First name"
                                            className="w-full"
                                        />
                                        <InputError
                                            message={errors.first_name}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="last_name"
                                            className="font-medium"
                                        >
                                            Last Name
                                        </label>
                                        <InputText
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            required
                                            placeholder="Last name"
                                            className="w-full"
                                        />
                                        <InputError
                                            message={errors.last_name}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="grade_level"
                                            className="font-medium"
                                        >
                                            Grade Level
                                        </label>
                                        <InputText
                                            id="grade_level"
                                            name="grade_level"
                                            type="text"
                                            required
                                            placeholder="Grade 12"
                                            className="w-full"
                                        />
                                        <InputError
                                            message={errors.grade_level}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="section"
                                            className="font-medium"
                                        >
                                            Section
                                        </label>
                                        <InputText
                                            id="section"
                                            name="section"
                                            type="text"
                                            required
                                            placeholder="e.g. STEM A"
                                            className="w-full"
                                        />
                                        <InputError message={errors.section} />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-lg border p-4 text-sm">
                                    <Checkbox
                                        inputId="terms-checkbox-desc"
                                        checked={consent}
                                        onChange={(e) =>
                                            setConsent(e.checked === true)
                                        }
                                    />
                                    <div className="grid gap-1">
                                        <label
                                            htmlFor="terms-checkbox-desc"
                                            className="font-medium"
                                        >
                                            Accept terms and conditions
                                        </label>
                                        <p className="text-muted-foreground">
                                            By creating this account, the
                                            student agrees to participate in the
                                            system evaluation and allows
                                            academic interaction data to be used
                                            for research purposes.
                                        </p>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="consent_status"
                                        value={consent ? '1' : '0'}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="button"
                                        label="Back"
                                        outlined
                                        className="w-full"
                                        onClick={() => setStep(1)}
                                    />

                                    <Button
                                        type="submit"
                                        label="Create Student Account"
                                        className="w-full"
                                        loading={processing}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()}>Log in</TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

RegisterStudent.layout = {
    title: 'Create student account',
    description: 'Enter your account and student details below.',
};
