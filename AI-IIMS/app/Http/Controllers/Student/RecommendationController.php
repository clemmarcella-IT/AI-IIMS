<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecommendationController extends Controller
{
    public function index(Request $request): Response
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);

        $hasPretest = $student->testAttempts()->where('test_type', 'pretest')->exists();
        $hasPosttest = $student->testAttempts()->where('test_type', 'posttest')->exists();
        $progress = LessonProgress::query()
            ->with('lesson:id,title,subject,topic')
            ->where('student_id', $student->id)
            ->get();
        $published = Lesson::query()->where('is_published', true)->latest('updated_at')->get(['id', 'title', 'subject', 'topic']);
        $startedIds = $progress->pluck('lesson_id');
        $nextLesson = $progress->firstWhere('status', 'in_progress')?->lesson
            ?? $published->first(fn (Lesson $lesson): bool => ! $startedIds->contains($lesson->id));

        $recommendations = collect();

        if (! $hasPretest) {
            $recommendations->push($this->item('Take the pretest', 'Unlock lessons and set your baseline score.', '/student/pretest', 'assessment'));
        }

        if ($hasPretest && $nextLesson) {
            $recommendations->push($this->item('Continue learning', "Work on {$nextLesson->title}.", "/student/lessons/{$nextLesson->id}", 'lesson'));
        }

        $lowScore = $progress
            ->filter(fn (LessonProgress $item): bool => $item->score_percentage !== null && (float) $item->score_percentage < 75)
            ->sortBy('score_percentage')
            ->first();

        if ($lowScore?->lesson) {
            $recommendations->push($this->item('Review low-score lesson', "Revisit {$lowScore->lesson->title} before the posttest.", "/student/lessons/{$lowScore->lesson_id}", 'review'));
        }

        if ($hasPretest && ! $hasPosttest && $progress->where('status', 'completed')->isNotEmpty()) {
            $recommendations->push($this->item('Take the posttest', 'Measure your learning gain after the intervention.', '/student/posttest', 'assessment'));
        }

        if ($hasPosttest) {
            $recommendations->push($this->item('Answer the survey', 'Share your experience with the AI-enhanced materials.', '/student/survey', 'survey'));
        }

        return Inertia::render('student/recommendations/index', [
            'recommendations' => $recommendations->values(),
        ]);
    }

    private function item(string $title, string $description, string $href, string $type): array
    {
        return compact('title', 'description', 'href', 'type');
    }
}
