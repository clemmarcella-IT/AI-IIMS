<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\CuePointRequest;
use App\Models\LessonCuePoint;
use App\Models\LessonMedia;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LessonCuePointController extends Controller
{
    public function store(CuePointRequest $request, LessonMedia $media): RedirectResponse
    {
        $this->authorizeMedia($request, $media);

        abort_unless($media->type === 'video', 422);

        $media->cuePoints()->create($this->cuePointData($request));

        return back()->with('success', 'Cue point added.');
    }

    public function update(CuePointRequest $request, LessonCuePoint $cuePoint): RedirectResponse
    {
        $cuePoint->load('media.lesson');
        $this->authorizeMedia($request, $cuePoint->media);

        $cuePoint->update($this->cuePointData($request));

        return back()->with('success', 'Cue point updated.');
    }

    public function destroy(Request $request, LessonCuePoint $cuePoint): RedirectResponse
    {
        $cuePoint->load('media.lesson');
        $this->authorizeMedia($request, $cuePoint->media);

        $cuePoint->delete();

        return back()->with('success', 'Cue point deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function cuePointData(CuePointRequest $request): array
    {
        $data = $request->validated();
        $type = (string) $data['type'];

        return [
            'timestamp_seconds' => $data['timestamp_seconds'],
            'type' => $type,
            'question' => in_array($type, ['quiz_mcq', 'quiz_open', 'pause_reflect'], true)
                ? ($data['question'] ?? null)
                : null,
            'options' => $type === 'quiz_mcq'
                ? collect($data['options'] ?? [])->map(fn ($option): string => (string) $option)->values()->all()
                : null,
            'correct_option' => $type === 'quiz_mcq' ? ($data['correct_option'] ?? null) : null,
            'explanation' => $type === 'quiz_mcq' ? ($data['explanation'] ?? null) : null,
            'content' => $type === 'info' ? ($data['content'] ?? null) : null,
        ];
    }

    private function authorizeMedia(Request $request, LessonMedia $media): void
    {
        $media->loadMissing('lesson');
        $teacher = $request->user()?->teacher;

        abort_unless($teacher instanceof Teacher, 403);
        abort_unless($media->lesson?->teacher_id === $teacher->id, 404);
    }
}
