import { Form, Head } from '@inertiajs/react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';

import { login } from '@/routes';

export default function RegisterTeacher() {
    const [step, setStep] = useState(1);

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
            <Head title="Teacher Registration" />

            <Form
                action="/register/teacher"
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
                                        htmlFor="employee_no"
                                        className="font-medium"
                                    >
                                        Employee Number
                                    </label>

                                    <InputText
                                        id="employee_no"
                                        name="employee_no"
                                        type="text"
                                        required
                                        placeholder="e.g. TCH-0001"
                                        className="w-full"
                                    />

                                    <InputError message={errors.employee_no} />
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

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="department"
                                        className="font-medium"
                                    >
                                        Department
                                    </label>

                                    <InputText
                                        id="department"
                                        name="department"
                                        type="text"
                                        placeholder="Senior High School"
                                        className="w-full"
                                    />

                                    <InputError message={errors.department} />
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="specialization"
                                        className="font-medium"
                                    >
                                        Specialization
                                    </label>

                                    <InputText
                                        id="specialization"
                                        name="specialization"
                                        type="text"
                                        placeholder="e.g. Mathematics"
                                        className="w-full"
                                    />

                                    <InputError
                                        message={errors.specialization}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="position"
                                        className="font-medium"
                                    >
                                        Position
                                    </label>

                                    <InputText
                                        id="position"
                                        name="position"
                                        type="text"
                                        placeholder="e.g. Teacher I"
                                        className="w-full"
                                    />

                                    <InputError message={errors.position} />
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
                                        label="Create Teacher Account"
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

RegisterTeacher.layout = {
    title: 'Create teacher account',
    description: 'Enter your account and teacher details below.',
};
