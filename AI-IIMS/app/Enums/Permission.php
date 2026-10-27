<?php

namespace App\Enums;

enum Permission: string
{
    /*
    |--------------------------------------------------------------------------
    | USER MANAGEMENT
    |--------------------------------------------------------------------------
    */

    case USER_VIEW = 'user.view';
    case USER_CREATE = 'user.create';
    case USER_UPDATE = 'user.update';
    case USER_DELETE = 'user.delete';

    /*
    |--------------------------------------------------------------------------
    | STUDENT MANAGEMENT
    |--------------------------------------------------------------------------
    */

    case STUDENT_VIEW = 'student.view';
    case STUDENT_CREATE = 'student.create';
    case STUDENT_UPDATE = 'student.update';
    case STUDENT_DELETE = 'student.delete';

    /*
    |--------------------------------------------------------------------------
    | TEACHER MANAGEMENT
    |--------------------------------------------------------------------------
    */

    case TEACHER_VIEW = 'teacher.view';
    case TEACHER_CREATE = 'teacher.create';
    case TEACHER_UPDATE = 'teacher.update';
    case TEACHER_DELETE = 'teacher.delete';

    /*
    |--------------------------------------------------------------------------
    | LESSONS
    |--------------------------------------------------------------------------
    */

    case LESSON_VIEW = 'lesson.view';
    case LESSON_CREATE = 'lesson.create';
    case LESSON_UPDATE = 'lesson.update';
    case LESSON_DELETE = 'lesson.delete';

    /*
    |--------------------------------------------------------------------------
    | ACTIVITIES / QUIZZES
    |--------------------------------------------------------------------------
    */

    case ACTIVITY_VIEW = 'activity.view';
    case ACTIVITY_CREATE = 'activity.create';
    case ACTIVITY_UPDATE = 'activity.update';
    case ACTIVITY_DELETE = 'activity.delete';
    case ACTIVITY_TAKE = 'activity.take';

    /*
    |--------------------------------------------------------------------------
    | PRETEST / POSTTEST
    |--------------------------------------------------------------------------
    */

    case TEST_VIEW = 'test.view';
    case TEST_CREATE = 'test.create';
    case TEST_UPDATE = 'test.update';
    case TEST_DELETE = 'test.delete';
    case TEST_TAKE = 'test.take';

    /*
    |--------------------------------------------------------------------------
    | RESULTS / ANALYTICS
    |--------------------------------------------------------------------------
    */

    case RESULT_VIEW = 'result.view';
    case RESULT_EXPORT = 'result.export';

    /*
    |--------------------------------------------------------------------------
    | SURVEY
    |--------------------------------------------------------------------------
    */

    case SURVEY_VIEW = 'survey.view';
    case SURVEY_CREATE = 'survey.create';
    case SURVEY_TAKE = 'survey.take';

    /*
    |--------------------------------------------------------------------------
    | AI FEATURES
    |--------------------------------------------------------------------------
    */

    case AI_FEEDBACK_GENERATE = 'ai-feedback.generate';
    case AI_RECOMMENDATION_VIEW = 'ai-recommendation.view';

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    case DASHBOARD_ADMIN = 'dashboard.admin';
    case DASHBOARD_TEACHER = 'dashboard.teacher';
    case DASHBOARD_STUDENT = 'dashboard.student';
}
