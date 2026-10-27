<?php

use App\Enums\Role as RoleEnum;
use App\Models\Lesson;
use App\Models\Student;
use App\Models\StudentActivityAnswer;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

function createActivityReviewTeacher(): array
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    Role::firstOrCreate(['name' => RoleEnum::TEACHER->value]);

    $user = User::factory()->create();
    $user->assignRole(RoleEnum::TEACHER->value);

    $teacher = Teacher::query()->create([
        'user_id' => $user->id,
        'employee_no' => 'T-'.str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
        'first_name' => 'Ada',
        'last_name' => 'Lovelace',
    ]);

    return [$user, $teacher];
}

function createActivityReviewStudent(string $firstName, string $lastName): Student
{
    $user = User::factory()->create();

    return Student::query()->create([
        'user_id' => $user->id,
        'student_code' => 'S-'.str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
        'first_name' => $firstName,
        'last_name' => $lastName,
        'grade_level' => '10',
        'section' => 'A',
        'consent_status' => true,
    ]);
}

it('lets a teacher review submitted activity answers for their lessons', function () {
    [$teacherUser, $teacher] = createActivityReviewTeacher();
    [, $otherTeacher] = createActivityReviewTeacher();
    $student = createActivityReviewStudent('Grace', 'Hopper');

    $lesson = Lesson::query()->create([
        'teacher_id' => $teacher->id,
        'title' => 'Energy Transfer',
        'subject' => 'Physical Science',
        'difficulty_level' => 'beginner',
        'is_published' => true,
    ]);
    $activity = $lesson->lessonActivities()->create([
        'type' => 'true_false',
        'title' => 'Heat check',
        'instruction' => 'Answer true or false.',
        'payload' => ['statement' => 'Heat transfers by conduction.'],
        'correct_answer' => true,
        'record_score' => true,
        'sort_order' => 1,
    ]);
    $lesson->lessonActivities()->create([
        'type' => 'reflection',
        'title' => 'Exit reflection',
        'instruction' => 'Write one thing you learned.',
        'payload' => ['prompt' => 'Write one thing you learned.'],
        'record_score' => false,
        'sort_order' => 2,
    ]);

    StudentActivityAnswer::query()->create([
        'student_id' => $student->id,
        'lesson_activity_id' => $activity->id,
        'answer' => true,
        'is_correct' => true,
        'score' => 1,
        'feedback' => 'Correct.',
    ]);

    $otherLesson = Lesson::query()->create([
        'teacher_id' => $otherTeacher->id,
        'title' => 'Other Teacher Lesson',
        'difficulty_level' => 'beginner',
        'is_published' => true,
    ]);
    $otherActivity = $otherLesson->lessonActivities()->create([
        'type' => 'reflection',
        'title' => 'Private reflection',
        'instruction' => 'Write privately.',
        'payload' => ['prompt' => 'Write privately.'],
        'record_score' => false,
        'sort_order' => 1,
    ]);
    StudentActivityAnswer::query()->create([
        'student_id' => $student->id,
        'lesson_activity_id' => $otherActivity->id,
        'answer' => 'Hidden from this teacher.',
        'is_correct' => null,
        'score' => null,
        'feedback' => 'Reflection saved.',
    ]);

    $this->actingAs($teacherUser)
        ->get(route('teacher.activities.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('teacher/lessons/index')
            ->where('initialPanel', 'activity_answers')
            ->has('activityAnswerSummaries', 1)
            ->where('activityAnswerSummaries.0.student_name', 'Grace Hopper')
            ->where('activityAnswerSummaries.0.lesson_subject', 'Physical Science')
            ->where('activityAnswerSummaries.0.lesson_title', 'Energy Transfer')
            ->where('activityAnswerSummaries.0.answered_count', 1)
            ->where('activityAnswerSummaries.0.total_activities', 2)
            ->where('activityAnswerSummaries.0.correct_count', 1)
        );

    $this->actingAs($teacherUser)
        ->get(route('teacher.activities.review', [$student, $lesson]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('teacher/activities/review')
            ->where('student.name', 'Grace Hopper')
            ->where('lesson.title', 'Energy Transfer')
            ->where('summary.answered_count', 1)
            ->where('summary.total_activities', 2)
            ->has('activityAnswers', 2)
            ->where('activityAnswers.0.activity_title', 'Heat check')
            ->where('activityAnswers.0.answer', true)
            ->where('activityAnswers.0.correct_answer', true)
            ->where('activityAnswers.0.has_answer', true)
            ->where('activityAnswers.1.activity_title', 'Exit reflection')
            ->where('activityAnswers.1.has_answer', false)
        );
});
