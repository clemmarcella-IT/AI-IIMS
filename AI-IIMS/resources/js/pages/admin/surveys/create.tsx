import { Head } from '@inertiajs/react';

import { SurveyForm } from './form';

export default function AdminSurveysCreate() {
    return (
        <>
            <Head title="Create Survey" />
            <SurveyForm />
        </>
    );
}

AdminSurveysCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Surveys', href: '/admin/surveys' },
        { title: 'Create', href: '#' },
    ],
};
