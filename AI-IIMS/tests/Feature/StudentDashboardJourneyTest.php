<?php

use App\Enums\Role as RoleEnum;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Student;
use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Models\Teacher;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

it('chooses the next student action from the learning journey state', function () {
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    Role::firstOrCreate(['name' => RoleEnum::STUDENT->value]);

    $user = User::factory()->create();
    $user->assignRole(RoleEnum::STUDENT->value);
    $student = Student::query()->create([
        'user_id' => $user->id,
        'student_code' => 'JOURNEY-1',
        'first_name' => 'Grace',
        'last_name' => 'Hopper',
        'grade_level' => '11',
        'section' => 'A',
        'consent_status' => true,
    ]);
    $teacherUser = User::factory()->create();
    $teacher = Teacher::query()->create([
        'user_id' => $teacherUser->id,
        'employee_no' => 'JOURNEY-T1',
        'first_name' => 'Ada',
        'last_name' => 'Lovelace',
    ]);
    $lesson = Lesson::query()->create([
        'teacher_id' => $teacher->id,
        'title' => 'Energy in Motion',
        'subject' => 'Physical Science',
        'difficulty_level' => 'beginner',
        'is_published' => true,
    ]);

    $this->actingAs($user)
        ->get(route('student.dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('next_action.type', 'pretest')
            ->where('journey.pretest', 'current')
            ->where('journey.lessons', 'locked'));

    $pretest = Test::query()->create([
        'title' => 'Pretest',
        'test_type' => 'pretest',
        'is_active' => true,
    ]);
    TestAttempt::query()->create([
        'student_id' => $student->id,
        'test_id' => $pretest->id,
        'test_type' => 'pretest',
        'score' => 5,
        'total_items' => 10,
        'percentage' => 50,
        'submitted_at' => now(),
    ]);
    $progress = LessonProgress::query()->create([
        'student_id' => $student->id,
        'lesson_id' => $lesson->id,
        'status' => 'in_progress',
        'progress_percentage' => 40,
        'last_activity_at' => now(),
    ]);

    $this->get(route('student.dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('next_action.type', 'lesson')
            ->where('continue_lesson.id', $lesson->id)
            ->where('continue_lesson.progress_percentage', 40));

    $progress->update(['status' => 'completed', 'progress_percentage' => 100]);

    $this->get(route('student.dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('next_action.type', 'posttest')
            ->where('journey.lessons', 'complete')
            ->where('journey.posttest', 'current'));

    $posttest = Test::query()->create([
        'title' => 'Posttest',
        'test_type' => 'posttest',
        'is_active' => true,
    ]);
    TestAttempt::query()->create([
        'student_id' => $student->id,
        'test_id' => $posttest->id,
        'test_type' => 'posttest',
        'score' => 8,
        'total_items' => 10,
        'percentage' => 80,
        'submitted_at' => now(),
    ]);

    $this->get(route('student.dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('next_action.type', 'survey')
            ->where('journey.posttest', 'complete')
            ->where('journey.survey', 'current'));

    $survey = Survey::query()->create([
        'title' => 'Learning Survey',
        'is_published' => true,
    ]);
    SurveyResponse::query()->create([
        'survey_id' => $survey->id,
        'student_id' => $student->id,
        'submitted_at' => now(),
    ]);

    $this->get(route('student.dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('next_action.type', 'results')
            ->where('journey.survey', 'complete'));
});
