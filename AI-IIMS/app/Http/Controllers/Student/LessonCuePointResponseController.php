<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\CuePointResponseRequest;
use App\Models\LessonCuePoint;
use App\Models\Student;
use App\Models\StudentCueResponse;
use Illuminate\Http\RedirectResponse;

class LessonCuePointResponseController extends Controller
{
    public function store(CuePointResponseRequest $request, LessonCuePoint $cuePoint): RedirectResponse
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        $cuePoint->load('media.lesson');
        abort_unless($cuePoint->media?->lesson?->is_published, 404);

        $answer = $request->validated('answer');

        StudentCueResponse::query()->updateOrCreate(
            [
                'student_id' => $student->id,
                'lesson_cue_point_id' => $cuePoint->id,
            ],
            [
                'answer' => ['value' => $answer],
                'is_correct' => $this->isCorrect($cuePoint, $answer),
                'answered_at' => now(),
            ],
        );

        return back()->with('success', 'Response saved.');
    }

    private function isCorrect(LessonCuePoint $cuePoint, mixed $answer): ?bool
    {
        if ($cuePoint->type !== 'quiz_mcq') {
            return null;
        }

        return trim((string) $answer) === trim((string) $cuePoint->correct_option);
    }
}
