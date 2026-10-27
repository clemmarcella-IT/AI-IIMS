<?php

use App\Enums\Role as RoleEnum;
use App\Models\Lesson;
use App\Models\LessonCuePoint;
use App\Models\LessonMedia;
use App\Models\LessonProgress;
use App\Models\Student;
use App\Models\StudentCueResponse;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

function createCueTeacher(): array
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

function createCueStudent(): array
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

function createCueLesson(Teacher $teacher, bool $published = true): Lesson
{
    return Lesson::query()->create([
        'teacher_id' => $teacher->id,
        'title' => 'Interactive Video',
        'difficulty_level' => 'beginner',
        'is_published' => $published,
    ]);
}

function createCueMedia(Lesson $lesson): LessonMedia
{
    return $lesson->media()->create([
        'type' => 'video',
        'url' => 'https://example.com/video.mp4',
        'caption' => 'Video',
        'sort_order' => 1,
    ]);
}

it('lets a teacher create update and delete cue points for their own video media', function () {
    [$user, $teacher] = createCueTeacher();
    $media = createCueMedia(createCueLesson($teacher));

    $this->actingAs($user)->post(route('teacher.cue-points.store', $media), [
        'timestamp_seconds' => 45,
        'type' => 'quiz_mcq',
        'question' => 'What happened?',
        'options' => ['A', 'B', 'C', 'D'],
        'correct_option' => 'B',
        'explanation' => 'B is correct.',
    ])->assertRedirect();

    $cuePoint = LessonCuePoint::query()->firstOrFail();

    expect($cuePoint->timestamp_seconds)->toBe(45)
        ->and($cuePoint->options)->toBe(['A', 'B', 'C', 'D']);

    $this->actingAs($user)->put(route('teacher.cue-points.update', $cuePoint), [
        'timestamp_seconds' => 50,
        'type' => 'info',
        'content' => 'Remember this idea.',
    ])->assertRedirect();

    expect($cuePoint->refresh()->timestamp_seconds)->toBe(50)
        ->and($cuePoint->type)->toBe('info')
        ->and($cuePoint->content)->toBe('Remember this idea.');

    $this->actingAs($user)
        ->delete(route('teacher.cue-points.destroy', $cuePoint))
        ->assertRedirect();

    $this->assertDatabaseMissing('lesson_cue_points', ['id' => $cuePoint->id]);
});

it('prevents teachers from changing cue points on another teacher lesson', function () {
    [$ownerUser, $ownerTeacher] = createCueTeacher();
    [$otherUser] = createCueTeacher();
    $media = createCueMedia(createCueLesson($ownerTeacher));

    $this->actingAs($ownerUser)->post(route('teacher.cue-points.store', $media), [
        'timestamp_seconds' => 12,
        'type' => 'info',
        'content' => 'Owner note.',
    ]);

    $cuePoint = LessonCuePoint::query()->firstOrFail();

    $this->actingAs($otherUser)->put(route('teacher.cue-points.update', $cuePoint), [
        'timestamp_seconds' => 15,
        'type' => 'info',
        'content' => 'Changed.',
    ])->assertNotFound();
});

it('stores mcq cue responses with correctness and prevents duplicate rows', function () {
    [$teacherUser, $teacher] = createCueTeacher();
    [$studentUser, $student] = createCueStudent();
    $media = createCueMedia(createCueLesson($teacher));

    $this->actingAs($teacherUser)->post(route('teacher.cue-points.store', $media), [
        'timestamp_seconds' => 20,
        'type' => 'quiz_mcq',
        'question' => 'Choose one.',
        'options' => ['Alpha', 'Beta', 'Gamma', 'Delta'],
        'correct_option' => 'Beta',
    ]);

    $cuePoint = LessonCuePoint::query()->firstOrFail();

    $this->actingAs($studentUser)
        ->post(route('student.cue-points.respond', $cuePoint), ['answer' => 'Beta'])
        ->assertRedirect();

    $this->actingAs($studentUser)
        ->post(route('student.cue-points.respond', $cuePoint), ['answer' => 'Beta'])
        ->assertRedirect();

    $response = StudentCueResponse::query()
        ->where('student_id', $student->id)
        ->where('lesson_cue_point_id', $cuePoint->id)
        ->firstOrFail();

    expect(StudentCueResponse::query()->count())->toBe(1)
        ->and($response->is_correct)->toBeTrue()
        ->and($response->answer)->toBe(['value' => 'Beta']);
});

it('stores open reflection and info cue responses without correctness', function () {
    [$teacherUser, $teacher] = createCueTeacher();
    [$studentUser] = createCueStudent();
    $media = createCueMedia(createCueLesson($teacher));

    $this->actingAs($teacherUser)->post(route('teacher.cue-points.store', $media), [
        'timestamp_seconds' => 20,
        'type' => 'pause_reflect',
        'question' => 'What do you notice?',
    ]);

    $cuePoint = LessonCuePoint::query()->firstOrFail();

    $this->actingAs($studentUser)
        ->post(route('student.cue-points.respond', $cuePoint), ['answer' => 'A pattern.'])
        ->assertRedirect();

    expect(StudentCueResponse::query()->firstOrFail()->is_correct)->toBeNull();
});

