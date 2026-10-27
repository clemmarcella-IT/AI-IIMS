<?php

use App\Enums\Role as RoleEnum;
use App\Models\Lesson;
use App\Models\LessonQuestion;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

function createTeacherLessonDraftUser(): array
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

it('saves an incomplete lesson as a draft', function () {
    [$user, $teacher] = createTeacherLessonDraftUser();

    $response = $this->actingAs($user)->post(route('teacher.lessons.store'), [
        'title' => '',
        'subject' => 'Science',
        'topic' => 'Cells',
        'difficulty_level' => 'beginner',
        'is_published' => false,
        'sections' => [
            [
                'title' => '',
                'content' => 'Cell membrane notes.',
                'sort_order' => 1,
                'is_collapsible' => true,
                'media' => [],
                'activities' => [
                    [
                        'type' => 'reflection',
                        'title' => '',
                        'instruction' => 'Write one question.',
                        'sort_order' => 1,
                    ],
                ],
            ],
        ],
        'media' => [],
        'activities' => [
            [
                'type' => 'reflection',
                'title' => '',
                'instruction' => 'Exit reflection.',
                'sort_order' => 1,
            ],
        ],
    ]);

    $lesson = Lesson::query()->where('teacher_id', $teacher->id)->firstOrFail();

    $response->assertRedirect(route('teacher.lessons.edit', $lesson));

    expect($lesson->title)->toBe('Untitled lesson draft')
        ->and($lesson->is_published)->toBeFalse()
        ->and($lesson->sections()->firstOrFail()->title)->toBe('Untitled section 1')
        ->and($lesson->lessonActivities()->pluck('title')->all())->toBe([
            'Untitled activity',
            'Untitled activity',
        ]);
});

it('still requires a title before publishing', function () {
    [$user] = createTeacherLessonDraftUser();

    $response = $this->actingAs($user)
        ->from(route('teacher.lessons.create'))
        ->post(route('teacher.lessons.store'), [
            'title' => '',
            'difficulty_level' => 'beginner',
            'is_published' => true,
            'sections' => [],
            'media' => [],
            'activities' => [],
        ]);

    $response->assertRedirect(route('teacher.lessons.create'));
    $response->assertSessionHasErrors('title');

    expect(Lesson::query()->count())->toBe(0);
});

it('redirects the legacy teacher questions page to lessons', function () {
    [$user] = createTeacherLessonDraftUser();

    $this->actingAs($user)
        ->get(route('teacher.questions.index'))
        ->assertRedirect(route('teacher.lessons.index'))
        ->assertSessionHas('info');
});

it('returns Gemini draft video media when Gemini provides a stable video URL', function () {
    [$user] = createTeacherLessonDraftUser();
    config(['services.gemini.key' => 'test-key']);

    Http::fake([
        'generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [[
                'content' => [
                    'parts' => [[
                        'text' => json_encode([
                            'title' => 'Photosynthesis Basics',
                            'subject' => 'Science',
                            'topic' => 'Photosynthesis',
                            'difficulty_level' => 'beginner',
                            'sections' => [[
                                'title' => 'How Plants Make Food',
                                'content' => '<p>Plants use sunlight to make food.</p>',
                                'is_collapsible' => true,
                                'media' => [[
                                    'type' => 'video',
                                    'url' => 'https://www.youtube.com/watch?v=abc123XYZ',
                                    'caption' => 'Photosynthesis overview video',
                                ]],
                                'activities' => [],
                            ]],
                            'activities' => [],
                        ]),
                    ]],
                ],
            ]],
        ], 200),
    ]);

    $this->actingAs($user)
        ->postJson(route('teacher.lessons.ai-suggestions.draft'), [
            'topic' => 'Photosynthesis',
            'difficulty_level' => 'beginner',
        ])
        ->assertOk()
        ->assertJsonPath('draft.sections.0.media.0.type', 'video')
        ->assertJsonPath('draft.sections.0.media.0.url', 'https://www.youtube.com/watch?v=abc123XYZ')
        ->assertJsonPath('draft.sections.0.media.0.caption', 'Photosynthesis overview video');
});

