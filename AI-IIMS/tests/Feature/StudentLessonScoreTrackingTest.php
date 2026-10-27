<?php

use App\Enums\Role as RoleEnum;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

function createLessonScoreStudent(): array
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();

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

it('tracks lesson score summaries when a student submits a graded activity', function () {
    [$user, $student] = createLessonScoreStudent();
    $teacherUser = User::factory()->create();
    $teacher = Teacher::query()->create([
        'user_id' => $teacherUser->id,
        'employee_no' => 'T-'.str_pad((string) $teacherUser->id, 4, '0', STR_PAD_LEFT),
        'first_name' => 'Ada',
        'last_name' => 'Lovelace',
    ]);
    $lesson = Lesson::query()->create([
        'teacher_id' => $teacher->id,
        'title' => 'Energy Transfer',
        'difficulty_level' => 'beginner',
        'is_published' => true,
    ]);
    $gradedActivity = $lesson->lessonActivities()->create([
        'type' => 'true_false',
        'title' => 'Heat check',
        'instruction' => 'Answer true or false.',
        'payload' => ['statement' => 'Heat can transfer by conduction.'],
        'correct_answer' => true,
        'record_score' => true,
        'sort_order' => 1,
    ]);
    $unrecordedActivity = $lesson->lessonActivities()->create([
        'type' => 'true_false',
        'title' => 'Practice check',
        'instruction' => 'Answer true or false.',
        'payload' => ['statement' => 'Practice answers can stay unrecorded.'],
        'correct_answer' => true,
        'record_score' => false,
        'sort_order' => 2,
    ]);

    $lesson->lessonActivities()->create([
        'type' => 'reflection',
        'title' => 'Reflection',
        'instruction' => 'What did you notice?',
        'payload' => ['prompt' => 'What did you notice?'],
        'sort_order' => 3,
    ]);

    $response = $this->actingAs($user)->postJson(
        route('student.activities.submit', $gradedActivity),
        ['answer' => true],
    );

    $response->assertOk()
        ->assertJson([
            'is_correct' => true,
            'score' => 1,
        ]);
    $this->actingAs($user)->postJson(
        route('student.activities.submit', $unrecordedActivity),
        ['answer' => true],
    )->assertOk();

    $progress = LessonProgress::query()
        ->where('student_id', $student->id)
        ->where('lesson_id', $lesson->id)
        ->firstOrFail();

    expect($progress->status)->toBe('in_progress')
        ->and($progress->progress_percentage)->toBe(67)
        ->and((float) $progress->earned_score)->toBe(1.0)
        ->and((float) $progress->total_score)->toBe(1.0)
        ->and((float) $progress->score_percentage)->toBe(100.0)
        ->and($progress->scored_activities_count)->toBe(1)
        ->and($progress->correct_activities_count)->toBe(1)
        ->and($progress->latest_scored_at)->not->toBeNull();
});

it('excludes empty activities from lesson progress completion', function () {
    [$user, $student] = createLessonScoreStudent();
    $teacherUser = User::factory()->create();
    $teacher = Teacher::query()->create([
        'user_id' => $teacherUser->id,
        'employee_no' => 'T-'.str_pad((string) $teacherUser->id, 4, '0', STR_PAD_LEFT),
        'first_name' => 'Ada',
        'last_name' => 'Lovelace',
    ]);
    $lesson = Lesson::query()->create([
        'teacher_id' => $teacher->id,
        'title' => 'Energy Transfer',
        'difficulty_level' => 'beginner',
        'is_published' => true,
    ]);
    $visibleActivity = $lesson->lessonActivities()->create([
        'type' => 'true_false',
        'title' => 'Heat check',
        'instruction' => 'Answer true or false.',
        'payload' => ['statement' => 'Heat can transfer by conduction.'],
        'correct_answer' => true,
        'record_score' => true,
        'sort_order' => 1,
    ]);
    $lesson->lessonActivities()->create([
        'type' => 'true_false',
        'title' => 'Empty check',
        'instruction' => '',
        'payload' => [],
        'correct_answer' => true,
        'record_score' => true,
        'sort_order' => 2,
    ]);

    $this->actingAs($user)->postJson(
        route('student.activities.submit', $visibleActivity),
        ['answer' => true],
    )->assertOk();

    $progress = LessonProgress::query()
        ->where('student_id', $student->id)
        ->where('lesson_id', $lesson->id)
        ->firstOrFail();

    expect($progress->status)->toBe('completed')
        ->and($progress->progress_percentage)->toBe(100)
        ->and($progress->completed_at)->not->toBeNull();
});

it('omits empty activities and mini quizzes from the student lesson payload', function () {
    [$user, $student] = createLessonScoreStudent();
    $student->testAttempts()->create([
        'test_type' => 'pretest',
        'score' => 1,
        'total_items' => 1,
        'percentage' => 100,
        'started_at' => now(),
        'submitted_at' => now(),
    ]);
    $teacherUser = User::factory()->create();
    $teacher = Teacher::query()->create([
        'user_id' => $teacherUser->id,
        'employee_no' => 'T-'.str_pad((string) $teacherUser->id, 4, '0', STR_PAD_LEFT),
        'first_name' => 'Ada',
        'last_name' => 'Lovelace',
    ]);
    $lesson = Lesson::query()->create([
        'teacher_id' => $teacher->id,
        'title' => 'Energy Transfer',
        'difficulty_level' => 'beginner',
        'is_published' => true,
    ]);
    $section = $lesson->sections()->create([
        'title' => 'Heat',
        'content' => '<p>Heat transfer basics.</p>',
        'sort_order' => 1,
        'is_collapsible' => true,
    ]);

    $section->lessonActivities()->create([
        'lesson_id' => $lesson->id,
        'type' => 'true_false',
        'title' => 'Visible section activity',
        'instruction' => 'Answer true or false.',
        'payload' => ['statement' => 'Heat can transfer by conduction.'],
        'correct_answer' => true,
        'sort_order' => 1,
    ]);
    $section->lessonActivities()->create([
        'lesson_id' => $lesson->id,
        'type' => 'true_false',
        'title' => 'Empty section activity',
        'instruction' => '',
        'payload' => [],
        'correct_answer' => true,
        'sort_order' => 2,
    ]);
    $lesson->lessonActivities()->create([
        'type' => 'reflection',
        'title' => 'Visible lesson activity',
        'instruction' => 'Write one example.',
        'payload' => ['prompt' => 'Where do you see heat transfer?'],
        'sort_order' => 3,
    ]);
    $lesson->lessonActivities()->create([
        'type' => 'reflection',
        'title' => 'Empty lesson activity',
        'instruction' => '',
        'payload' => [],
        'sort_order' => 4,
    ]);
    $lesson->questions()->create([
        'question_text' => 'Which process transfers heat through direct contact?',
        'option_a' => 'Conduction',
        'option_b' => 'Reflection',
        'option_c' => '',
        'option_d' => '',
        'correct_answer' => 'A',
    ]);
    $lesson->questions()->create([
        'question_text' => '',
        'option_a' => '',
        'option_b' => '',
        'option_c' => '',
        'option_d' => '',
        'correct_answer' => 'A',
    ]);

    $this->actingAs($user)
        ->get(route('student.lessons.show', $lesson))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('student/lessons/show')
            ->has('lesson.sections.0.activities', 1)
            ->where('lesson.sections.0.activities.0.title', 'Visible section activity')
            ->has('lesson.activities', 1)
            ->where('lesson.activities.0.title', 'Visible lesson activity')
            ->has('lesson.questions', 1)
            ->where('lesson.questions.0.question_text', 'Which process transfers heat through direct contact?'));
});
