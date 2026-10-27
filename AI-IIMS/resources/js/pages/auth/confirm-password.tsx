import { Form, Head } from '@inertiajs/react';
import { Button } from 'primereact/button';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <label htmlFor="password" className="font-medium">
                                Password
                            </label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                type="submit"
                                label="Confirm password"
                                className="w-full"
                                loading={processing}
                                data-test="confirm-password-button"
                            />
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm your password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};
