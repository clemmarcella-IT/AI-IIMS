import { Head } from '@inertiajs/react';

import { TeacherStudentForm, type TeacherStudentFormModel } from './form';

export default function EditTeacherStudent({
    student,
}: {
    student: TeacherStudentFormModel;
}) {
    return (
        <>
            <Head title={`Edit ${student.name}`} />
            <TeacherStudentForm student={student} />
        </>
    );
}

EditTeacherStudent.layout = {
    breadcrumbs: [
        { title: 'Teacher', href: '/teacher/dashboard' },
        { title: 'Students', href: '/teacher/students' },
        { title: 'Edit', href: '/teacher/students' },
    ],
};
