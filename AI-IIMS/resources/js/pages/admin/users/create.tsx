import { Head } from '@inertiajs/react';
import { AdminUserForm } from './form';

export default function CreateAdminUser() {
    return (
        <>
            <Head title="Create User" />
            <AdminUserForm />
        </>
    );
}

CreateAdminUser.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Users',
            href: '/admin/users',
        },
        {
            title: 'Create',
            href: '/admin/users/create',
        },
    ],
};
