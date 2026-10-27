<?php

use App\Enums\Role as RoleEnum;
use App\Models\Lesson;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

function createSubjectNotificationTeacher(): array
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

function createSubjectNotificationStudent(): array
{
    Role::firstOrCreate(['name' => RoleEnum::STUDENT->value]);

    $user = User::factory()->create();
    $user->assignRole(RoleEnum::STUDENT->value);

    $student = Student::query()->create([
        'user_id' => $user->id,
        'student_code' => 'S-'.str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
        'first_name' => 'Grace',
        'last_name' => 'Hopper',
        'grade_level' => '10',
        'section' => 'A',
        'consent_status' => true,
    ]);

    return [$user, $student];
}

it('notifies students when a published lesson is added to a subject', function () {
    [$teacherUser] = createSubjectNotificationTeacher();
    [$studentUser] = createSubjectNotificationStudent();

    $this->actingAs($teacherUser)->post(route('teacher.lessons.store'), [
        'title' => 'Energy Transfer',
        'subject' => 'Science',
        'topic' => 'Heat',
        'difficulty_level' => 'beginner',
        'is_published' => true,
        'sections' => [],
        'media' => [],
        'activities' => [
            [
                'type' => 'reflection',
                'title' => 'Exit ticket',
                'instruction' => 'Write one thing you learned.',
                'sort_order' => 1,
            ],
        ],
    ])->assertRedirect(route('teacher.lessons.index'));

    $notification = $studentUser->notifications()->firstOrFail();

    expect($notification->data['event_type'])->toBe('lesson_added')
        ->and($notification->data['subject'])->toBe('Science')
        ->and($notification->data['lesson_title'])->toBe('Energy Transfer')
        ->and($notification->data['activity_count'])->toBe(1);
});

it('notifies students when activities are added to a published lesson', function () {
    [$teacherUser, $teacher] = createSubjectNotificationTeacher();
    [$studentUser] = createSubjectNotificationStudent();

    $lesson = Lesson::query()->create([
        'teacher_id' => $teacher->id,
        'title' => 'Forces',
        'subject' => 'Physics',
        'topic' => 'Motion',
        'difficulty_level' => 'beginner',
        'is_published' => true,
    ]);
    $lesson->lessonActivities()->create([
        'type' => 'reflection',
        'title' => 'First reflection',
        'instruction' => 'What is force?',
        'payload' => ['prompt' => 'What is force?'],
        'sort_order' => 1,
    ]);

    $this->actingAs($teacherUser)->put(route('teacher.lessons.update', $lesson), [
        'title' => 'Forces',
        'subject' => 'Physics',
        'topic' => 'Motion',
        'difficulty_level' => 'beginner',
        'is_published' => true,
        'sections' => [],
        'media' => [],
        'activities' => [
            [
                'type' => 'reflection',
                'title' => 'First reflection',
                'instruction' => 'What is force?',
                'sort_order' => 1,
            ],
            [
                'type' => 'reflection',
                'title' => 'Second reflection',
                'instruction' => 'Where do you see force at home?',
                'sort_order' => 2,
            ],
        ],
    ])->assertSessionHasNoErrors();

    $notification = $studentUser->notifications()->firstOrFail();

    expect($notification->data['event_type'])->toBe('activity_added')
        ->and($notification->data['subject'])->toBe('Physics')
        ->and($notification->data['lesson_title'])->toBe('Forces')
        ->and($notification->data['activity_count'])->toBe(1);
});
