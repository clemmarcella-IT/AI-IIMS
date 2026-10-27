import { Head } from '@inertiajs/react';
import { AdminTestForm, type TestFormModel } from './form';

export default function EditAdminTest({ test }: { test: TestFormModel }) {
    return (
        <>
            <Head title={`Edit ${test.title}`} />
            <AdminTestForm test={test} />
        </>
    );
}

EditAdminTest.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Tests',
            href: '/admin/tests',
        },
        {
            title: 'Edit',
            href: '/admin/tests',
        },
    ],
};
