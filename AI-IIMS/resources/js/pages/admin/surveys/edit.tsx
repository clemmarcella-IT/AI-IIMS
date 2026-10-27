import { Head } from '@inertiajs/react';

import { SurveyForm, SurveyFormModel } from './form';

export default function AdminSurveysEdit({
    survey,
}: {
    survey: SurveyFormModel;
}) {
    return (
        <>
            <Head title="Edit Survey" />
            <SurveyForm survey={survey} />
        </>
    );
}

AdminSurveysEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Surveys', href: '/admin/surveys' },
        { title: 'Edit', href: '#' },
    ],
};
