import { Head } from '@inertiajs/react';
import { AdminUserForm, type UserFormModel } from './form';

export default function EditAdminUser({ user }: { user: UserFormModel }) {
    return (
        <>
            <Head title={`Edit ${user.name}`} />
            <AdminUserForm user={user} />
        </>
    );
}

EditAdminUser.layout = {
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
            title: 'Edit',
            href: '/admin/users',
        },
    ],
};