it('rejects cue responses for unpublished lessons', function () {
    [$teacherUser, $teacher] = createCueTeacher();
    [$studentUser] = createCueStudent();
    $media = createCueMedia(createCueLesson($teacher, false));

    $this->actingAs($teacherUser)->post(route('teacher.cue-points.store', $media), [
        'timestamp_seconds' => 20,
        'type' => 'info',
        'content' => 'Hidden note.',
    ]);

    $cuePoint = LessonCuePoint::query()->firstOrFail();

    $this->actingAs($studentUser)
        ->post(route('student.cue-points.respond', $cuePoint), ['answer' => 'acknowledged'])
        ->assertNotFound();
});

it('stores video position and marks completion', function () {
    [, $teacher] = createCueTeacher();
    [$studentUser, $student] = createCueStudent();
    $lesson = createCueLesson($teacher);
    $media = createCueMedia($lesson);

    $this->actingAs($studentUser)->post(route('student.video-progress.update'), [
        'lesson_id' => $lesson->id,
        'media_id' => $media->id,
        'position_seconds' => 61,
        'completed' => false,
    ])->assertRedirect();

    $this->actingAs($studentUser)->post(route('student.video-progress.update'), [
        'lesson_id' => $lesson->id,
        'media_id' => $media->id,
        'position_seconds' => 120,
        'completed' => true,
    ])->assertRedirect();

    $progress = LessonProgress::query()
        ->where('student_id', $student->id)
        ->where('lesson_id', $lesson->id)
        ->firstOrFail();

    expect($progress->last_video_position_seconds)->toBe(120)
        ->and($progress->status)->toBe('completed')
        ->and($progress->progress_percentage)->toBe(100)
        ->and($progress->completed_at)->not->toBeNull();
});

it('saves cue points from the lesson builder draft payload', function () {
    [$teacherUser] = createCueTeacher();

    $this->actingAs($teacherUser)->post(route('teacher.lessons.store'), [
        'title' => 'Draft with local cue',
        'subject' => 'Science',
        'topic' => 'Motion',
        'difficulty_level' => 'beginner',
        'is_published' => false,
        'sections' => [
            [
                'title' => 'Watch',
                'content' => '',
                'sort_order' => 1,
                'is_collapsible' => true,
                'media' => [
                    [
                        'type' => 'video',
                        'url' => 'https://example.com/draft-video.mp4',
                        'caption' => 'Draft video',
                        'sort_order' => 1,
                        'cue_points' => [
                            [
                                'timestamp_seconds' => 42,
                                'type' => 'info',
                                'content' => 'Notice this detail.',
                            ],
                        ],
                    ],
                ],
                'activities' => [],
            ],
        ],
        'media' => [],
        'activities' => [],
    ])->assertRedirect();

    $cuePoint = LessonCuePoint::query()->firstOrFail();

    expect($cuePoint->timestamp_seconds)->toBe(42)
        ->and($cuePoint->type)->toBe('info')
        ->and($cuePoint->content)->toBe('Notice this detail.')
        ->and($cuePoint->media->url)->toBe('https://example.com/draft-video.mp4');
});

it('keeps video cue points when a lesson draft is published', function () {
    [$teacherUser, $teacher] = createCueTeacher();
    $lesson = createCueLesson($teacher, false);
    $media = createCueMedia($lesson);

    $this->actingAs($teacherUser)->post(route('teacher.cue-points.store', $media), [
        'timestamp_seconds' => 33,
        'type' => 'quiz_open',
        'question' => 'What changed in this scene?',
    ]);

    $this->actingAs($teacherUser)->put(route('teacher.lessons.update', $lesson), [
        'title' => $lesson->title,
        'subject' => 'Science',
        'topic' => 'Motion',
        'difficulty_level' => 'beginner',
        'is_published' => true,
        'sections' => [],
        'media' => [
            [
                'id' => (string) $media->id,
                'type' => 'video',
                'url' => $media->url,
                'caption' => $media->caption,
                'sort_order' => 1,
            ],
        ],
        'activities' => [],
    ])->assertRedirect(route('teacher.lessons.index'));

    expect(LessonCuePoint::query()->count())->toBe(1);

    $cuePoint = LessonCuePoint::query()->firstOrFail();

    expect($cuePoint->timestamp_seconds)->toBe(33)
        ->and($cuePoint->question)->toBe('What changed in this scene?')
        ->and($cuePoint->media->lesson_id)->toBe($lesson->id);
});
