<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Jobs\WarmLessonAiFeedback;
use App\Models\Lesson;
use App\Models\LessonActivity;
use App\Models\LessonProgress;
use App\Models\LessonQuestion;
use App\Models\Student;
use App\Models\StudentActivityAnswer;
use App\Models\Teacher;
use App\Models\TestAttempt;
use App\Notifications\SubjectLessonNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LessonController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('teacher/lessons/create');
    }

    public function edit(Request $request, Lesson $lesson): Response
    {
        $teacher = $this->teacherFor($request);
        $this->authorizeLesson($lesson, $teacher);

        return Inertia::render('teacher/lessons/create', [
            'lesson' => $this->serializeLessonForBuilder($lesson),
        ]);
    }

    public function index(Request $request): Response
    {
        $teacher = $this->teacherFor($request);
        $lessonModels = $this->lessonsForTeacher($teacher);
        $lessonIds = $lessonModels->pluck('id');

        $lessons = $lessonModels->map(fn (Lesson $lesson): array => [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'subject' => $lesson->subject,
            'topic' => $lesson->topic,
            'content' => $lesson->content,
            'objectives' => $lesson->objectives,
            'activities' => $this->legacyActivitiesFor($lesson),
            'image_prompt' => $lesson->image_prompt,
            'video_prompt' => $lesson->video_prompt,
            'difficulty_level' => $lesson->difficulty_level,
            'is_published' => $lesson->is_published,
            'questions_count' => $lesson->questions->count(),
            'completed_count' => $lesson->progress
                ->where('status', 'completed')
                ->count(),
            'average_progress' => $this->roundedAverage(
                $lesson->progress->pluck('progress_percentage'),
            ),
            'average_score' => $this->roundedAverage(
                $lesson->progress
                    ->pluck('score_percentage')
                    ->filter(fn ($value) => $value !== null),
            ),
            'updated_at' => $lesson->updated_at?->toDateString(),
        ]);

        $students = Student::query()
            ->with([
                'testAttempts',
                'lessonProgress' => fn ($query) => $lessonIds->isEmpty()
                    ? $query->whereRaw('1 = 0')
                    : $query->whereIn('lesson_id', $lessonIds),
            ])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(function (Student $student): array {
                $pretest = $student->testAttempts->firstWhere('test_type', 'pretest');
                $posttest = $student->testAttempts->firstWhere('test_type', 'posttest');

                return [
                    'id' => $student->id,
                    'student_code' => $student->student_code,
                    'name' => $student->full_name,
                    'grade_level' => $student->grade_level,
                    'section' => $student->section,
                    'completed_lessons' => $student->lessonProgress
                        ->where('status', 'completed')
                        ->count(),
                    'average_progress' => $this->roundedAverage(
                        $student->lessonProgress->pluck('progress_percentage'),
                    ),
                    'average_lesson_score' => $this->roundedAverage(
                        $student->lessonProgress
                            ->pluck('score_percentage')
                            ->filter(fn ($value) => $value !== null),
                    ),
                    'pretest_percentage' => $pretest?->percentage !== null
                        ? (float) $pretest->percentage
                        : null,
                    'posttest_percentage' => $posttest?->percentage !== null
                        ? (float) $posttest->percentage
                        : null,
                    'updated_at' => $student->updated_at?->toDateString(),
                ];
            });

        $questions = LessonQuestion::query()
            ->with('lesson:id,teacher_id,title')
            ->whereHas(
                'lesson',
                fn ($query) => $query->where('teacher_id', $teacher->id),
            )
            ->latest('updated_at')
            ->get()
            ->map(fn (LessonQuestion $question): array => [
                'id' => $question->id,
                'lesson_id' => $question->lesson_id,
                'lesson_title' => $question->lesson?->title,
                'question_text' => $question->question_text,
                'option_a' => $question->option_a,
                'option_b' => $question->option_b,
                'option_c' => $question->option_c,
                'option_d' => $question->option_d,
                'correct_answer' => $question->correct_answer,
                'explanation' => $question->explanation,
                'updated_at' => $question->updated_at?->toDateString(),
            ]);

        $assessmentScores = TestAttempt::query()
            ->with('student:id,student_code,first_name,last_name')
            ->latest('submitted_at')
            ->latest('updated_at')
            ->get()
            ->map(fn (TestAttempt $attempt): array => [
                'id' => "test-{$attempt->id}",
                'student_code' => $attempt->student?->student_code,
                'student_name' => $attempt->student?->full_name ?? 'Unknown student',
                'score_type' => $attempt->test_type,
                'lesson_title' => null,
                'score' => $attempt->score,
                'total_items' => $attempt->total_items,
                'percentage' => (float) $attempt->percentage,
                'submitted_at' => $attempt->submitted_at?->toDateString(),
                'sort_date' => $attempt->submitted_at?->getTimestamp() ?? $attempt->updated_at?->getTimestamp() ?? 0,
            ]);
        $scores = $assessmentScores
            ->concat($this->lessonScoresFor($lessonIds))
            ->sortByDesc('sort_date')
            ->values()
            ->map(function (array $score): array {
                unset($score['sort_date']);

                return $score;
            });

        return Inertia::render('teacher/lessons/index', [
            'lessons' => $lessons,
            'students' => $students,
            'questions' => $questions,
            'scores' => $scores,
            'activityAnswerSummaries' => $this->activityAnswerSummariesFor($lessonIds),
            'initialPanel' => $this->initialPanelForRoute($request),
            'summary' => [
                'students_count' => $students->count(),
                'lessons_count' => $lessons->count(),
                'questions_count' => $questions->count(),
                'average_progress' => $this->roundedAverage(
                    $students->pluck('average_progress')->filter(fn ($value) => $value !== null),
                ),
                'average_pretest' => $this->roundedAverage(
                    $students->pluck('pretest_percentage')->filter(fn ($value) => $value !== null),
                ),
                'average_posttest' => $this->roundedAverage(
                    $students->pluck('posttest_percentage')->filter(fn ($value) => $value !== null),
                ),
                'average_lesson_score' => $this->roundedAverage(
                    $students->pluck('average_lesson_score')->filter(fn ($value) => $value !== null),
                ),
            ],
        ]);
    }

    public function reviewActivityAnswers(
        Request $request,
        Student $student,
        Lesson $lesson,
    ): Response {
        $teacher = $this->teacherFor($request);
        $this->authorizeLesson($lesson, $teacher);

        $lesson->load([
            'lessonActivities' => fn ($query) => $query
                ->with([
                    'question',
                    'studentAnswers' => fn ($query) => $query
                        ->where('student_id', $student->id),
                ])
                ->orderBy('sort_order'),
        ]);

        $answers = $lesson->lessonActivities
            ->map(function (LessonActivity $activity): array {
                $answer = $activity->studentAnswers->first();

                return [
                    'activity_id' => $activity->id,
                    'activity_title' => $activity->title,
                    'activity_type' => $activity->type,
                    'activity_instruction' => $activity->instruction,
                    'sort_order' => $activity->sort_order,
                    'answer' => $answer?->answer,
                    'correct_answer' => $this->correctAnswerForActivityReview($activity),
                    'is_correct' => $answer?->is_correct,
                    'score' => $answer?->score !== null ? (float) $answer->score : null,
                    'record_score' => (bool) $activity->record_score,
                    'feedback' => $answer?->feedback,
                    'submitted_at' => $answer?->updated_at?->toDateString(),
                    'has_answer' => $answer !== null,
                ];
            })
            ->values();

        $answered = $answers->where('has_answer', true);
        $scored = $answered->whereNotNull('score');
        $totalScore = $lesson->lessonActivities
            ->filter(fn (LessonActivity $activity): bool => (bool) $activity->record_score
                && $activity->type !== 'reflection')
            ->count();
        $score = (float) $scored->sum('score');

        return Inertia::render('teacher/activities/review', [
            'student' => [
                'id' => $student->id,
                'student_code' => $student->student_code,
                'name' => $student->full_name,
                'grade_level' => $student->grade_level,
                'section' => $student->section,
            ],
            'lesson' => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'subject' => $lesson->subject,
                'topic' => $lesson->topic,
            ],
            'summary' => [
                'answered_count' => $answered->count(),
                'total_activities' => $lesson->lessonActivities->count(),
                'correct_count' => $answered->where('is_correct', true)->count(),
                'needs_review_count' => $answered
                    ->filter(fn (array $answer): bool => $answer['is_correct'] !== true)
                    ->count(),
                'score' => $score,
                'total_score' => $totalScore,
                'score_percentage' => $totalScore > 0
                    ? round(($score / $totalScore) * 100, 2)
                    : null,
            ],
            'activityAnswers' => $answers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $teacher = $this->teacherFor($request);
        $data = $this->validatedLessonData($request);

        $lesson = null;

        $notification = DB::transaction(function () use (
            $data,
            &$lesson,
            $teacher,
        ): ?SubjectLessonNotification {
            $lesson = $teacher->lessons()->create([
                'title' => $this->lessonTitleForStorage($data),
                'subject' => $data['subject'] ?? null,
                'topic' => $data['topic'] ?? null,
                'content' => $data['content'] ?? $this->contentFromSections($data['sections'] ?? []),
                'difficulty_level' => $data['difficulty_level'],
                'is_published' => $data['is_published'],
            ]);

            $this->syncBuilderRecords($lesson, $data);

            if (! $lesson->is_published) {
                return null;
            }

            return $this->subjectLessonNotification(
                'lesson_added',
                $lesson,
                $lesson->lessonActivities()->count(),
            );
        });

        $this->notifyStudents($notification);

        if ($lesson?->is_published) {
            WarmLessonAiFeedback::dispatch($lesson->id)->afterCommit();
        }

        if (! $data['is_published'] && $lesson) {
            return redirect()
                ->route('teacher.lessons.edit', $lesson)
                ->with('success', 'Lesson draft saved.');
        }

        return redirect()
            ->route('teacher.lessons.index')
            ->with('success', 'Lesson created.');
    }

    public function update(Request $request, Lesson $lesson): RedirectResponse
    {
        $teacher = $this->teacherFor($request);
        $this->authorizeLesson($lesson, $teacher);
        $data = $this->validatedLessonData($request);
        $wasPublished = $lesson->is_published;
        $previousActivityCount = $lesson->lessonActivities()->count();

        $notification = DB::transaction(function () use (
            $data,
            $lesson,
            $previousActivityCount,
            $request,
            $wasPublished,
        ): ?SubjectLessonNotification {
            $hasBuilderPayload = $request->hasAny(['sections', 'media', 'activities']);

            $lesson->update([
                'title' => $this->lessonTitleForStorage($data),
                'subject' => $data['subject'] ?? null,
                'topic' => $data['topic'] ?? null,
                'content' => $data['content'] ?? ($hasBuilderPayload
                    ? $this->contentFromSections($data['sections'] ?? [])
                    : $lesson->content),
                'difficulty_level' => $data['difficulty_level'],
                'is_published' => $data['is_published'],
            ]);

            if ($hasBuilderPayload) {
                $this->syncBuilderRecords($lesson, $data);
            }

            $lesson->refresh();

            if (! $lesson->is_published) {
                return null;
            }

            $currentActivityCount = $lesson->lessonActivities()->count();

            if (! $wasPublished) {
                return $this->subjectLessonNotification(
                    'lesson_added',
                    $lesson,
                    $currentActivityCount,
                );
            }

            $addedActivityCount = $currentActivityCount - $previousActivityCount;

            if ($hasBuilderPayload && $addedActivityCount > 0) {
                return $this->subjectLessonNotification(
                    'activity_added',
                    $lesson,
                    $addedActivityCount,
                );
            }

            return null;
        });

        $this->notifyStudents($notification);

        if ($lesson->is_published) {
            WarmLessonAiFeedback::dispatch($lesson->id)->afterCommit();
        }

        return back()->with(
            'success',
            $data['is_published'] ? 'Lesson updated.' : 'Lesson draft saved.',
        );
    }

    public function destroy(Request $request, Lesson $lesson): RedirectResponse
    {
        $teacher = $this->teacherFor($request);
        $this->authorizeLesson($lesson, $teacher);

        $lesson->delete();

        return back()->with('success', 'Lesson deleted.');
    }

    public function batchDestroy(Request $request): RedirectResponse
    {
        $teacher = $this->teacherFor($request);
        $lessonIds = $this->validatedBatchLessonIds($request, $teacher);

        Lesson::query()
            ->where('teacher_id', $teacher->id)
            ->whereIn('id', $lessonIds)
            ->delete();

        return back()->with(
            'success',
            $lessonIds->count() === 1
                ? 'Lesson deleted.'
                : "{$lessonIds->count()} lessons deleted.",
        );
    }

    public function batchRepublish(Request $request): RedirectResponse
    {
        $teacher = $this->teacherFor($request);
        $lessonIds = $this->validatedBatchLessonIds($request, $teacher);

        DB::transaction(function () use ($lessonIds, $teacher): void {
            $activityIds = LessonActivity::query()
                ->whereIn('lesson_id', $lessonIds)
                ->pluck('id');

            if ($activityIds->isNotEmpty()) {
                StudentActivityAnswer::query()
                    ->whereIn('lesson_activity_id', $activityIds)
                    ->delete();
            }

            $cuePointIds = DB::table('lesson_cue_points')
                ->join(
                    'lesson_media',
                    'lesson_cue_points.lesson_media_id',
                    '=',
                    'lesson_media.id',
                )
                ->whereIn('lesson_media.lesson_id', $lessonIds)
                ->pluck('lesson_cue_points.id');

            if ($cuePointIds->isNotEmpty()) {
                DB::table('student_cue_responses')
                    ->whereIn('lesson_cue_point_id', $cuePointIds)
                    ->delete();
            }

            LessonProgress::query()
                ->whereIn('lesson_id', $lessonIds)
                ->delete();

            Lesson::query()
                ->where('teacher_id', $teacher->id)
                ->whereIn('id', $lessonIds)
                ->update(['is_published' => true]);
        });

        $lessonIds->each(fn (int $lessonId) => WarmLessonAiFeedback::dispatch($lessonId)->afterCommit());

        return back()->with(
            'success',
            $lessonIds->count() === 1
                ? 'Lesson republished and restarted.'
                : "{$lessonIds->count()} lessons republished and restarted.",
        );
    }

    public function duplicate(Request $request, Lesson $lesson): RedirectResponse
    {
        $teacher = $this->teacherFor($request);
        $this->authorizeLesson($lesson, $teacher);

        $copy = DB::transaction(function () use ($lesson, $teacher): Lesson {
            $builderPayload = $this->serializeLessonForBuilder($lesson);

            $copy = $teacher->lessons()->create([
                'title' => $lesson->title.' Copy',
                'subject' => $lesson->subject,
                'topic' => $lesson->topic,
                'content' => $lesson->content,
                'objectives' => $lesson->objectives,
                'activities' => $lesson->activities,
                'image_prompt' => $lesson->image_prompt,
                'video_prompt' => $lesson->video_prompt,
                'ai_suggestions' => $lesson->ai_suggestions,
                'difficulty_level' => $lesson->difficulty_level,
                'is_published' => false,
            ]);

            $this->syncBuilderRecords($copy, [
                'sections' => $builderPayload['sections'] ?? [],
                'media' => $builderPayload['media'] ?? [],
                'activities' => $builderPayload['activities'] ?? [],
            ]);

            return $copy;
        });

        return redirect()
            ->route('teacher.lessons.edit', $copy)
            ->with('success', 'Lesson duplicated as a draft.');
    }

    public function storeQuestion(Request $request): RedirectResponse
    {
        $teacher = $this->teacherFor($request);
        $data = $this->validatedQuestionData($request);
        $lesson = Lesson::findOrFail($data['lesson_id']);

        $this->authorizeLesson($lesson, $teacher);

        $lesson->questions()->create($data);

        if ($lesson->is_published) {
            WarmLessonAiFeedback::dispatch($lesson->id)->afterCommit();
        }

        return back()->with('success', 'Question created.');
    }

    public function updateQuestion(
        Request $request,
        LessonQuestion $question,
    ): RedirectResponse {
        $teacher = $this->teacherFor($request);
        $this->authorizeQuestion($question, $teacher);

        $data = $this->validatedQuestionData($request);
        $lesson = Lesson::findOrFail($data['lesson_id']);

        $this->authorizeLesson($lesson, $teacher);

        $question->update($data);

        if ($lesson->is_published) {
            WarmLessonAiFeedback::dispatch($lesson->id)->afterCommit();
        }

        return back()->with('success', 'Question updated.');
    }

    public function destroyQuestion(
        Request $request,
        LessonQuestion $question,
    ): RedirectResponse {
        $teacher = $this->teacherFor($request);
        $this->authorizeQuestion($question, $teacher);

        $question->delete();

        return back()->with('success', 'Question deleted.');
    }

    public function export(Request $request): StreamedResponse
    {
        $teacher = $this->teacherFor($request);
        $lessons = $this->lessonsForTeacher($teacher);
        $lessonIds = $lessons->pluck('id');
        $lessonScores = $this->lessonScoresFor($lessonIds);
        $students = Student::query()
            ->with([
                'testAttempts',
                'lessonProgress' => fn ($query) => $lessonIds->isEmpty()
                    ? $query->whereRaw('1 = 0')
                    : $query->whereIn('lesson_id', $lessonIds),
            ])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        return response()->streamDownload(function () use ($lessons, $lessonScores, $students): void {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['Lessons']);
            fputcsv($handle, [
                'Title',
                'Subject',
                'Topic',
                'Difficulty',
                'Status',
                'Questions',
                'Completed Students',
                'Average Progress',
                'Average Lesson Score',
            ]);

            foreach ($lessons as $lesson) {
                fputcsv($handle, [
                    $lesson->title,
                    $lesson->subject,
                    $lesson->topic,
                    $lesson->difficulty_level,
                    $lesson->is_published ? 'Published' : 'Draft',
                    $lesson->questions->count(),
                    $lesson->progress->where('status', 'completed')->count(),
                    $this->roundedAverage($lesson->progress->pluck('progress_percentage')),
                    $this->roundedAverage(
                        $lesson->progress
                            ->pluck('score_percentage')
                            ->filter(fn ($value) => $value !== null),
                    ),
                ]);
            }

            fputcsv($handle, []);
            fputcsv($handle, ['Students']);
            fputcsv($handle, [
                'Student Code',
                'Name',
                'Grade Level',
                'Section',
                'Completed Lessons',
                'Average Progress',
                'Average Lesson Score',
                'Pretest',
                'Posttest',
            ]);

            foreach ($students as $student) {
                $pretest = $student->testAttempts->firstWhere('test_type', 'pretest');
                $posttest = $student->testAttempts->firstWhere('test_type', 'posttest');

                fputcsv($handle, [
                    $student->student_code,
                    $student->full_name,
                    $student->grade_level,
                    $student->section,
                    $student->lessonProgress->where('status', 'completed')->count(),
                    $this->roundedAverage($student->lessonProgress->pluck('progress_percentage')),
                    $this->roundedAverage(
                        $student->lessonProgress
                            ->pluck('score_percentage')
                            ->filter(fn ($value) => $value !== null),
                    ),
                    $pretest?->percentage,
                    $posttest?->percentage,
                ]);
            }

            fputcsv($handle, []);
            fputcsv($handle, ['Lesson Scores']);
            fputcsv($handle, [
                'Student Code',
                'Student',
                'Lesson',
                'Score',
                'Total',
                'Percentage',
                'Submitted',
            ]);

            foreach ($lessonScores as $score) {
                fputcsv($handle, [
                    $score['student_code'],
                    $score['student_name'],
                    $score['lesson_title'],
                    $score['score'],
                    $score['total_items'],
                    $score['percentage'],
                    $score['submitted_at'],
                ]);
            }

            fputcsv($handle, []);
            fputcsv($handle, ['Questions']);
            fputcsv($handle, [
                'Lesson',
                'Question',
                'Option A',
                'Option B',
                'Option C',
                'Option D',
                'Correct Answer',
            ]);

            foreach ($lessons as $lesson) {
                foreach ($lesson->questions as $question) {
                    fputcsv($handle, [
                        $lesson->title,
                        $question->question_text,
                        $question->option_a,
                        $question->option_b,
                        $question->option_c,
                        $question->option_d,
                        $question->correct_answer,
                    ]);
                }
            }

            fclose($handle);
        }, 'teacher-data-export.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function syncBuilderRecords(Lesson $lesson, array $data): void
    {
        $this->deleteStoredLessonMedia($lesson, $this->submittedMediaUrls($data));

        $lesson->questions()->delete();
        $lesson->lessonActivities()->delete();
        $lesson->sections()->delete();
        $lesson->media()->delete();

        foreach (($data['sections'] ?? []) as $index => $section) {
            $lessonSection = $lesson->sections()->create([
                'title' => $this->sectionTitleForStorage($section, $index),
                'content' => $section['content'] ?? null,
                'content_type' => $section['content_type'] ?? 'text',
                'sort_order' => $section['sort_order'] ?? $index + 1,
                'is_collapsible' => $section['is_collapsible'] ?? true,
            ]);

            foreach (($section['media'] ?? []) as $mediaIndex => $media) {
                $url = $this->urlForMedia($media);

                if (! $url) {
                    continue;
                }

                $lesson->media()->create([
                    'lesson_section_id' => $lessonSection->id,
                    'type' => $media['type'],
                    'url' => $url,
                    'caption' => $media['caption'] ?? null,
                    'sort_order' => $media['sort_order'] ?? $mediaIndex + 1,
                ]);
            }

            foreach (($section['activities'] ?? []) as $activityIndex => $activityData) {
                $this->createActivityRecord(
                    $lesson,
                    $activityData,
                    $activityIndex,
                    $lessonSection->id,
                );
            }
        }

        foreach (($data['media'] ?? []) as $index => $media) {
            $url = $this->urlForMedia($media);

            if (! $url) {
                continue;
            }

            $lesson->media()->create([
                'type' => $media['type'],
                'url' => $url,
                'caption' => $media['caption'] ?? null,
                'sort_order' => $media['sort_order'] ?? $index + 1,
            ]);
        }

        foreach (($data['activities'] ?? []) as $index => $activityData) {
            $this->createActivityRecord($lesson, $activityData, $index);
        }
    }

    private function subjectLessonNotification(
        string $eventType,
        Lesson $lesson,
        int $activityCount = 0,
    ): SubjectLessonNotification {
        return new SubjectLessonNotification(
            $eventType,
            $lesson->id,
            $lesson->title,
            $lesson->subject,
            $activityCount,
        );
    }

    private function notifyStudents(?SubjectLessonNotification $notification): void
    {
        if (! $notification) {
            return;
        }

        Student::query()
            ->with('user:id')
            ->get()
            ->pluck('user')
            ->filter()
            ->each(fn ($user) => $user->notify($notification));
    }

    private function urlForMedia(array $media): ?string
    {
        $file = $media['file'] ?? null;

        if ($file instanceof UploadedFile) {
            $path = $file->store('lesson-media', 'public');

            return $path ? Storage::disk('public')->url($path) : null;
        }

        return filled($media['url'] ?? null) ? $media['url'] : null;
    }

    /**
     * @return array<int, string>
     */
    private function submittedMediaUrls(array $data): array
    {
        $urls = collect($data['media'] ?? [])
            ->pluck('url')
            ->merge(
                collect($data['sections'] ?? [])
                    ->flatMap(fn (array $section): array => $section['media'] ?? [])
                    ->pluck('url'),
            )
            ->filter(fn ($url): bool => filled($url))
            ->map(fn ($url): string => (string) $url)
            ->all();

        return array_values(array_unique($urls));
    }

    private function deleteStoredLessonMedia(Lesson $lesson, array $retainedUrls): void
    {
        $lesson->media()
            ->pluck('url')
            ->filter()
            ->reject(fn (string $url): bool => in_array($url, $retainedUrls, true))
            ->each(function (string $url): void {
                $path = $this->publicStoragePathFromUrl($url);

                if ($path) {
                    Storage::disk('public')->delete($path);
                }
            });
    }

    private function publicStoragePathFromUrl(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH) ?: $url;
        $storagePrefix = '/storage/';
        $storagePosition = strpos($path, $storagePrefix);

        if ($storagePosition === false) {
            return null;
        }

        return ltrim(substr($path, $storagePosition + strlen($storagePrefix)), '/');
    }

    private function createActivityRecord(
        Lesson $lesson,
        array $activityData,
        int $index,
        ?int $lessonSectionId = null,
    ): void {
        $activity = $lesson->lessonActivities()->create([
            'lesson_section_id' => $lessonSectionId,
            'type' => $activityData['type'],
            'title' => $this->activityTitleForStorage($activityData),
            'instruction' => $activityData['instruction'] ?? null,
            'payload' => $this->payloadForActivity($activityData),
            'correct_answer' => $this->correctAnswerForActivity($activityData),
            'explanation' => $activityData['explanation'] ?? null,
            'record_score' => filter_var(
                $activityData['record_score'] ?? ($activityData['type'] !== 'reflection'),
                FILTER_VALIDATE_BOOLEAN,
            ),
            'sort_order' => $activityData['sort_order'] ?? $index + 1,
        ]);

        if ($activityData['type'] === 'mini_quiz') {
            $this->createQuestionForActivity($lesson, $activity, $activityData);
        }
    }

    private function createQuestionForActivity(
        Lesson $lesson,
        LessonActivity $activity,
        array $activityData,
    ): void {
        $choices = $this->normalizedChoices($activityData['choices'] ?? []);

        $lesson->questions()->create([
            'lesson_activity_id' => $activity->id,
            'question_text' => $activityData['question']
                ?? $activityData['title']
                ?? 'Mini quiz question',
            'option_a' => $choices[0],
            'option_b' => $choices[1],
            'option_c' => $choices[2],
            'option_d' => $choices[3],
            'correct_answer' => $this->normalizedCorrectAnswer(
                $activityData['correct_answer'] ?? null,
                $choices,
            ),
            'explanation' => $activityData['explanation'] ?? null,
        ]);
    }

    private function teacherFor(Request $request): Teacher
    {
        $teacher = $request->user()?->teacher;

        abort_if(! $teacher, 403);

        return $teacher;
    }

    /**
     * @return Collection<int, Lesson>
     */
    private function lessonsForTeacher(Teacher $teacher): Collection
    {
        return $teacher->lessons()
            ->with([
                'lessonActivities.question',
                'questions',
                'progress:id,lesson_id,status,progress_percentage,score_percentage',
            ])
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
                'image_prompt',
                'video_prompt',
                'ai_suggestions',
                'difficulty_level',
                'is_published',
                'updated_at',
            ]);
    }

    /**
     * @param  Collection<int, int>  $lessonIds
     * @return Collection<int, array<string, mixed>>
     */
    private function lessonScoresFor(Collection $lessonIds): Collection
    {
        if ($lessonIds->isEmpty()) {
            return collect();
        }

        return LessonProgress::query()
            ->with([
                'lesson:id,title',
                'student:id,student_code,first_name,last_name',
            ])
            ->whereIn('lesson_id', $lessonIds)
            ->where('scored_activities_count', '>', 0)
            ->latest('latest_scored_at')
            ->latest('updated_at')
            ->get()
            ->map(fn (LessonProgress $progress): array => [
                'id' => "lesson-{$progress->id}",
                'student_code' => $progress->student?->student_code,
                'student_name' => $progress->student?->full_name ?? 'Unknown student',
                'score_type' => 'lesson',
                'lesson_title' => $progress->lesson?->title ?? 'Untitled lesson',
                'score' => (float) $progress->earned_score,
                'total_items' => (float) $progress->total_score,
                'percentage' => $progress->score_percentage !== null
                    ? (float) $progress->score_percentage
                    : null,
                'submitted_at' => ($progress->latest_scored_at ?? $progress->updated_at)?->toDateString(),
                'sort_date' => ($progress->latest_scored_at ?? $progress->updated_at)?->getTimestamp() ?? 0,
            ]);
    }

    /**
     * @param  Collection<int, int>  $lessonIds
     * @return Collection<int, array<string, mixed>>
     */
    private function activityAnswerSummariesFor(Collection $lessonIds): Collection
    {
        if ($lessonIds->isEmpty()) {
            return collect();
        }

        return StudentActivityAnswer::query()
            ->with([
                'student:id,student_code,first_name,last_name',
                'activity.lesson.lessonActivities',
            ])
            ->whereHas(
                'activity',
                fn ($query) => $query->whereIn('lesson_id', $lessonIds),
            )
            ->latest('updated_at')
            ->get()
            ->groupBy(fn (StudentActivityAnswer $answer): string => "{$answer->student_id}-{$answer->activity?->lesson_id}")
            ->map(function (Collection $answers): ?array {
                /** @var StudentActivityAnswer|null $firstAnswer */
                $firstAnswer = $answers->first();
                $student = $firstAnswer?->student;
                $lesson = $firstAnswer?->activity?->lesson;

                if (! $firstAnswer || ! $student || ! $lesson) {
                    return null;
                }

                $totalScore = $lesson->lessonActivities
                    ->filter(fn (LessonActivity $activity): bool => (bool) $activity->record_score
                        && $activity->type !== 'reflection')
                    ->count();
                $score = (float) $answers->sum('score');
                $latestSubmittedAt = $answers->max('updated_at');

                return [
                    'id' => "{$student->id}-{$lesson->id}",
                    'student_id' => $student->id,
                    'lesson_id' => $lesson->id,
                    'student_code' => $student->student_code,
                    'student_name' => $student->full_name,
                    'lesson_subject' => $lesson->subject,
                    'lesson_title' => $lesson->title,
                    'answered_count' => $answers->count(),
                    'total_activities' => $lesson->lessonActivities->count(),
                    'correct_count' => $answers->where('is_correct', true)->count(),
                    'needs_review_count' => $answers
                        ->filter(fn (StudentActivityAnswer $answer): bool => $answer->is_correct !== true)
                        ->count(),
                    'score' => $score,
                    'total_score' => $totalScore,
                    'score_percentage' => $totalScore > 0
                        ? round(($score / $totalScore) * 100, 2)
                        : null,
                    'latest_submitted_at' => $latestSubmittedAt?->toDateString(),
                    'review_url' => route('teacher.activities.review', [
                        'student' => $student,
                        'lesson' => $lesson,
                    ]),
                ];
            })
            ->filter()
            ->sortByDesc('latest_submitted_at')
            ->values();
    }

    private function correctAnswerForActivityReview(LessonActivity $activity): mixed
    {
        if ($activity->correct_answer !== null) {
            return $activity->correct_answer;
        }

        if ($activity->type === 'mini_quiz' && $activity->question) {
            $choices = [
                'A' => $activity->question->option_a,
                'B' => $activity->question->option_b,
                'C' => $activity->question->option_c,
                'D' => $activity->question->option_d,
            ];

            return $choices[$activity->question->correct_answer] ?? $activity->question->correct_answer;
        }

        if ($activity->type === 'clickable_activity') {
            return collect($activity->payload['cards'] ?? [])
                ->filter(fn (array $card): bool => (bool) ($card['is_correct'] ?? false))
                ->pluck('label')
                ->values()
                ->all();
        }

        return null;
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedLessonData(Request $request): array
    {
        $publishing = $request->boolean('is_published');

        return $request->validate([
            'title' => [
                $publishing ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
            'subject' => ['nullable', 'string', 'max:255'],
            'topic' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'difficulty_level' => [
                'required',
                Rule::in(['beginner', 'intermediate', 'advanced']),
            ],
            'is_published' => ['required', 'boolean'],
            'sections' => ['nullable', 'array'],
            'sections.*.title' => [
                $publishing ? 'required_with:sections' : 'nullable',
                'string',
                'max:255',
            ],
            'sections.*.content' => ['nullable', 'string'],
            'sections.*.content_type' => ['nullable', Rule::in(['text', 'slides'])],
            'sections.*.sort_order' => ['nullable', 'integer'],
            'sections.*.is_collapsible' => ['nullable', 'boolean'],
            'sections.*.media' => ['nullable', 'array'],
            'sections.*.media.*.type' => ['required', Rule::in(['image', 'video', 'link', 'slides'])],
            'sections.*.media.*.url' => ['nullable', 'string'],
            'sections.*.media.*.file' => [
                'nullable',
                'file',
                'max:10240',
                'mimes:jpg,jpeg,png,webp,gif,mp4,webm,pdf,doc,docx,ppt,pptx',
            ],
            'sections.*.media.*.caption' => ['nullable', 'string', 'max:255'],
            'sections.*.media.*.sort_order' => ['nullable', 'integer'],
            'sections.*.activities' => ['nullable', 'array'],
            'sections.*.activities.*.type' => [
                'required',
                Rule::in($this->activityTypes()),
            ],
            'sections.*.activities.*.title' => [
                $publishing ? 'required' : 'nullable',
                'string',
                'max:255',
            ],
            'sections.*.activities.*.instruction' => ['nullable', 'string'],
            'sections.*.activities.*.payload' => ['nullable', 'array'],
            'sections.*.activities.*.correct_answer' => ['nullable'],
            'sections.*.activities.*.explanation' => ['nullable', 'string'],
            'sections.*.activities.*.record_score' => ['nullable', 'boolean'],
            'sections.*.activities.*.sort_order' => ['nullable', 'integer'],
            'sections.*.activities.*.question' => ['nullable', 'string'],
            'sections.*.activities.*.statement' => ['nullable', 'string'],
            'sections.*.activities.*.sentence' => ['nullable', 'string'],
            'sections.*.activities.*.blank_label' => ['nullable', 'string', 'max:255'],
            'sections.*.activities.*.prompt' => ['nullable', 'string'],
            'sections.*.activities.*.choices' => ['nullable', 'array'],
            'sections.*.activities.*.choices.*' => ['nullable', 'string', 'max:255'],
            'sections.*.activities.*.pairs' => ['nullable', 'array'],
            'sections.*.activities.*.pairs.*.left' => ['nullable', 'string', 'max:255'],
            'sections.*.activities.*.pairs.*.right' => ['nullable', 'string', 'max:255'],
            'sections.*.activities.*.items' => ['nullable', 'array'],
            'sections.*.activities.*.items.*' => ['nullable', 'string', 'max:255'],
            'sections.*.activities.*.cards' => ['nullable', 'array'],
            'sections.*.activities.*.cards.*.label' => ['nullable', 'string', 'max:255'],
            'sections.*.activities.*.cards.*.description' => ['nullable', 'string'],
            'sections.*.activities.*.cards.*.is_correct' => ['nullable', 'boolean'],
            'media' => ['nullable', 'array'],
            'media.*.type' => ['required_with:media', Rule::in(['image', 'video', 'link', 'slides'])],
            'media.*.url' => ['nullable', 'string'],
            'media.*.file' => [
                'nullable',
                'file',
                'max:10240',
                'mimes:jpg,jpeg,png,webp,gif,mp4,webm,pdf,doc,docx,ppt,pptx',
            ],
            'media.*.caption' => ['nullable', 'string', 'max:255'],
            'media.*.sort_order' => ['nullable', 'integer'],
            'activities' => ['nullable', 'array'],
            'activities.*.type' => [
                'required_with:activities',
                Rule::in($this->activityTypes()),
            ],
            'activities.*.title' => [
                $publishing ? 'required_with:activities' : 'nullable',
                'string',
                'max:255',
            ],
            'activities.*.instruction' => ['nullable', 'string'],
            'activities.*.payload' => ['nullable', 'array'],
            'activities.*.record_score' => ['nullable', 'boolean'],
            'activities.*.sort_order' => ['nullable', 'integer'],
            'activities.*.question' => ['nullable', 'string'],
            'activities.*.statement' => ['nullable', 'string'],
            'activities.*.sentence' => ['nullable', 'string'],
            'activities.*.blank_label' => ['nullable', 'string', 'max:255'],
            'activities.*.prompt' => ['nullable', 'string'],
            'activities.*.choices' => ['nullable', 'array'],
            'activities.*.choices.*' => ['nullable', 'string', 'max:255'],
            'activities.*.pairs' => ['nullable', 'array'],
            'activities.*.pairs.*.left' => ['nullable', 'string', 'max:255'],
            'activities.*.pairs.*.right' => ['nullable', 'string', 'max:255'],
            'activities.*.items' => ['nullable', 'array'],
            'activities.*.items.*' => ['nullable', 'string', 'max:255'],
            'activities.*.cards' => ['nullable', 'array'],
            'activities.*.cards.*.label' => ['nullable', 'string', 'max:255'],
            'activities.*.cards.*.description' => ['nullable', 'string'],
            'activities.*.cards.*.is_correct' => ['nullable', 'boolean'],
            'activities.*.correct_answer' => ['nullable'],
            'activities.*.explanation' => ['nullable', 'string'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedQuestionData(Request $request): array
    {
        return $request->validate([
            'lesson_id' => ['required', 'integer', 'exists:lessons,id'],
            'question_text' => ['required', 'string'],
            'option_a' => ['required', 'string', 'max:255'],
            'option_b' => ['required', 'string', 'max:255'],
            'option_c' => ['required', 'string', 'max:255'],
            'option_d' => ['required', 'string', 'max:255'],
            'correct_answer' => ['required', Rule::in(['A', 'B', 'C', 'D'])],
            'explanation' => ['nullable', 'string'],
        ]);
    }

    private function validatedBatchLessonIds(
        Request $request,
        Teacher $teacher,
    ): Collection {
        $data = $request->validate([
            'lesson_ids' => ['required', 'array', 'min:1'],
            'lesson_ids.*' => [
                'integer',
                Rule::exists('lessons', 'id')
                    ->where(fn ($query) => $query->where('teacher_id', $teacher->id)),
            ],
        ]);

        return collect($data['lesson_ids'])
            ->map(fn ($id): int => (int) $id)
            ->unique()
            ->values();
    }

    private function authorizeLesson(Lesson $lesson, Teacher $teacher): void
    {
        abort_unless($lesson->teacher_id === $teacher->id, 404);
    }

    private function authorizeQuestion(
        LessonQuestion $question,
        Teacher $teacher,
    ): void {
        abort_unless($question->lesson?->teacher_id === $teacher->id, 404);
    }

    private function initialPanelForRoute(Request $request): string
    {
        return match ($request->route()?->getName()) {
            'teacher.students.index' => 'students',
            'teacher.questions.index' => 'questions',
            'teacher.results.index' => 'scores',
            'teacher.activities.index' => 'activity_answers',
            default => 'lessons',
        };
    }

    private function roundedAverage(Collection $values): ?int
    {
        if ($values->isEmpty()) {
            return null;
        }

        return (int) round($values->avg());
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function legacyActivitiesFor(Lesson $lesson): array
    {
        if ($lesson->lessonActivities->isNotEmpty()) {
            return $lesson->lessonActivities
                ->map(fn (LessonActivity $activity): array => [
                    'title' => $activity->title,
                    'detail' => $activity->instruction,
                ])
                ->all();
        }

        return $lesson->activities ?? [];
    }

    /**
     * @param  array<int, array<string, mixed>>  $sections
     */
    private function contentFromSections(array $sections): ?string
    {
        $content = collect($sections)
            ->map(function (array $section): ?string {
                $title = trim((string) ($section['title'] ?? ''));
                $body = trim((string) ($section['content'] ?? ''));

                if ($title === '' && $body === '') {
                    return null;
                }

                return trim($title."\n".$body);
            })
            ->filter()
            ->implode("\n\n");

        return $content !== '' ? $content : null;
    }

    private function lessonTitleForStorage(array $data): string
    {
        $title = trim((string) ($data['title'] ?? ''));

        return $title !== '' ? $title : 'Untitled lesson draft';
    }

    private function sectionTitleForStorage(array $section, int $index): string
    {
        $title = trim((string) ($section['title'] ?? ''));

        return $title !== '' ? $title : 'Untitled section '.($index + 1);
    }

    private function activityTitleForStorage(array $activityData): string
    {
        $title = trim((string) ($activityData['title'] ?? ''));

        return $title !== '' ? $title : 'Untitled activity';
    }

    /**
     * @param  array<int, string>  $choices
     * @return array<int, string>
     */
    private function normalizedChoices(array $choices): array
    {
        return collect([0, 1, 2, 3])
            ->map(fn (int $index): string => (string) ($choices[$index] ?? ''))
            ->all();
    }

    /**
     * @param  array<int, string>  $choices
     */
    private function normalizedCorrectAnswer(?string $answer, array $choices): string
    {
        $answer = trim((string) $answer);

        if (in_array($answer, ['A', 'B', 'C', 'D'], true)) {
            return $answer;
        }

        foreach ($choices as $index => $choice) {
            if ($answer !== '' && strcasecmp($answer, $choice) === 0) {
                return ['A', 'B', 'C', 'D'][$index];
            }
        }

        return 'A';
    }

    /**
     * @return array<int, string>
     */
    private function activityTypes(): array
    {
        return [
            'mini_quiz',
            'true_false',
            'fill_blank',
            'matching',
            'sequencing',
            'reflection',
            'clickable_activity',
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function payloadForActivity(array $activityData): ?array
    {
        if (isset($activityData['payload']) && is_array($activityData['payload'])) {
            return $activityData['payload'];
        }

        return match ($activityData['type']) {
            'mini_quiz' => [
                'question' => $activityData['question'] ?? '',
                'choices' => $this->normalizedChoices($activityData['choices'] ?? []),
            ],
            'true_false' => [
                'statement' => $activityData['statement'] ?? $activityData['instruction'] ?? '',
            ],
            'fill_blank' => [
                'sentence' => $activityData['sentence'] ?? '',
                'blank_label' => $activityData['blank_label'] ?? 'missing word',
            ],
            'matching' => [
                'pairs' => $this->normalizedPairs($activityData['pairs'] ?? []),
            ],
            'sequencing' => [
                'items' => $this->normalizedItems($activityData['items'] ?? []),
            ],
            'reflection' => [
                'prompt' => $activityData['prompt'] ?? $activityData['instruction'] ?? '',
            ],
            'clickable_activity' => [
                'question' => $activityData['question'] ?? $activityData['instruction'] ?? '',
                'cards' => $this->normalizedCards($activityData['cards'] ?? []),
            ],
            default => null,
        };
    }

    private function correctAnswerForActivity(array $activityData): mixed
    {
        return match ($activityData['type']) {
            'mini_quiz' => $this->correctChoiceValue(
                (string) ($activityData['correct_answer'] ?? 'A'),
                $this->normalizedChoices($activityData['choices'] ?? []),
            ),
            'true_false' => filter_var($activityData['correct_answer'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'fill_blank' => (string) ($activityData['correct_answer'] ?? ''),
            'matching' => $this->normalizedPairs($activityData['pairs'] ?? []),
            'sequencing' => $this->normalizedItems($activityData['items'] ?? []),
            'clickable_activity' => collect($this->normalizedCards($activityData['cards'] ?? []))
                ->filter(fn (array $card): bool => (bool) $card['is_correct'])
                ->pluck('label')
                ->values()
                ->all(),
            'reflection' => null,
            default => null,
        };
    }

    /**
     * @param  array<int, string>  $choices
     */
    private function correctChoiceValue(string $answer, array $choices): string
    {
        $key = $this->normalizedCorrectAnswer($answer, $choices);
        $index = array_search($key, ['A', 'B', 'C', 'D'], true);

        return $index === false ? ($choices[0] ?? '') : ($choices[$index] ?? '');
    }

    private function normalizedPairs(array $pairs): array
    {
        return collect($pairs)
            ->map(fn (array $pair): array => [
                'left' => (string) ($pair['left'] ?? ''),
                'right' => (string) ($pair['right'] ?? ''),
            ])
            ->filter(fn (array $pair): bool => $pair['left'] !== '' || $pair['right'] !== '')
            ->values()
            ->all();
    }

    private function normalizedItems(array $items): array
    {
        return collect($items)
            ->map(fn ($item): string => (string) $item)
            ->filter(fn (string $item): bool => trim($item) !== '')
            ->values()
            ->all();
    }

    private function normalizedCards(array $cards): array
    {
        return collect($cards)
            ->map(fn (array $card): array => [
                'label' => (string) ($card['label'] ?? ''),
                'description' => (string) ($card['description'] ?? ''),
                'is_correct' => (bool) ($card['is_correct'] ?? false),
            ])
            ->filter(fn (array $card): bool => $card['label'] !== '' || $card['description'] !== '')
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeActivityForBuilder(LessonActivity $activity): array
    {
        $payload = $activity->payload ?? [];
        $base = [
            'id' => (string) $activity->id,
            'type' => $activity->type,
            'title' => $activity->title,
            'instruction' => $activity->instruction ?? '',
            'sort_order' => $activity->sort_order,
            'correct_answer' => $activity->correct_answer,
            'explanation' => $activity->explanation ?? $activity->question?->explanation ?? '',
            'record_score' => $activity->record_score,
        ];

        if ($activity->type === 'mini_quiz') {
            $choices = $payload['choices'] ?? ($activity->question ? [
                $activity->question->option_a,
                $activity->question->option_b,
                $activity->question->option_c,
                $activity->question->option_d,
            ] : []);

            return [
                ...$base,
                'question' => $payload['question'] ?? $activity->question?->question_text ?? '',
                'choices' => $choices,
                'correct_answer' => $activity->correct_answer
                    ? $this->normalizedCorrectAnswer((string) $activity->correct_answer, $this->normalizedChoices($choices))
                    : ($activity->question?->correct_answer ?? 'A'),
            ];
        }

        return [
            ...$base,
            'question' => $payload['question'] ?? '',
            'statement' => $payload['statement'] ?? '',
            'sentence' => $payload['sentence'] ?? '',
            'blank_label' => $payload['blank_label'] ?? 'missing word',
            'prompt' => $payload['prompt'] ?? '',
            'pairs' => $payload['pairs'] ?? [],
            'items' => $payload['items'] ?? [],
            'cards' => $payload['cards'] ?? [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeLessonForBuilder(Lesson $lesson): array
    {
        $lesson->load([
            'sections.lessonActivities.question',
            'sections.media',
            'media',
            'lessonActivities.question',
            'questions',
        ]);

        $activityQuestionIds = $lesson->lessonActivities
            ->map(fn (LessonActivity $activity): ?int => $activity->question?->id)
            ->filter()
            ->values();

        $activityPayloads = $lesson->lessonActivities
            ->whereNull('lesson_section_id')
            ->map(fn (LessonActivity $activity): array => $this->serializeActivityForBuilder($activity))
            ->values();

        $questions = $lesson->relationLoaded('questions') && $lesson->getRelation('questions') instanceof Collection
            ? $lesson->getRelation('questions')
            : $lesson->questions()->oldest('id')->get();

        $standaloneQuestionPayloads = $questions
            ->reject(fn (LessonQuestion $question): bool => $activityQuestionIds->contains($question->id))
            ->values()
            ->map(function (LessonQuestion $question, int $index) use ($activityPayloads): array {
                $quizNumber = $activityPayloads->count() + $index + 1;

                return [
                    'id' => "question-{$question->id}",
                    'type' => 'mini_quiz',
                    'title' => "Mini Quiz {$quizNumber}",
                    'instruction' => 'Answer the question.',
                    'sort_order' => $quizNumber,
                    'question' => $question->question_text,
                    'choices' => [
                        $question->option_a,
                        $question->option_b,
                        $question->option_c,
                        $question->option_d,
                    ],
                    'correct_answer' => $question->correct_answer,
                    'explanation' => $question->explanation ?? '',
                ];
            });

        return [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'subject' => $lesson->subject,
            'topic' => $lesson->topic,
            'difficulty_level' => $lesson->difficulty_level,
            'is_published' => $lesson->is_published,
            'sections' => $lesson->sections->map(fn ($section): array => [
                'id' => (string) $section->id,
                'title' => $section->title,
                'content' => $section->content ?? '',
                'content_type' => $section->content_type ?? 'text',
                'sort_order' => $section->sort_order,
                'is_collapsible' => $section->is_collapsible,
                'media' => $section->media
                    ->map(fn ($media): array => [
                        'id' => (string) $media->id,
                        'type' => $media->type,
                        'source' => 'url',
                        'url' => $media->url,
                        'caption' => $media->caption,
                        'sort_order' => $media->sort_order,
                    ])
                    ->values()
                    ->all(),
                'activities' => $section->lessonActivities
                    ->map(fn (LessonActivity $activity): array => $this->serializeActivityForBuilder($activity))
                    ->values()
                    ->all(),
            ])->all(),
            'media' => $lesson->media
                ->whereNull('lesson_section_id')
                ->map(fn ($media): array => [
                    'id' => (string) $media->id,
                    'type' => $media->type,
                    'source' => 'url',
                    'url' => $media->url,
                    'caption' => $media->caption,
                    'sort_order' => $media->sort_order,
                ])
                ->values()
                ->all(),
            'activities' => $activityPayloads
                ->concat($standaloneQuestionPayloads)
                ->sortBy('sort_order')
                ->values()
                ->all(),
        ];
    }
}
