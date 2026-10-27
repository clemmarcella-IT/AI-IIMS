<?php

namespace App\Services;

use App\Models\Lesson;
use App\Models\LessonActivity;
use App\Models\LessonMedia;
use App\Models\LessonProgress;
use App\Models\LessonQuestion;
use App\Models\Student;
use App\Models\StudentActivityAnswer;
use App\Models\StudentActivityAttempt;
use App\Models\StudentLessonQuestionAttempt;
use App\Models\StudentLessonStepProgress;
use Illuminate\Support\Collection;

class StudentLessonFlowService
{
    /** @return array{steps: array<int, array<string, mixed>>, current_step_key: ?string, completed_units: int, total_units: int, progress_percentage: int} */
    public function flowFor(Lesson $lesson, Student $student): array
    {
        $steps = $this->baseSteps($lesson);
        $backfilled = $this->backfillLegacyProgress($lesson, $student, $steps);

        $stepProgress = StudentLessonStepProgress::query()
            ->where('student_id', $student->id)
            ->where('lesson_id', $lesson->id)
            ->get()
            ->keyBy('step_key');
        $completedKeys = $stepProgress->filter(fn (StudentLessonStepProgress $progress): bool => $progress->completed_at !== null)->keys()->flip();
        $answers = StudentActivityAnswer::query()
            ->where('student_id', $student->id)
            ->whereIn('lesson_activity_id', collect($steps)->where('type', 'activity')->pluck('source_id'))
            ->get()
            ->keyBy('lesson_activity_id');
        $masteredActivityIds = StudentActivityAttempt::query()
            ->where('student_id', $student->id)
            ->where('is_correct', true)
            ->pluck('lesson_activity_id')
            ->flip();
        $questionAttempts = StudentLessonQuestionAttempt::query()
            ->where('student_id', $student->id)
            ->whereIn('lesson_question_id', collect($steps)->where('type', 'quiz')->pluck('source_id'))
            ->get()
            ->groupBy('lesson_question_id');

        $steps = array_map(function (array $step) use ($completedKeys, $stepProgress, $answers, $masteredActivityIds, $questionAttempts): array {
            $completed = $completedKeys->has($step['key'])
                || (str_starts_with($step['key'], 'legacy:content:')
                    && $completedKeys->has('legacy:content:reading'));

            if ($step['type'] === 'activity') {
                $answer = $answers->get($step['source_id']);
                $completed = $completed || ($answer && ($answer->is_correct === true || $answer->is_correct === null))
                    || $masteredActivityIds->has($step['source_id']);
            }

            if ($step['type'] === 'quiz') {
                $completed = $completed || $questionAttempts
                    ->get($step['source_id'], collect())
                    ->contains(fn (StudentLessonQuestionAttempt $attempt): bool => $attempt->is_correct);
            }

            return [
                ...$step,
                'is_complete' => $completed,
                'position_seconds' => $stepProgress->get($step['key'])?->position_seconds ?? 0,
            ];
        }, $steps);

        $firstIncomplete = collect($steps)->search(fn (array $step): bool => ! $step['is_complete']);
        $firstIncomplete = $firstIncomplete === false ? null : $firstIncomplete;

        $steps = array_map(function (array $step, int $index) use ($firstIncomplete): array {
            $status = $step['is_complete']
                ? 'completed'
                : ($firstIncomplete === $index ? 'current' : 'locked');

            return [
                ...$step,
                'status' => $status,
                'is_unlocked' => $status !== 'locked',
            ];
        }, $steps, array_keys($steps));

        $completed = collect($steps)->where('is_complete', true)->count();
        $total = count($steps);

        $flow = [
            'steps' => $steps,
            'current_step_key' => $firstIncomplete === null ? ($steps[array_key_last($steps)]['key'] ?? null) : $steps[$firstIncomplete]['key'],
            'completed_units' => $completed,
            'total_units' => $total,
            'progress_percentage' => $total > 0 ? (int) round(($completed / $total) * 100) : 0,
        ];

        if ($backfilled) {
            LessonProgress::query()
                ->where('student_id', $student->id)
                ->where('lesson_id', $lesson->id)
                ->update([
                    'status' => $total > 0 && $completed === $total ? 'completed' : 'in_progress',
                    'progress_percentage' => $flow['progress_percentage'],
                    'completed_at' => $total > 0 && $completed === $total ? now() : null,
                ]);
        }

        return $flow;
    }

