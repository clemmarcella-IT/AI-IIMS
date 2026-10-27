import { Head } from '@inertiajs/react';
import { AdminTestForm } from './form';

export default function CreateAdminTest() {
    return (
        <>
            <Head title="Create Test" />
            <AdminTestForm />
        </>
    );
}

CreateAdminTest.layout = {
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
            title: 'Create',
            href: '/admin/tests/create',
        },
    ],
};
