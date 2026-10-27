<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\AiLessonSuggestion;
use App\Models\Lesson;
use App\Models\Teacher;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use RuntimeException;

class AiLessonSuggestionController extends Controller
{
    public function draft(Request $request, GeminiService $gemini): JsonResponse
    {
        $data = $this->validatedDraftSeed($request);

        try {
            $draft = $gemini->generateLessonDraft($data);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 502);
        }

        return response()->json([
            'draft' => $draft,
        ]);
    }

    public function generate(Request $request, GeminiService $gemini): JsonResponse
    {
        $teacher = $this->teacherFor($request);
        $data = $this->validatedLessonBuilderData($request);
        $lessonId = $data['lesson_id'] ?? null;

        if ($lessonId !== null) {
            $lesson = Lesson::findOrFail($lessonId);
            $this->authorizeLesson($lesson, $teacher);
        }

        try {
            $suggestions = $gemini->generateLessonSuggestions($data);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 502);
        }

        $records = DB::transaction(fn () => collect($suggestions)
            ->map(fn (array $suggestion): AiLessonSuggestion => $teacher
                ->aiSuggestions()
                ->create([
                    'lesson_id' => $lessonId,
                    'suggestion_type' => $suggestion['type'],
                    'title' => $suggestion['title'],
                    'content' => $suggestion['content'],
                    'payload' => $suggestion['payload'] ?? null,
                    'status' => 'pending',
                ]))
            ->values());

        return response()->json([
            'suggestions' => $records
                ->map(fn (AiLessonSuggestion $suggestion): array => $this->serializeSuggestion($suggestion))
                ->all(),
        ]);
    }

    public function sectionActivity(Request $request, GeminiService $gemini): JsonResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'topic' => ['nullable', 'string', 'max:255'],
            'difficulty_level' => [
                'required',
                Rule::in(['beginner', 'intermediate', 'advanced']),
            ],
            'section.title' => ['nullable', 'string', 'max:255'],
            'section.content' => ['nullable', 'string'],
            'preferred_type' => [
                'nullable',
                Rule::in([
                    'mini_quiz',
                    'true_false',
                    'fill_blank',
                    'matching',
                    'sequencing',
                    'reflection',
                    'clickable_activity',
                ]),
            ],
        ]);

        try {
            $activity = $gemini->generateSectionActivity($data);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 502);
        }

        return response()->json([
            'activity' => $activity,
        ]);
    }

    public function accept(Request $request, AiLessonSuggestion $suggestion): JsonResponse
    {
        $teacher = $this->teacherFor($request);
        $this->authorizeSuggestion($suggestion, $teacher);

        $suggestion->update(['status' => 'accepted']);

        return response()->json([
            'suggestion' => $this->serializeSuggestion($suggestion),
        ]);
    }

    public function discard(Request $request, AiLessonSuggestion $suggestion): JsonResponse
    {
        $teacher = $this->teacherFor($request);
        $this->authorizeSuggestion($suggestion, $teacher);

        $suggestion->update(['status' => 'discarded']);

        return response()->json([
            'suggestion' => $this->serializeSuggestion($suggestion),
        ]);
    }

    private function teacherFor(Request $request): Teacher
    {
        $teacher = $request->user()?->teacher;

        abort_if(! $teacher, 403);

        return $teacher;
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedLessonBuilderData(Request $request): array
    {
        return $request->validate([
            'lesson_id' => ['nullable', 'integer', 'exists:lessons,id'],
            'suggestion_mode' => [
                'nullable',
                Rule::in(['ilaw_field', 'ilaw_question_bank']),
            ],
            'target_field' => ['nullable', 'array'],
            'target_field.section_key' => ['nullable', 'string', 'max:80'],
            'target_field.field_name' => ['nullable', 'string', 'max:80'],
            'target_field.label' => ['nullable', 'string', 'max:120'],
            'question_count' => ['nullable', 'integer', 'min:1', 'max:30'],
            'title' => ['required', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'topic' => ['nullable', 'string', 'max:255'],
            'difficulty_level' => [
                'required',
                Rule::in(['beginner', 'intermediate', 'advanced']),
            ],
            'sections' => ['nullable', 'array'],
            'sections.*.title' => ['nullable', 'string', 'max:255'],
            'sections.*.content' => ['nullable', 'string'],
            'sections.*.sort_order' => ['nullable', 'integer'],
            'sections.*.is_collapsible' => ['nullable', 'boolean'],
            'sections.*.activities' => ['nullable', 'array'],
            'media' => ['nullable', 'array'],
            'media.*.type' => ['nullable', Rule::in(['image', 'video', 'link', 'slides'])],
            'media.*.url' => ['nullable', 'string'],
            'media.*.caption' => ['nullable', 'string', 'max:255'],
            'activities' => ['nullable', 'array'],
            'activities.*.type' => [
                'nullable',
                Rule::in([
                    'mini_quiz',
                    'true_false',
                    'fill_blank',
                    'matching',
                    'sequencing',
                    'reflection',
                    'clickable_activity',
                ]),
            ],
            'activities.*.title' => ['nullable', 'string', 'max:255'],
            'activities.*.instruction' => ['nullable', 'string'],
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
    private function validatedDraftSeed(Request $request): array
    {
        return $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'topic' => ['required', 'string', 'max:255'],
            'difficulty_level' => [
                'required',
                Rule::in(['beginner', 'intermediate', 'advanced']),
            ],
            'lesson_length' => ['nullable', 'string', 'max:80'],
            'learning_goal' => ['nullable', 'string'],
        ]);
    }

    private function authorizeLesson(Lesson $lesson, Teacher $teacher): void
    {
        abort_unless($lesson->teacher_id === $teacher->id, 404);
    }

    private function authorizeSuggestion(
        AiLessonSuggestion $suggestion,
        Teacher $teacher,
    ): void {
        abort_unless($suggestion->teacher_id === $teacher->id, 404);
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeSuggestion(AiLessonSuggestion $suggestion): array
    {
        return [
            'id' => $suggestion->id,
            'type' => $suggestion->suggestion_type,
            'title' => $suggestion->title,
            'content' => $suggestion->content,
            'payload' => $suggestion->payload,
            'status' => $suggestion->status,
        ];
    }
}