    public function completeCheckpoint(Lesson $lesson, Student $student, string $stepKey): array
    {
        $flow = $this->flowFor($lesson, $student);
        $step = collect($flow['steps'])->firstWhere('key', $stepKey);

        abort_unless(
            $step
                && $step['is_unlocked']
                && in_array($step['type'], ['reading', 'media'], true)
                && ($step['type'] !== 'media' || ($step['media_type'] ?? null) !== 'video'),
            422,
        );

        StudentLessonStepProgress::query()->updateOrCreate(
            ['student_id' => $student->id, 'lesson_id' => $lesson->id, 'step_key' => $stepKey],
            ['lesson_media_id' => $step['type'] === 'media' ? $step['source_id'] : null, 'completed_at' => now()],
        );

        return $this->recalculate($lesson, $student);
    }

    public function recalculate(Lesson $lesson, Student $student): array
    {
        $flow = $this->flowFor($lesson, $student);
        $activityIds = collect($flow['steps'])->where('type', 'activity')->pluck('source_id');
        $scorableIds = LessonActivity::query()
            ->whereIn('id', $activityIds)
            ->where('record_score', true)
            ->where('type', '!=', 'reflection')
            ->pluck('id');
        $answers = StudentActivityAnswer::query()
            ->where('student_id', $student->id)
            ->whereIn('lesson_activity_id', $scorableIds)
            ->whereNotNull('score')
            ->get();
        $progress = LessonProgress::query()->firstOrNew([
            'student_id' => $student->id,
            'lesson_id' => $lesson->id,
        ]);
        $hasInteraction = StudentActivityAnswer::query()
            ->where('student_id', $student->id)
            ->whereIn('lesson_activity_id', $activityIds)
            ->exists()
            || StudentLessonQuestionAttempt::query()
                ->where('student_id', $student->id)
                ->whereIn('lesson_question_id', collect($flow['steps'])->where('type', 'quiz')->pluck('source_id'))
                ->exists()
            || StudentLessonStepProgress::query()
                ->where('student_id', $student->id)
                ->where('lesson_id', $lesson->id)
                ->exists();
        $started = $flow['completed_units'] > 0 || $hasInteraction || $progress->exists;
        $complete = $flow['total_units'] > 0 && $flow['completed_units'] === $flow['total_units'];
        $earned = (float) $answers->sum('score');

        $progress->fill([
            'status' => $complete ? 'completed' : ($started ? 'in_progress' : 'not_started'),
            'progress_percentage' => $flow['progress_percentage'],
            'earned_score' => round($earned, 2),
            'total_score' => $scorableIds->count(),
            'score_percentage' => $scorableIds->isNotEmpty() ? round(($earned / $scorableIds->count()) * 100, 2) : null,
            'scored_activities_count' => $answers->count(),
            'correct_activities_count' => $answers->where('is_correct', true)->count(),
            'latest_scored_at' => $answers->max('updated_at'),
            'started_at' => $started ? ($progress->started_at ?? now()) : null,
            'completed_at' => $complete ? ($progress->completed_at ?? now()) : null,
            'last_activity_at' => $started ? now() : $progress->last_activity_at,
        ])->save();

        return $flow;
    }

