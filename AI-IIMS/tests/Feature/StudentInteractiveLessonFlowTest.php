<?php

use App\Enums\Role as RoleEnum;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Student;
use App\Models\StudentActivityAnswer;
use App\Models\StudentActivityAttempt;
use App\Models\StudentLessonQuestionAttempt;
use App\Models\Teacher;
use App\Models\TestAttempt;
use App\Models\User;
use App\Services\StudentLessonFlowService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

function createInteractiveFlowStudent(): array
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    Role::firstOrCreate(['name' => RoleEnum::STUDENT->value]);
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::STUDENT->value);
    $student = Student::query()->create([
        'user_id' => $user->id,
        'student_code' => 'FLOW-'.$user->id,
        'first_name' => 'Katherine',
        'last_name' => 'Johnson',
        'grade_level' => '11',
        'section' => 'A',
        'consent_status' => true,
    ]);
    TestAttempt::query()->create([
        'student_id' => $student->id,
        'test_type' => 'pretest',
        'score' => 1,
        'total_items' => 1,
        'percentage' => 100,
        'submitted_at' => now(),
    ]);

    return [$user, $student];
}

function createInteractiveFlowLesson(): Lesson
{
    $teacherUser = User::factory()->create();
    $teacher = Teacher::query()->create([
        'user_id' => $teacherUser->id,
        'employee_no' => 'FLOW-T-'.$teacherUser->id,
        'first_name' => 'Ada',
        'last_name' => 'Lovelace',
    ]);

    return Lesson::query()->create([
        'teacher_id' => $teacher->id,
        'title' => 'Forces and Motion',
        'subject' => 'Physical Science',
        'difficulty_level' => 'beginner',
        'is_published' => true,
    ]);
}

it('returns a safe teacher-ordered guided flow', function () {
    [$user] = createInteractiveFlowStudent();
    $lesson = createInteractiveFlowLesson();
    $section = $lesson->sections()->create([
        'title' => 'Read first',
        'content' => '<p>Start here.</p>',
        'sort_order' => 1,
    ]);
    $media = $section->media()->create([
        'lesson_id' => $lesson->id,
        'type' => 'image',
        'url' => '/forces.png',
        'caption' => 'Force diagram',
        'sort_order' => 1,
    ]);
    $activity = $section->lessonActivities()->create([
        'lesson_id' => $lesson->id,
        'type' => 'true_false',
        'title' => 'Force check',
        'payload' => ['statement' => 'A force can change motion.'],
        'correct_answer' => true,
        'record_score' => true,
        'sort_order' => 1,
    ]);
    $question = $lesson->questions()->create([
        'question_text' => 'Which quantity describes a push or pull?',
        'option_a' => 'Force',
        'option_b' => 'Volume',
        'option_c' => 'Temperature',
        'option_d' => 'Density',
        'correct_answer' => 'A',
    ]);

    $this->actingAs($user)->get(route('student.lessons.show', $lesson))
        ->assertInertia(fn (Assert $page) => $page
            ->where('lesson.flow.steps.0.key', "section:{$section->id}:reading")
            ->where('lesson.flow.steps.0.section_id', $section->id)
            ->where('lesson.flow.steps.1.key', "media:{$media->id}")
            ->where('lesson.flow.steps.2.key', "activity:{$activity->id}")
            ->where('lesson.flow.steps.3.key', "quiz:{$question->id}")
            ->where('lesson.flow.steps.0.status', 'current')
            ->where('lesson.flow.steps.1.status', 'locked')
            ->missing('lesson.activities.0.correct_answer')
            ->missing('lesson.questions.0.answer_id'));
});

