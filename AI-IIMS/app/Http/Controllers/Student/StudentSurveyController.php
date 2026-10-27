<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StudentSurveyController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\Student $student */
        $student = Auth::user()->student;

        $survey = Survey::query()
            ->where('is_published', true)
            ->with(['questions' => fn ($q) => $q->orderBy('sort_order')])
            ->latest('updated_at')
            ->first();

        $alreadySubmitted = false;

        if ($survey) {
            $alreadySubmitted = SurveyResponse::query()
                ->where('survey_id', $survey->id)
                ->where('student_id', $student->id)
                ->whereNotNull('submitted_at')
                ->exists();
        }

        return Inertia::render('student/survey/index', [
            'survey' => $survey ? [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
                'questions' => $survey->questions->map(fn ($q): array => [
                    'id' => $q->id,
                    'question' => $q->question,
                    'category' => $q->category,
                ])->values(),
            ] : null,
            'alreadySubmitted' => $alreadySubmitted,
        ]);
    }

    public function submit(Request $request, Survey $survey): RedirectResponse
    {
        abort_unless($survey->is_published, 403);

        /** @var \App\Models\Student $student */
        $student = Auth::user()->student;

        $alreadySubmitted = SurveyResponse::query()
            ->where('survey_id', $survey->id)
            ->where('student_id', $student->id)
            ->whereNotNull('submitted_at')
            ->exists();

        abort_if($alreadySubmitted, 403, 'You have already submitted this survey.');

        $questionIds = $survey->questions()->pluck('id')->toArray();

        $data = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer', 'in:' . implode(',', $questionIds)],
            'answers.*.rating' => ['required', 'integer', 'min:1', 'max:5'],
        ]);

        DB::transaction(function () use ($data, $survey, $student): void {
            $response = SurveyResponse::query()->updateOrCreate(
                ['survey_id' => $survey->id, 'student_id' => $student->id],
                ['submitted_at' => now()],
            );

            foreach ($data['answers'] as $answer) {
                $response->answers()->updateOrCreate(
                    ['survey_question_id' => $answer['question_id']],
                    ['rating' => $answer['rating']],
                );
            }
        });

        return redirect()->route('student.survey.index')->with('success', 'Thank you for completing the survey!');
    }
}