it('stores Gemini video media suggestions with normalized payloads', function () {
    [$user] = createTeacherLessonDraftUser();
    config(['services.gemini.key' => 'test-key']);

    Http::fake([
        'generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [[
                'content' => [
                    'parts' => [[
                        'text' => json_encode([[
                            'type' => 'media_suggestion',
                            'title' => 'Photosynthesis Video',
                            'content' => 'Use this short video before the activity.',
                            'payload' => [
                                'media_type' => 'video',
                                'url' => 'https://www.youtube.com/watch?v=abc123XYZ',
                                'caption' => 'Photosynthesis overview video',
                            ],
                        ]]),
                    ]],
                ],
            ]],
        ], 200),
    ]);

    $this->actingAs($user)
        ->postJson(route('teacher.lessons.ai-suggestions.generate'), [
            'title' => 'Photosynthesis Basics',
            'subject' => 'Science',
            'topic' => 'Photosynthesis',
            'difficulty_level' => 'beginner',
            'sections' => [],
            'media' => [],
            'activities' => [],
        ])
        ->assertOk()
        ->assertJsonPath('suggestions.0.type', 'media_suggestion')
        ->assertJsonPath('suggestions.0.payload.media_type', 'video')
        ->assertJsonPath('suggestions.0.payload.url', 'https://www.youtube.com/watch?v=abc123XYZ')
        ->assertJsonPath('suggestions.0.payload.caption', 'Photosynthesis overview video');

    $this->assertDatabaseHas('ai_lesson_suggestions', [
        'suggestion_type' => 'media_suggestion',
        'title' => 'Photosynthesis Video',
        'content' => 'Use this short video before the activity.',
    ]);
});

it('shows standalone lesson questions as end-of-lesson mini quizzes in the builder', function () {
    [$user, $teacher] = createTeacherLessonDraftUser();

    $lesson = Lesson::query()->create([
        'teacher_id' => $teacher->id,
        'title' => 'Media Literacy',
        'subject' => 'MIL',
        'topic' => 'Source evaluation',
        'difficulty_level' => 'beginner',
        'is_published' => false,
    ]);

    LessonQuestion::query()->create([
        'lesson_id' => $lesson->id,
        'question_text' => 'Which source is most credible?',
        'option_a' => 'An anonymous post',
        'option_b' => 'A peer-reviewed article',
        'option_c' => 'A rumor',
        'option_d' => 'A meme',
        'correct_answer' => 'B',
        'explanation' => 'Credible sources can be verified.',
    ]);

    $this->actingAs($user)
        ->get(route('teacher.lessons.edit', $lesson))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('teacher/lessons/create')
            ->where('lesson.activities.0.type', 'mini_quiz')
            ->where('lesson.activities.0.question', 'Which source is most credible?')
            ->where('lesson.activities.0.correct_answer', 'B')
        );
});

it('saves slide media on a lesson section', function () {
    [$user] = createTeacherLessonDraftUser();

    $this->actingAs($user)->post(route('teacher.lessons.store'), [
        'title' => 'Media Literacy Slides',
        'subject' => 'MIL',
        'topic' => 'Source evaluation',
        'difficulty_level' => 'beginner',
        'is_published' => false,
        'sections' => [
            [
                'title' => 'Slide deck',
                'content' => 'Review the deck.',
                'sort_order' => 1,
                'is_collapsible' => true,
                'media' => [
                    [
                        'type' => 'slides',
                        'url' => 'https://example.com/source-evaluation.pdf',
                        'caption' => 'Source evaluation deck',
                        'sort_order' => 1,
                    ],
                ],
                'activities' => [],
            ],
        ],
        'media' => [],
        'activities' => [],
    ])->assertSessionHasNoErrors();

    $this->assertDatabaseHas('lesson_media', [
        'type' => 'slides',
        'url' => 'https://example.com/source-evaluation.pdf',
        'caption' => 'Source evaluation deck',
    ]);
});

it('accepts uploaded slide decks up to ten megabytes', function () {
    Storage::fake('public');
    [$user] = createTeacherLessonDraftUser();

    $this->actingAs($user)->post(route('teacher.lessons.store'), [
        'title' => 'Uploaded Deck',
        'subject' => 'MIL',
        'topic' => 'Presentation',
        'difficulty_level' => 'beginner',
        'is_published' => false,
        'sections' => [
            [
                'title' => 'Deck',
                'content' => 'Open the deck.',
                'sort_order' => 1,
                'is_collapsible' => true,
                'media' => [
                    [
                        'type' => 'slides',
                        'file' => UploadedFile::fake()->create('lesson-deck.pptx', 9500),
                        'caption' => 'Uploaded deck',
                        'sort_order' => 1,
                    ],
                ],
                'activities' => [],
            ],
        ],
        'media' => [],
        'activities' => [],
    ])->assertSessionHasNoErrors();

    $this->assertDatabaseHas('lesson_media', [
        'type' => 'slides',
        'caption' => 'Uploaded deck',
    ]);

    $storedUrl = Lesson::query()->latest('id')->firstOrFail()->media()->firstOrFail()->url;
    $storedPath = ltrim(str_replace('/storage/', '', parse_url($storedUrl, PHP_URL_PATH) ?: ''), '/');

    Storage::disk('public')->assertExists($storedPath);
});