it('requires reading and eventual activity mastery while preserving the first score', function () {
    [$user, $student] = createInteractiveFlowStudent();
    $lesson = createInteractiveFlowLesson();
    $section = $lesson->sections()->create([
        'title' => 'Balanced forces',
        'content' => '<p>Read before practicing.</p>',
        'sort_order' => 1,
    ]);
    $activity = $section->lessonActivities()->create([
        'lesson_id' => $lesson->id,
        'type' => 'true_false',
        'title' => 'Balanced check',
        'payload' => ['statement' => 'Balanced forces have zero net force.'],
        'correct_answer' => true,
        'record_score' => true,
        'sort_order' => 1,
    ]);

    $this->actingAs($user)
        ->postJson(route('student.activities.submit', $activity), ['answer' => false])
        ->assertStatus(422);

    $this->postJson(route('student.lessons.checkpoints.store', $lesson), [
        'step_key' => "section:{$section->id}:reading",
    ])->assertOk()->assertJsonPath('flow.steps.1.status', 'current');

    $this->postJson(route('student.activities.submit', $activity), ['answer' => false])
        ->assertOk()
        ->assertJsonPath('mastered', false)
        ->assertJsonMissingPath('correct_answer');
    $this->postJson(route('student.activities.submit', $activity), ['answer' => true])
        ->assertOk()
        ->assertJsonPath('mastered', true)
        ->assertJsonPath('first_score', 0);

    $firstAnswer = StudentActivityAnswer::query()->firstOrFail();
    expect($firstAnswer->is_correct)->toBeFalse()
        ->and((float) $firstAnswer->score)->toBe(0.0)
        ->and(StudentActivityAttempt::query()->count())->toBe(2);

    $progress = LessonProgress::query()->where('student_id', $student->id)->where('lesson_id', $lesson->id)->firstOrFail();
    expect($progress->status)->toBe('completed')
        ->and($progress->progress_percentage)->toBe(100)
        ->and((float) $progress->score_percentage)->toBe(0.0);
});

it('persists standalone question mastery without exposing the answer', function () {
    [$user, $student] = createInteractiveFlowStudent();
    $lesson = createInteractiveFlowLesson();
    $question = $lesson->questions()->create([
        'question_text' => 'What is the SI unit of force?',
        'option_a' => 'Joule',
        'option_b' => 'Newton',
        'option_c' => 'Watt',
        'option_d' => 'Pascal',
        'correct_answer' => 'B',
    ]);

    $this->actingAs($user)
        ->postJson(route('student.lesson-questions.attempts.store', $question), ['selected_answer' => 'A'])
        ->assertOk()
        ->assertJsonPath('mastered', false)
        ->assertJsonMissingPath('correct_answer');
    $this->postJson(route('student.lesson-questions.attempts.store', $question), ['selected_answer' => 'B'])
        ->assertOk()
        ->assertJsonPath('mastered', true)
        ->assertJsonPath('flow.progress_percentage', 100);

    expect(StudentLessonQuestionAttempt::query()->count())->toBe(2);
    $progress = LessonProgress::query()->where('student_id', $student->id)->where('lesson_id', $lesson->id)->firstOrFail();
    expect($progress->status)->toBe('completed');
});

it('tracks each video as one gated lesson unit', function () {
    [$user, $student] = createInteractiveFlowStudent();
    $lesson = createInteractiveFlowLesson();
    $section = $lesson->sections()->create([
        'title' => 'Watch after reading',
        'content' => '<p>Read this introduction.</p>',
        'sort_order' => 1,
    ]);
    $media = $section->media()->create([
        'lesson_id' => $lesson->id,
        'type' => 'video',
        'url' => 'https://example.com/force.mp4',
        'caption' => 'Force demonstration',
        'sort_order' => 1,
    ]);
    $cuePoint = $media->cuePoints()->create([
        'timestamp_seconds' => 20,
        'type' => 'info',
        'content' => 'Notice the direction of the force.',
    ]);

    $this->actingAs($user)->post(route('student.video-progress.update'), [
        'lesson_id' => $lesson->id,
        'media_id' => $media->id,
        'position_seconds' => 30,
        'completed' => true,
    ])->assertStatus(422);

    $this->postJson(route('student.lessons.checkpoints.store', $lesson), [
        'step_key' => "section:{$section->id}:reading",
    ])->assertOk();
    $this->post(route('student.video-progress.update'), [
        'lesson_id' => $lesson->id,
        'media_id' => $media->id,
        'position_seconds' => 120,
        'completed' => true,
    ])->assertStatus(422);
    $this->post(route('student.cue-points.respond', $cuePoint), [
        'answer' => 'acknowledged',
    ])->assertRedirect();
    $this->post(route('student.video-progress.update'), [
        'lesson_id' => $lesson->id,
        'media_id' => $media->id,
        'position_seconds' => 120,
        'completed' => true,
    ])->assertRedirect();

    $progress = LessonProgress::query()->where('student_id', $student->id)->where('lesson_id', $lesson->id)->firstOrFail();
    expect($progress->status)->toBe('completed')
        ->and($progress->progress_percentage)->toBe(100)
        ->and($progress->last_video_position_seconds)->toBe(120);
});

