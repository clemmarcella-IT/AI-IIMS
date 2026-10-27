import { Head } from '@inertiajs/react';

import { SurveyForm, SurveyFormModel } from './form';

export default function TeacherSurveysEdit({
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

TeacherSurveysEdit.layout = {
    breadcrumbs: [
        { title: 'Teacher', href: '/teacher/dashboard' },
        { title: 'Surveys', href: '/teacher/surveys' },
        { title: 'Edit', href: '#' },
    ],
};
