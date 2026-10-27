<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\VideoProgressRequest;
use App\Models\Lesson;
use App\Models\LessonMedia;
use App\Models\LessonProgress;
use App\Models\Student;
use App\Models\StudentCueResponse;
use App\Models\StudentLessonStepProgress;
use App\Services\StudentLessonFlowService;
use Illuminate\Http\RedirectResponse;

class VideoProgressController extends Controller
{
    public function store(VideoProgressRequest $request, StudentLessonFlowService $flowService): RedirectResponse
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        $data = $request->validated();
        $lesson = Lesson::query()->findOrFail($data['lesson_id']);

        abort_unless($lesson->is_published, 404);

        $media = isset($data['media_id'])
            ? LessonMedia::query()->where('lesson_id', $lesson->id)->findOrFail($data['media_id'])
            : LessonMedia::query()->where('lesson_id', $lesson->id)->where('type', 'video')->oldest('sort_order')->first();
        $flowStep = $media
            ? collect($flowService->flowFor($lesson, $student)['steps'])->firstWhere('key', "media:{$media->id}")
            : null;
        abort_unless($media && $flowStep && $flowStep['is_unlocked'], 422);

        $completed = (bool) ($data['completed'] ?? false);
        if ($completed) {
            $cuePointIds = $media->cuePoints()->pluck('id');
            $answeredCuePoints = StudentCueResponse::query()
                ->where('student_id', $student->id)
                ->whereIn('lesson_cue_point_id', $cuePointIds)
                ->count();
            abort_unless($answeredCuePoints === $cuePointIds->count(), 422);
        }
        $progress = LessonProgress::query()->firstOrNew([
            'student_id' => $student->id,
            'lesson_id' => $lesson->id,
        ]);

        $progress->fill([
            'status' => $progress->status === 'completed' ? 'completed' : 'in_progress',
            'progress_percentage' => max((int) $progress->progress_percentage, 1),
            'started_at' => $progress->started_at ?? now(),
            'last_activity_at' => now(),
            'last_video_position_seconds' => $data['position_seconds'],
        ])->save();

        $stepProgress = StudentLessonStepProgress::query()->firstOrNew([
            'student_id' => $student->id,
            'lesson_id' => $lesson->id,
            'step_key' => "media:{$media->id}",
        ]);
        $stepProgress->fill([
            'lesson_media_id' => $media->id,
            'position_seconds' => max($stepProgress->position_seconds, $data['position_seconds']),
            'completed_at' => $completed ? ($stepProgress->completed_at ?? now()) : $stepProgress->completed_at,
        ])->save();
        $flowService->recalculate($lesson, $student);

        return back();
    }
}
