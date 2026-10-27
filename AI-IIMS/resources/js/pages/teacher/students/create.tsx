import { Head } from '@inertiajs/react';

import { TeacherStudentForm } from './form';

export default function CreateTeacherStudent() {
    return (
        <>
            <Head title="Add Student" />
            <TeacherStudentForm />
        </>
    );
}

CreateTeacherStudent.layout = {
    breadcrumbs: [
        { title: 'Teacher', href: '/teacher/dashboard' },
        { title: 'Students', href: '/teacher/students' },
        { title: 'Add', href: '/teacher/students/create' },
    ],
};
