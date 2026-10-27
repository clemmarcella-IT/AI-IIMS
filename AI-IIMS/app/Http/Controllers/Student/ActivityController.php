<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\LessonActivity;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        $activities = LessonActivity::query()
            ->with([
                'lesson:id,title,subject,topic,is_published',
                'studentAnswers' => fn ($query) => $query->where('student_id', $student->id),
            ])
            ->whereHas('lesson', fn ($query) => $query->where('is_published', true))
            ->orderBy('lesson_id')
            ->orderBy('sort_order')
            ->get()
            ->filter(fn (LessonActivity $activity): bool => $activity->hasStudentVisibleContent())
            ->map(function (LessonActivity $activity): array {
                $answer = $activity->studentAnswers->first();

                return [
                    'id' => $activity->id,
                    'lesson_id' => $activity->lesson_id,
                    'lesson_title' => $activity->lesson?->title,
                    'subject' => $activity->lesson?->subject,
                    'topic' => $activity->lesson?->topic,
                    'type' => $activity->type,
                    'title' => $activity->title,
                    'record_score' => $activity->record_score,
                    'submitted' => $answer !== null,
                    'is_correct' => $answer?->is_correct,
                    'score' => $answer?->score !== null ? (float) $answer->score : null,
                    'feedback' => $answer?->feedback,
                ];
            })
            ->values();

        return Inertia::render('student/activities/index', [
            'activities' => $activities,
        ]);
    }
}
