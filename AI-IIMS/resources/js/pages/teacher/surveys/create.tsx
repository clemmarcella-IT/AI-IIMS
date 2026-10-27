import { Head } from '@inertiajs/react';

import { SurveyForm } from './form';

export default function TeacherSurveysCreate() {
    return (
        <>
            <Head title="Create Survey" />
            <SurveyForm />
        </>
    );
}

TeacherSurveysCreate.layout = {
    breadcrumbs: [
        { title: 'Teacher', href: '/teacher/dashboard' },
        { title: 'Surveys', href: '/teacher/surveys' },
        { title: 'Create', href: '#' },
    ],
};