it('preserves completed legacy lesson progress when the guided flow is first opened', function () {
    [$user, $student] = createInteractiveFlowStudent();
    $lesson = createInteractiveFlowLesson();
    $lesson->update(['content' => '<p>Legacy reading content.</p>']);
    LessonProgress::query()->create([
        'student_id' => $student->id,
        'lesson_id' => $lesson->id,
        'status' => 'completed',
        'progress_percentage' => 100,
        'started_at' => now()->subDay(),
        'completed_at' => now()->subHour(),
    ]);

    $this->actingAs($user)->get(route('student.lessons.show', $lesson))
        ->assertInertia(fn (Assert $page) => $page
            ->where('lesson.flow.progress_percentage', 100)
            ->where('lesson.flow.steps.0.status', 'completed'));

    $this->assertDatabaseHas('student_lesson_step_progress', [
        'student_id' => $student->id,
        'lesson_id' => $lesson->id,
        'step_key' => 'legacy:content:0:reading',
    ]);
});

it('splits legacy lesson content into individual reading parts', function () {
    [, $student] = createInteractiveFlowStudent();
    $lesson = createInteractiveFlowLesson();
    $lesson->update([
        'content' => '<h2>Part One</h2><p>First idea.</p><h2>Part Two</h2><p>Second idea.</p>',
    ]);

    $flow = app(StudentLessonFlowService::class)->flowFor($lesson, $student);

    expect($flow['steps'])->toHaveCount(2)
        ->and($flow['steps'][0]['key'])->toBe('legacy:content:0:reading')
        ->and($flow['steps'][0]['title'])->toBe('Part One')
        ->and($flow['steps'][1]['key'])->toBe('legacy:content:1:reading')
        ->and($flow['steps'][1]['title'])->toBe('Part Two');
});

it('maps each stored section path to its own section content', function () {
    [, $student] = createInteractiveFlowStudent();
    $lesson = createInteractiveFlowLesson();
    $lesson->update(['content' => '<p>Combined fallback that must not render for section paths.</p>']);
    $first = $lesson->sections()->create([
        'title' => 'First section',
        'content' => '<p>Only the first section.</p>',
        'sort_order' => 1,
    ]);
    $second = $lesson->sections()->create([
        'title' => 'Second section',
        'content' => '<p>Only the second section.</p>',
        'sort_order' => 2,
    ]);

    $flow = app(StudentLessonFlowService::class)->flowFor($lesson, $student);

    expect($flow['steps'])->toHaveCount(2)
        ->and($flow['steps'][0]['section_id'])->toBe($first->id)
        ->and($flow['steps'][1]['section_id'])->toBe($second->id);
});

it('falls back to relationship queries when a loaded flow relation is null', function () {
    [, $student] = createInteractiveFlowStudent();
    $lesson = createInteractiveFlowLesson();
    $question = $lesson->questions()->create([
        'question_text' => 'Which unit measures force?',
        'option_a' => 'Newton',
        'option_b' => 'Metre',
        'option_c' => 'Second',
        'option_d' => 'Kelvin',
        'correct_answer' => 'A',
    ]);
    $lesson->setRelation('questions', null);

    $flow = app(StudentLessonFlowService::class)->flowFor($lesson, $student);

    expect($flow['steps'])->toHaveCount(1)
        ->and($flow['steps'][0]['key'])->toBe("quiz:{$question->id}");
});
