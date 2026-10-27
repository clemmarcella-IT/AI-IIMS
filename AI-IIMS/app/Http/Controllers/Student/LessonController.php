<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonActivity;
use App\Models\LessonMedia;
use App\Models\LessonProgress;
use App\Models\LessonQuestion;
use App\Models\Student;
use App\Models\StudentActivityAttempt;
use App\Models\StudentLessonQuestionAttempt;
use App\Notifications\SubjectLessonNotification;
use App\Services\StudentLessonFlowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function show(Request $request, Lesson $lesson, StudentLessonFlowService $flowService): Response|RedirectResponse
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);
        abort_unless($lesson->is_published, 404);

        $hasPretest = $student->testAttempts()
            ->where('test_type', 'pretest')
            ->exists();

        if (! $hasPretest) {
            return redirect()->route('student.pretest')
                ->with('warning', 'Please complete the pretest before accessing lessons.');
        }

        $this->markLessonNotificationsAsRead($request, $lesson);

        $lesson->load([
            'teacher:id,first_name,last_name',
            'sections.lessonActivities.question',
            'sections.lessonActivities.studentAnswers' => fn ($query) => $query->where('student_id', $student->id),
            'sections.media.cuePoints.responses' => fn ($query) => $query->where('student_id', $student->id),
            'media.cuePoints.responses' => fn ($query) => $query->where('student_id', $student->id),
            'lessonActivities.question',
            'lessonActivities.studentAnswers' => fn ($query) => $query->where('student_id', $student->id),
            'questions' => fn ($query) => $query->oldest('id'),
        ]);

        $progress = LessonProgress::query()
            ->where('student_id', $student->id)
            ->where('lesson_id', $lesson->id)
            ->first();

        $lessonData = [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'subject' => $lesson->subject,
            'topic' => $lesson->topic,
            'content' => $lesson->content,
            'objectives' => $lesson->objectives,
            'difficulty_level' => $lesson->difficulty_level,
            'teacher_name' => $lesson->teacher?->full_name,
            'updated_at' => $lesson->updated_at?->toDateString(),
            'sections' => $lesson->sections->map(fn ($section): array => [
                'id' => $section->id,
                'title' => $section->title,
                'content' => $section->content ?? '',
                'content_type' => $section->content_type ?? 'text',
                'sort_order' => $section->sort_order,
                'is_collapsible' => $section->is_collapsible,
                'media' => $section->media
                    ->map(fn (LessonMedia $media): array => $this->serializeMedia($media))
                    ->values()
                    ->all(),
                'activities' => $section->lessonActivities
                    ->filter(fn (LessonActivity $activity): bool => $activity->hasStudentVisibleContent())
                    ->map(fn (LessonActivity $activity): array => $this->serializeActivity($activity, $student))
                    ->values()
                    ->all(),
            ]),
            'media' => $lesson->media
                ->whereNull('lesson_section_id')
                ->map(fn (LessonMedia $media): array => $this->serializeMedia($media))
                ->values()
                ->all(),
            'activities' => $this->activitiesForStudent($lesson, $student),
            'questions' => $this->questionsForStudent($lesson, $student),
            'progress' => [
                'last_video_position_seconds' => $progress?->last_video_position_seconds ?? 0,
                'completed' => $progress?->status === 'completed',
            ],
            'flow' => $flowService->flowFor($lesson, $student),
        ];

        return Inertia::render('student/lessons/show', [
            'lesson' => $lessonData,
        ]);
    }

    public function index(Request $request): Response|RedirectResponse
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        $hasPretest = $student->testAttempts()
            ->where('test_type', 'pretest')
            ->exists();

        if (! $hasPretest) {
            return redirect()->route('student.pretest')
                ->with('warning', 'Please complete the pretest before accessing lessons.');
        }

        $lessons = Lesson::query()
            ->with([
                'teacher:id,first_name,last_name',
                'sections.lessonActivities.question',
                'sections.lessonActivities.studentAnswers' => fn ($query) => $query->where('student_id', $student->id),
                'sections.media',
                'media',
                'lessonActivities.question',
                'lessonActivities.studentAnswers' => fn ($query) => $query->where('student_id', $student->id),
                'questions' => fn ($query) => $query->oldest('id'),
            ])
            ->where('is_published', true)
            ->latest('updated_at')
            ->get([
                'id',
                'teacher_id',
                'title',
                'subject',
                'topic',
                'content',
                'objectives',
                'activities',
                'difficulty_level',
                'updated_at',
            ])
            ->map(fn (Lesson $lesson): array => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'subject' => $lesson->subject,
                'topic' => $lesson->topic,
                'content' => $lesson->content,
                'objectives' => $lesson->objectives,
                'difficulty_level' => $lesson->difficulty_level,
                'teacher_name' => $lesson->teacher?->full_name,
                'updated_at' => $lesson->updated_at?->toDateString(),
                'sections' => $lesson->sections->map(fn ($section): array => [
                    'id' => $section->id,
                    'title' => $section->title,
                    'content' => $section->content ?? '',
                    'content_type' => $section->content_type ?? 'text',
                    'sort_order' => $section->sort_order,
                    'is_collapsible' => $section->is_collapsible,
                    'media' => $section->media
                        ->map(fn ($media): array => [
                            'type' => $media->type,
                            'url' => $media->url,
                            'caption' => $media->caption,
                        ])
                        ->values()
                        ->all(),
                    'activities' => $section->lessonActivities
                        ->filter(fn (LessonActivity $activity): bool => $activity->hasStudentVisibleContent())
                        ->map(fn (LessonActivity $activity): array => $this->serializeActivity($activity, $student))
                        ->values()
                        ->all(),
                ]),
                'media' => $lesson->media
                    ->whereNull('lesson_section_id')
                    ->map(fn ($media): array => [
                        'type' => $media->type,
                        'url' => $media->url,
                        'caption' => $media->caption,
                    ])
                    ->values()
                    ->all(),
                'activities' => $this->activitiesForStudent($lesson, $student),
                'questions' => $this->questionsForStudent($lesson, $student),
            ]);

        return Inertia::render('student/lessons/index', [
            'lessons' => $lessons,
            'selectedSubject' => $this->selectedSubjectForRequest($request),
            'subjectNotifications' => $this->subjectNotificationsFor($request),
        ]);
    }

    private function selectedSubjectForRequest(Request $request): ?string
    {
        $subject = trim((string) $request->query('subject', ''));

        return $subject !== '' ? $subject : null;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function subjectNotificationsFor(Request $request): array
    {
        $user = $request->user();

        if (! $user) {
            return [];
        }

        return $user->unreadNotifications()
            ->where('type', SubjectLessonNotification::class)
            ->get()
            ->groupBy(fn ($notification): string => (string) ($notification->data['subject'] ?? 'General'))
            ->map(function ($notifications, string $subject): array {
                $latest = $notifications->sortByDesc('created_at')->first();

                return [
                    'subject' => $subject,
                    'count' => $notifications->count(),
                    'lesson_ids' => $notifications
                        ->map(fn ($notification): int => (int) ($notification->data['lesson_id'] ?? 0))
                        ->filter()
                        ->unique()
                        ->values()
                        ->all(),
                    'latest_message' => $this->notificationMessage($latest?->data ?? []),
                    'latest_at' => $latest?->created_at?->toDateString(),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function notificationMessage(array $data): string
    {
        $lessonTitle = (string) ($data['lesson_title'] ?? 'a lesson');
        $activityCount = (int) ($data['activity_count'] ?? 0);

        if (($data['event_type'] ?? null) === 'activity_added') {
            return $activityCount === 1
                ? "New activity added in {$lessonTitle}."
                : "{$activityCount} new activities added in {$lessonTitle}.";
        }

        return "New lesson added: {$lessonTitle}.";
    }

    private function markLessonNotificationsAsRead(Request $request, Lesson $lesson): void
    {
        $user = $request->user();

        if (! $user) {
            return;
        }

        $user->unreadNotifications()
            ->where('type', SubjectLessonNotification::class)
            ->get()
            ->filter(fn ($notification): bool => (int) ($notification->data['lesson_id'] ?? 0) === $lesson->id)
            ->each(fn ($notification) => $notification->markAsRead());
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function activitiesForStudent(Lesson $lesson, Student $student): array
    {
        if ($lesson->lessonActivities->isNotEmpty()) {
            return $lesson->lessonActivities
                ->whereNull('lesson_section_id')
                ->filter(fn (LessonActivity $activity): bool => $activity->hasStudentVisibleContent())
                ->map(fn (LessonActivity $activity): array => $this->serializeActivity($activity, $student))
                ->values()
                ->all();
        }

        return collect($lesson->activities ?? [])
            ->map(fn (array $activity, int $index): array => [
                'id' => "legacy-{$lesson->id}-{$index}",
                'type' => 'reflection',
                'title' => $activity['title'] ?? 'Activity',
                'instruction' => $activity['detail'] ?? '',
                'payload' => [
                    'prompt' => $activity['detail'] ?? '',
                ],
                'correct_answer' => null,
                'explanation' => null,
                'submitted_answer' => null,
                'submission' => null,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function questionsForStudent(Lesson $lesson, Student $student): array
    {
        $questions = $lesson->relationLoaded('questions') && $lesson->questions instanceof Collection
            ? $lesson->questions
            : $lesson->questions()->oldest('id')->get();

        return $questions
            ->filter(fn (LessonQuestion $question): bool => $question->lesson_activity_id === null)
            ->filter(fn (LessonQuestion $question): bool => $this->hasQuestionContent($question))
            ->map(function (LessonQuestion $question) use ($student): array {
                $attempts = StudentLessonQuestionAttempt::query()
                    ->where('student_id', $student->id)
                    ->where('lesson_question_id', $question->id)
                    ->oldest('attempt_number')
                    ->get();
                $latest = $attempts->last();

                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'options' => [
                        ['id' => 'A', 'label' => $question->option_a],
                        ['id' => 'B', 'label' => $question->option_b],
                        ['id' => 'C', 'label' => $question->option_c],
                        ['id' => 'D', 'label' => $question->option_d],
                    ],
                    'attempt_count' => $attempts->count(),
                    'mastered' => $attempts->contains('is_correct', true),
                    'latest_answer' => $latest?->selected_answer,
                    'latest_is_correct' => $latest?->is_correct,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeActivity(LessonActivity $activity, Student $student): array
    {
        $payload = $activity->payload ?? [];

        if ($activity->type === 'mini_quiz' && $activity->question) {
            $payload = [
                ...$payload,
                'question' => $payload['question'] ?? $activity->question->question_text,
                'choices' => $payload['choices'] ?? [
                    $activity->question->option_a,
                    $activity->question->option_b,
                    $activity->question->option_c,
                    $activity->question->option_d,
                ],
            ];
        }

        if ($activity->type === 'clickable_activity') {
            $payload['cards'] = collect($payload['cards'] ?? [])
                ->map(fn (array $card): array => [
                    'label' => $card['label'] ?? '',
                    'description' => $card['description'] ?? '',
                ])
                ->values()
                ->all();
        }

        $answer = $activity->studentAnswers->first();
        $attempts = StudentActivityAttempt::query()
            ->where('student_id', $student->id)
            ->where('lesson_activity_id', $activity->id)
            ->oldest('attempt_number')
            ->get();
        $latestAttempt = $attempts->last();
        $mastered = $answer && ($answer->is_correct === true || $answer->is_correct === null)
            || $attempts->contains('is_correct', true);

        return [
            'id' => $activity->id,
            'type' => $activity->type,
            'title' => $activity->title,
            'instruction' => $activity->instruction ?? '',
            'payload' => $payload,
            'submitted_answer' => $latestAttempt?->answer ?? $answer?->answer,
            'submission' => $answer ? [
                'is_correct' => $latestAttempt?->is_correct ?? $answer->is_correct,
                'score' => $latestAttempt?->score !== null ? (float) $latestAttempt->score : ($answer->score !== null ? (float) $answer->score : null),
                'feedback' => $latestAttempt?->feedback ?? $answer->feedback,
                'attempt_number' => max(1, $attempts->count()),
                'mastered' => $mastered,
                'first_score' => $answer->score !== null ? (float) $answer->score : null,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeMedia(LessonMedia $media): array
    {
        return [
            'id' => $media->id,
            'type' => $media->type,
            'url' => $media->url,
            'caption' => $media->caption,
            'cue_points' => $media->cuePoints
                ->map(fn ($cuePoint): array => [
                    'id' => $cuePoint->id,
                    'timestamp_seconds' => $cuePoint->timestamp_seconds,
                    'type' => $cuePoint->type,
                    'question' => $cuePoint->question,
                    'options' => $cuePoint->options ?? [],
                    'content' => $cuePoint->content,
                    'answered' => $cuePoint->responses->isNotEmpty(),
                ])
                ->values()
                ->all(),
        ];
    }

    private function hasQuestionContent(LessonQuestion $question): bool
    {
        return trim($question->question_text) !== ''
            && collect([
                $question->option_a,
                $question->option_b,
                $question->option_c,
                $question->option_d,
            ])->filter(fn (?string $option): bool => trim((string) $option) !== '')->count() >= 2
            && in_array($question->correct_answer, ['A', 'B', 'C', 'D'], true);
    }
}