    /** @return array<int, array<string, mixed>> */
    private function baseSteps(Lesson $lesson): array
    {
        $lesson->loadMissing(['sections.media', 'sections.lessonActivities.question', 'media', 'lessonActivities.question', 'questions']);
        $steps = [];
        $sections = $lesson->getRelation('sections') instanceof Collection
            ? $lesson->getRelation('sections')
            : $lesson->sections()->with(['media', 'lessonActivities.question'])->get();
        $lessonMedia = $lesson->getRelation('media') instanceof Collection
            ? $lesson->getRelation('media')
            : $lesson->media()->get();
        $lessonActivities = $lesson->getRelation('lessonActivities') instanceof Collection
            ? $lesson->getRelation('lessonActivities')
            : $lesson->lessonActivities()->with('question')->get();
        $questions = $lesson->getRelation('questions') instanceof Collection
            ? $lesson->getRelation('questions')
            : $lesson->questions()->get();

        if ($sections->isEmpty()) {
            if (trim((string) $lesson->objectives) !== '') {
                $steps[] = $this->step('legacy:objectives:reading', 'reading', null, 'Learning objectives', 'Read and review these learning objectives.');
            }

            foreach ($this->legacyContentParts((string) $lesson->content) as $index => $part) {
                $steps[] = $this->step(
                    "legacy:content:{$index}:reading",
                    'reading',
                    null,
                    $this->legacyPartTitle($part, $index, $lesson->topic),
                    'Read and review this lesson part.',
                    null,
                    ['part_index' => $index],
                );
            }
        }

        foreach ($sections as $section) {
            if (trim((string) $section->content) !== '') {
                $steps[] = $this->step(
                    "section:{$section->id}:reading",
                    'reading',
                    $section->id,
                    $section->title,
                    $section->content_type === 'slides' ? 'Review the slide deck.' : 'Read this section.',
                    $section->id,
                );
            }

            $sectionMedia = $section->getRelation('media') instanceof Collection
                ? $section->getRelation('media')
                : $section->media()->get();
            $sectionActivities = $section->getRelation('lessonActivities') instanceof Collection
                ? $section->getRelation('lessonActivities')
                : $section->lessonActivities()->with('question')->get();

            foreach ($sectionMedia as $media) {
                $steps[] = $this->mediaStep($media, $section->id);
            }

            foreach ($sectionActivities->filter(fn (LessonActivity $activity): bool => $activity->hasStudentVisibleContent()) as $activity) {
                $steps[] = $this->step("activity:{$activity->id}", 'activity', $activity->id, $activity->title, 'Practice and reach mastery.', $section->id);
            }
        }

        foreach ($lessonMedia->whereNull('lesson_section_id') as $media) {
            $steps[] = $this->mediaStep($media, null);
        }

        foreach ($lessonActivities->whereNull('lesson_section_id')->filter(fn (LessonActivity $activity): bool => $activity->hasStudentVisibleContent()) as $activity) {
            $steps[] = $this->step("activity:{$activity->id}", 'activity', $activity->id, $activity->title, 'Lesson practice and mastery.');
        }

        foreach ($questions->whereNull('lesson_activity_id')->filter(fn (LessonQuestion $question): bool => $this->hasQuestionContent($question)) as $question) {
            $steps[] = $this->step("quiz:{$question->id}", 'quiz', $question->id, 'Knowledge check', 'Answer correctly to complete the lesson.');
        }

        return $steps;
    }

    private function mediaStep(LessonMedia $media, ?int $sectionId): array
    {
        return $this->step("media:{$media->id}", 'media', $media->id, $media->caption ?: ucfirst($media->type).' resource', $media->type === 'video' ? 'Watch the video to the end.' : 'Open and review this resource.', $sectionId, ['media_type' => $media->type]);
    }

    private function step(string $key, string $type, int|string|null $sourceId, string $title, string $detail, ?int $sectionId = null, array $extra = []): array
    {
        return [...$extra, 'key' => $key, 'type' => $type, 'source_id' => $sourceId, 'section_id' => $sectionId, 'title' => $title, 'detail' => $detail];
    }

    private function hasQuestionContent(LessonQuestion $question): bool
    {
        return trim($question->question_text) !== ''
            && collect([$question->option_a, $question->option_b, $question->option_c, $question->option_d])->filter(fn ($option): bool => trim((string) $option) !== '')->count() >= 2
            && in_array($question->correct_answer, ['A', 'B', 'C', 'D'], true);
    }

    /** @return array<int, string> */
    private function legacyContentParts(string $content): array
    {
        $content = trim($content);

        if ($content === '') {
            return [];
        }

        $parts = preg_match('/<h[1-6]\b/i', $content)
            ? preg_split('/(?=<h[1-6]\b)/i', $content)
            : preg_split('/\R\s*\R/', $content);

        return collect($parts ?: [$content])
            ->map(fn (string $part): string => trim($part))
            ->filter()
            ->values()
            ->all();
    }

    private function legacyPartTitle(string $part, int $index, ?string $topic): string
    {
        if (preg_match('/<h[1-6][^>]*>(.*?)<\/h[1-6]>/is', $part, $matches)) {
            $heading = trim(strip_tags($matches[1]));

            if ($heading !== '') {
                return $heading;
            }
        }

        return $index === 0 && trim((string) $topic) !== ''
            ? (string) $topic
            : 'Part '.($index + 1);
    }

    private function backfillLegacyProgress(Lesson $lesson, Student $student, array $steps): bool
    {
        $progress = LessonProgress::query()->where('student_id', $student->id)->where('lesson_id', $lesson->id)->first();

        if (! $progress || StudentLessonStepProgress::query()->where('student_id', $student->id)->where('lesson_id', $lesson->id)->exists()) {
            return false;
        }

        $keys = $progress->status === 'completed'
            ? collect($steps)->pluck('key')
            : collect($steps)->whereIn('type', ['reading', 'media'])->pluck('key');

        foreach ($keys as $key) {
            StudentLessonStepProgress::query()->create([
                'student_id' => $student->id,
                'lesson_id' => $lesson->id,
                'step_key' => $key,
                'completed_at' => $progress->updated_at ?? now(),
            ]);
        }

        return true;
    }
}
