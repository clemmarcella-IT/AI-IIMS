<?php

namespace App\Services;

use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiService
{
    private const WRONG_ANSWER_CACHE_VERSION = 'v1';

    private const WRONG_ANSWER_FALLBACK = 'AI feedback is currently unavailable. Please review the lesson content and try again.';

    public function explainWrongAnswer(string $question, string $studentAnswer, string $correctAnswer): string
    {
        $question = $this->normalizedFeedbackText($question);
        $studentAnswer = $this->normalizedFeedbackText($studentAnswer);
        $correctAnswer = $this->normalizedFeedbackText($correctAnswer);
        $cacheKey = $this->wrongAnswerCacheKey($question, $studentAnswer, $correctAnswer);

        $cached = Cache::get($cacheKey);

        if (is_string($cached) && $cached !== '') {
            return $cached;
        }

        try {
            return Cache::lock("{$cacheKey}:lock", 400)->block(400, function () use (
                $cacheKey,
                $question,
                $studentAnswer,
                $correctAnswer,
            ): string {
                $cached = Cache::get($cacheKey);

                if (is_string($cached) && $cached !== '') {
                    return $cached;
                }

                $explanation = $this->generateWrongAnswerExplanation(
                    $question,
                    $studentAnswer,
                    $correctAnswer,
                );

                Cache::forever($cacheKey, $explanation);

                return $explanation;
            });
        } catch (LockTimeoutException|RuntimeException) {
            return self::WRONG_ANSWER_FALLBACK;
        }
    }

    private function generateWrongAnswerExplanation(string $question, string $studentAnswer, string $correctAnswer): string
    {
        $prompt = "
            You are an educational AI tutor for students.

            The student just answered a question incorrectly. The correct answer is already shown to them in the UI.
            Your job is to explain WHY their answer is wrong and WHY the correct answer is right.

            - Briefly explain the mistake in the student's reasoning or understanding.
            - Explain why the correct answer is correct, using simple and clear language.
            - Keep the tone encouraging and student-friendly.
            - Speak directly to the student.
            - Keep your response short (2-4 sentences).

            Question: {$question}
            Student's answer: {$studentAnswer}
            Correct answer: {$correctAnswer}
        ";

        $response = $this->generateContent($prompt);

        if ($response->failed()) {
            throw new RuntimeException('Gemini could not generate wrong-answer feedback.');
        }

        $explanation = $response->json('candidates.0.content.parts.0.text');

        if (! is_string($explanation) || trim($explanation) === '') {
            throw new RuntimeException('No wrong-answer explanation was generated.');
        }

        return trim($explanation);
    }

    private function normalizedFeedbackText(string $value): string
    {
        return trim((string) preg_replace('/\s+/u', ' ', $value));
    }

    private function wrongAnswerCacheKey(string $question, string $studentAnswer, string $correctAnswer): string
    {
        return 'gemini:wrong-answer:'.hash('sha256', json_encode([
            'version' => self::WRONG_ANSWER_CACHE_VERSION,
            'model' => config('services.gemini.model'),
            'question' => $question,
            'student_answer' => $studentAnswer,
            'correct_answer' => $correctAnswer,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    /**
     * @param  array<string, mixed>  $lessonData
     * @return array<int, array<string, mixed>>
     */
    public function generateLessonSuggestions(array $lessonData): array
    {
        $mode = $lessonData['suggestion_mode'] ?? null;
        $prompt = match ($mode) {
            'ilaw_field' => $this->ilawFieldSuggestionPrompt($lessonData),
            'ilaw_question_bank' => $this->ilawQuestionBankPrompt($lessonData),
            default => $this->lessonSuggestionPrompt($lessonData),
        };
        $response = $this->generateContent($prompt, json: true);

        if ($response->failed()) {
            throw new RuntimeException('AI lesson suggestions are currently unavailable.');
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            throw new RuntimeException('No AI lesson suggestions were generated.');
        }

        $suggestions = json_decode($this->extractJson($text), true);

        if (! is_array($suggestions)) {
            throw new RuntimeException('AI lesson suggestions could not be parsed.');
        }

        if ($mode === 'ilaw_field') {
            return $this->normalizedIlawFieldSuggestions($suggestions, $lessonData);
        }

        if ($mode === 'ilaw_question_bank') {
            return $this->normalizedIlawQuestionBankSuggestions($suggestions);
        }

        return collect($suggestions)
            ->filter(fn ($suggestion): bool => is_array($suggestion))
            ->map(function (array $suggestion): array {
                if (($suggestion['type'] ?? null) === 'section_activity') {
                    $activity = is_array($suggestion['activity'] ?? null)
                        ? $this->normalizedActivity($suggestion['activity'])
                        : [];

                    return [
                        'type' => 'section_activity',
                        'title' => (string) ($activity['title'] ?? 'Section activity'),
                        'content' => (string) ($activity['instruction'] ?? $activity['question'] ?? $activity['prompt'] ?? 'Suggested section activity'),
                        'payload' => [
                            'section_title' => (string) ($suggestion['section_title'] ?? ''),
                            'activity' => $activity,
                        ],
                    ];
                }

                if (($suggestion['type'] ?? null) === 'media_suggestion') {
                    return $this->normalizedMediaSuggestion($suggestion);
                }

                return [
                    'type' => (string) ($suggestion['type'] ?? 'summary'),
                    'title' => (string) ($suggestion['title'] ?? 'AI suggestion'),
                    'content' => (string) ($suggestion['content'] ?? ''),
                    'payload' => isset($suggestion['payload']) && is_array($suggestion['payload'])
                        ? $suggestion['payload']
                        : null,
                ];
            })
            ->filter(fn (array $suggestion): bool => in_array($suggestion['type'], [
                'expanded_explanation',
                'lesson_section',
                'section_activity',
                'mini_quiz',
                'true_false',
                'fill_blank',
                'matching',
                'sequencing',
                'reflection',
                'clickable_activity',
                'media_suggestion',
                'summary',
            ], true) && $suggestion['content'] !== '')
            ->filter(fn (array $suggestion): bool => $suggestion['type'] !== 'media_suggestion'
                || (string) data_get($suggestion, 'payload.url', '') !== '')
            ->values()
            ->all();
    }

    private function generateContent(string $prompt, bool $json = false): Response
    {
        $model = config('services.gemini.model');
        $key = config('services.gemini.key');

        if (! is_string($key) || trim($key) === '') {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                    ],
                ],
            ],
        ];

        if ($json) {
            $payload['generationConfig'] = [
                'responseMimeType' => 'application/json',
            ];
        }

        try {
            return Http::withHeaders([
                'x-goog-api-key' => $key,
                'Content-Type' => 'application/json',
            ])
                ->timeout(120)
                ->retry(3, 1000, throw: false)
                ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent", $payload);
        } catch (ConnectionException $exception) {
            throw new RuntimeException(
                'Gemini could not be reached. Please check your internet connection and try again.',
                0,
                $exception,
            );
        }
    }

    /**
     * @param  array<string, mixed>  $lessonData
     */
    private function ilawFieldSuggestionPrompt(array $lessonData): string
    {
        $json = json_encode($lessonData, JSON_PRETTY_PRINT);

        return <<<PROMPT
            You are an instructional design assistant helping a teacher complete one field in a DepEd ILAW lesson builder.

            Use this current builder data:
            {$json}

            Return JSON only. Return one object with exactly this shape:
            {
              "type": "expanded_explanation",
              "title": "Suggested content for Learning Objectives",
              "content": "Teacher-ready content for the requested ILAW field only."
            }

            Requirements:
            - Write only content that belongs in the requested target_field.
            - Do not include JSON, markdown fences, labels, or commentary inside content.
            - Keep the content classroom-ready, specific to the subject/topic, and easy for a teacher to edit.
            - For learning objectives, use measurable learner-centered objectives.
            - For target competencies, list clear competency statements.
            - For lesson flow, describe an opening, concept development, guided practice, and closure.
            - For activities, describe concrete learner tasks.
            - For strategy, describe teaching strategies and differentiation.
            - For formative assessment, describe checks for understanding.
            - For remediation and enrichment, give practical next steps.
        PROMPT;
    }

    /**
     * @param  array<string, mixed>  $lessonData
     */
    private function ilawQuestionBankPrompt(array $lessonData): string
    {
        $json = json_encode($lessonData, JSON_PRETTY_PRINT);
        $count = max(1, min(30, (int) ($lessonData['question_count'] ?? 15)));

        return <<<PROMPT
            You are an assessment writer for a DepEd ILAW lesson builder.

            Use this current builder data:
            {$json}

            Return JSON only. Return one object with exactly this shape:
            {
              "questions": [
                {
                  "id": "q1",
                  "type": "multiple_choice",
                  "question": "Question text",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correct_answer": 0,
                  "points": 1,
                  "explanation": "Short explanation"
                }
              ]
            }

            Requirements:
            - Generate exactly {$count} multiple-choice questions.
            - Each question must have exactly four plausible options.
            - correct_answer must be a zero-based integer index: 0, 1, 2, or 3.
            - Questions should cover the lesson objectives, flow, activities, and formative assessment context.
            - Avoid duplicate questions and avoid answer patterns that always use the same option.
            - Do not include prose, markdown, or explanations outside JSON.
        PROMPT;
    }

    /**
     * @param  array<string, mixed>  $suggestion
     * @param  array<string, mixed>  $lessonData
     * @return array<int, array<string, mixed>>
     */
    private function normalizedIlawFieldSuggestions(array $suggestion, array $lessonData): array
    {
        $firstSuggestion = $this->firstAssociativeItem($suggestion);
        $fieldLabel = (string) data_get($lessonData, 'target_field.label', 'ILAW field');
        $content = trim((string) (
            data_get($suggestion, 'content')
            ?? data_get($firstSuggestion, 'content')
            ?? data_get($suggestion, 'suggestion')
            ?? data_get($firstSuggestion, 'suggestion')
            ?? ''
        ));

        if ($content === '') {
            throw new RuntimeException('No usable AI suggestion was generated.');
        }

        return [[
            'type' => 'expanded_explanation',
            'title' => (string) (
                data_get($suggestion, 'title')
                ?? data_get($firstSuggestion, 'title')
                ?? "Suggested {$fieldLabel}"
            ),
            'content' => $content,
            'payload' => [
                'target_field' => data_get($lessonData, 'target_field'),
            ],
        ]];
    }

    /**
     * @param  array<string, mixed>  $response
     * @return array<int, array<string, mixed>>
     */
    private function normalizedIlawQuestionBankSuggestions(array $response): array
    {
        $questions = data_get($response, 'questions');

        if (! is_array($questions)) {
            $questions = $this->isListOfArrays($response) ? $response : [];
        }

        $normalizedQuestions = collect($questions)
            ->filter(fn ($question): bool => is_array($question))
            ->map(fn (array $question, int $index): array => $this->normalizedIlawQuestion($question, $index))
            ->filter(fn (array $question): bool => $question['question'] !== ''
                && collect($question['options'])->every(fn (string $option): bool => $option !== ''))
            ->values();

        if ($normalizedQuestions->isEmpty()) {
            throw new RuntimeException('AI did not return valid multiple-choice questions.');
        }

        return $normalizedQuestions
            ->map(fn (array $question, int $index): array => [
                'type' => 'mini_quiz',
                'title' => 'Question '.($index + 1),
                'content' => $question['question'],
                'payload' => [
                    ...$question,
                    'choices' => $question['options'],
                ],
            ])
            ->all();
    }

    /**
     * @param  array<string, mixed>  $question
     * @return array<string, mixed>
     */
    private function normalizedIlawQuestion(array $question, int $index): array
    {
        $options = collect($question['options'] ?? $question['choices'] ?? [])
            ->map(fn ($option): string => trim((string) $option))
            ->take(4)
            ->values();

        while ($options->count() < 4) {
            $options->push('');
        }

        return [
            'id' => (string) ($question['id'] ?? 'ai-q'.($index + 1)),
            'type' => 'multiple_choice',
            'question' => trim((string) ($question['question'] ?? $question['question_text'] ?? '')),
            'options' => $options->all(),
            'correct_answer' => $this->questionAnswerIndex($question['correct_answer'] ?? 0, $options->all()),
            'points' => max(1, (int) ($question['points'] ?? 1)),
            'explanation' => trim((string) ($question['explanation'] ?? '')),
        ];
    }

    /**
     * @param  array<string, mixed>  $suggestion
     * @return array<string, mixed>
     */
    private function normalizedMediaSuggestion(array $suggestion): array
    {
        $payload = is_array($suggestion['payload'] ?? null)
            ? $suggestion['payload']
            : [];
        $mediaType = $payload['media_type']
            ?? $suggestion['media_type']
            ?? $payload['type']
            ?? 'link';

        if (! in_array($mediaType, ['image', 'video', 'link'], true)) {
            $mediaType = 'link';
        }

        $url = trim((string) ($payload['url'] ?? $suggestion['url'] ?? ''));
        $content = trim((string) ($suggestion['content'] ?? $payload['caption'] ?? ''));
        $caption = trim((string) ($payload['caption'] ?? $suggestion['caption'] ?? $content));
        $fallback = $mediaType === 'video' ? 'Suggested lesson video' : 'Suggested media resource';
        $title = trim((string) ($suggestion['title'] ?? ''));

        return [
            'type' => 'media_suggestion',
            'title' => $title !== '' ? $title : ($caption !== '' ? $caption : $fallback),
            'content' => $content !== '' ? $content : ($caption !== '' ? $caption : $fallback),
            'payload' => [
                'media_type' => $mediaType,
                'url' => $url,
                'caption' => $caption !== '' ? $caption : $fallback,
            ],
        ];
    }

    /**
     * @param  array<int, string>  $options
     */
    private function questionAnswerIndex(mixed $answer, array $options): int
    {
        if (is_int($answer) && $answer >= 0 && $answer <= 3) {
            return $answer;
        }

        if (is_numeric($answer)) {
            $index = (int) $answer;

            if ($index >= 0 && $index <= 3) {
                return $index;
            }
        }

        $answerText = trim((string) $answer);
        $letterIndex = array_search(strtoupper($answerText), ['A', 'B', 'C', 'D'], true);

        if ($letterIndex !== false) {
            return $letterIndex;
        }

        foreach ($options as $index => $option) {
            if ($answerText !== '' && strcasecmp($answerText, $option) === 0) {
                return $index;
            }
        }

        return 0;
    }

    /**
     * @param  array<mixed>  $items
     * @return array<string, mixed>
     */
    private function firstAssociativeItem(array $items): array
    {
        foreach ($items as $item) {
            if (is_array($item) && ! array_is_list($item)) {
                return $item;
            }
        }

        return [];
    }

    /**
     * @param  array<mixed>  $items
     */
    private function isListOfArrays(array $items): bool
    {
        return array_is_list($items)
            && collect($items)->every(fn ($item): bool => is_array($item));
    }

    /**
     * @param  array<string, mixed>  $seed
     * @return array<string, mixed>
     */
    public function generateLessonDraft(array $seed): array
    {
        $prompt = $this->lessonDraftPrompt($seed);
        $response = $this->generateContent($prompt, json: true);

        if ($response->failed()) {
            throw new RuntimeException('AI lesson draft generation is currently unavailable.');
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            throw new RuntimeException('No AI lesson draft was generated.');
        }

        $draft = json_decode($this->extractJson($text), true);

        if (! is_array($draft)) {
            throw new RuntimeException('AI lesson draft could not be parsed.');
        }

        return $this->normalizedLessonDraft(
            $this->lessonDraftDataFrom($draft),
            $seed,
        );
    }

    /**
     * @param  array<string, mixed>  $lessonData
     * @return array<string, mixed>
     */
    public function generateSectionActivity(array $lessonData): array
    {
        $prompt = $this->sectionActivityPrompt($lessonData);
        $response = $this->generateContent($prompt, json: true);

        if ($response->failed()) {
            throw new RuntimeException('AI section activity generation is currently unavailable.');
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            throw new RuntimeException('No AI section activity was generated.');
        }

        $activity = json_decode($this->extractJson($text), true);

        if (! is_array($activity)) {
            throw new RuntimeException('AI section activity could not be parsed.');
        }

        return $this->normalizedActivity($activity);
    }

    /**
     * @param  array<string, mixed>  $lessonData
     */
    private function lessonSuggestionPrompt(array $lessonData): string
    {
        $json = json_encode($lessonData, JSON_PRETTY_PRINT);

        return <<<PROMPT
            You are an instructional design assistant for teachers.

            The teacher is building the exact lesson content students will see. You only suggest optional enhancements. Never imply that suggestions are already accepted, published, or automatically added.

            Use this current lesson builder data:
            {$json}

            Return JSON only. Return an array of objects. Include these suggestion types where useful:
            - expanded_explanation
            - lesson_section
            - section_activity
            - mini_quiz
            - true_false
            - fill_blank
            - matching
            - sequencing
            - reflection
            - clickable_activity
            - media_suggestion
            - summary

            Also include exactly one suggested activity for each of these activity types:
            - mini_quiz
            - true_false
            - fill_blank
            - matching
            - sequencing
            - reflection
            - clickable_activity

            Also generate one section_activity suggestion for each lesson section. The activity must match that section's content, and section activities should use varied activity types when possible. AI suggestions must never be treated as accepted or automatically added.

            Each object must use this shape:
            {
            "type": "lesson_section",
            "title": "Importance of Photosynthesis",
            "content": "Photosynthesis is important because...",
            "payload": {
                "title": "Importance of Photosynthesis",
                "content": "Photosynthesis is important because...",
                "sort_order": 1,
                "is_collapsible": true
            }
            }

            For section_activity objects, use:
            {
            "type": "section_activity",
            "section_title": "Newton's First Law",
            "activity": {
                "type": "true_false",
                "title": "Check Your Understanding",
                "instruction": "Determine if the statement is true or false.",
                "payload": {
                "statement": "An object at rest stays at rest unless acted on by an external force."
                },
                "statement": "An object at rest stays at rest unless acted on by an external force.",
                "correct_answer": true,
                "explanation": "This is Newton's First Law of Motion."
            }
            }

            For mini_quiz payloads, use:
            {
            "type": "mini_quiz",
            "title": "Photosynthesis Check",
            "instruction": "Answer the question.",
            "question": "What gas is produced during photosynthesis?",
            "choices": ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
            "correct_answer": "Oxygen",
            "explanation": "Oxygen is released as a by-product of photosynthesis."
            }

            For true_false payloads, use:
            {
            "type": "true_false",
            "title": "Law of Inertia Check",
            "instruction": "Decide whether the statement is true or false.",
            "statement": "Newton's First Law is also called the Law of Inertia.",
            "correct_answer": true,
            "explanation": "Newton's First Law describes inertia."
            }

            For fill_blank payloads, use:
            {
            "type": "fill_blank",
            "title": "Formula Completion",
            "instruction": "Complete the missing word.",
            "sentence": "Force is equal to mass times ____.",
            "blank_label": "missing word",
            "correct_answer": "acceleration",
            "explanation": "Newton's Second Law is commonly written as F = ma."
            }

            For matching payloads, use:
            {
            "type": "matching",
            "title": "Match the Laws",
            "instruction": "Match each item on the left to the correct item on the right.",
            "pairs": [
                { "left": "First Law", "right": "Law of Inertia" },
                { "left": "Second Law", "right": "F = ma" },
                { "left": "Third Law", "right": "Action-Reaction" }
            ],
            "correct_answer": [
                { "left": "First Law", "right": "Law of Inertia" },
                { "left": "Second Law", "right": "F = ma" },
                { "left": "Third Law", "right": "Action-Reaction" }
            ],
            "explanation": "Each law has a distinct description."
            }

            For sequencing payloads, use:
            {
            "type": "sequencing",
            "title": "Problem Solving Order",
            "instruction": "Arrange the steps in the correct order.",
            "items": ["Read the problem", "Identify the given values", "Apply the formula", "Solve the answer"],
            "correct_answer": ["Read the problem", "Identify the given values", "Apply the formula", "Solve the answer"],
            "explanation": "Solving physics problems is easier when steps are ordered."
            }

            For reflection payloads, use:
            {
            "type": "reflection",
            "title": "Real-Life Reflection",
            "instruction": "Explain one real-life example of Newton's Third Law.",
            "prompt": "Explain one real-life example of Newton's Third Law.",
            "correct_answer": null
            }

            For clickable_activity payloads, use:
            {
            "type": "clickable_activity",
            "title": "Identify Related Ideas",
            "instruction": "Select the cards related to Newton's Laws.",
            "question": "Select the cards related to Newton's Laws.",
            "cards": [
                { "label": "Inertia", "description": "Resistance to changes in motion", "is_correct": true },
                { "label": "Evaporation", "description": "Water changing into vapor", "is_correct": false }
            ],
            "correct_answer": ["Inertia"],
            "explanation": "Inertia is directly related to Newton's First Law."
            }

            For media_suggestion payloads, use:
            {
            "type": "media_suggestion",
            "title": "Short media title",
            "content": "Why this resource helps the lesson.",
            "payload": {
                "media_type": "video",
                "url": "https://www.youtube.com/watch?v=publicVideoId",
                "caption": "Short caption for the suggested educational video"
            }
            }

            Prefer media_type "video" when a relevant public educational video URL is known. Use a normal YouTube watch URL or a direct video URL. Do not invent URLs; if no stable useful video is known, use image/link media only when appropriate or skip media_suggestion.
        PROMPT;
    }

    /**
     * @param  array<string, mixed>  $seed
     */
    private function lessonDraftPrompt(array $seed): string
    {
        $json = json_encode($seed, JSON_PRETTY_PRINT);

        return <<<PROMPT
            You are an instructional design assistant helping a teacher start faster.

            Create a complete but editable lesson draft from this seed:
            {$json}

            Return JSON only. Return one object with this exact shape:
            {
              "title": "Lesson title",
              "subject": "Subject",
              "topic": "Topic",
              "difficulty_level": "beginner",
              "sections": [
                {
                  "title": "Short section title",
                  "content_type": "text",
                  "content": "<p>Student-ready explanation in 1-3 short paragraphs.</p>",
                  "is_collapsible": true,
                  "media": [
                    {
                      "type": "video",
                      "url": "https://www.youtube.com/watch?v=publicVideoId",
                      "caption": "Optional educational video"
                    }
                  ],
                  "activities": [
                    {
                      "type": "mini_quiz",
                      "title": "Quick Check",
                      "instruction": "Answer the question.",
                      "question": "Question text?",
                      "choices": ["A choice", "Another choice", "Third choice", "Fourth choice"],
                      "correct_answer": "A choice",
                      "explanation": "Brief explanation.",
                      "record_score": true
                    }
                  ]
                }
              ],
              "activities": [
                {
                  "type": "reflection",
                  "title": "Exit Reflection",
                  "instruction": "Reflect on the lesson.",
                  "prompt": "What is one idea you can apply?",
                  "correct_answer": null,
                  "record_score": false
                }
              ]
            }

            Requirements:
            - Use 3 to 5 sections.
            - Each section must set content_type to "text" or "slides".
            - Use content_type "text" for normal reading sections and keep content student-ready and concise.
            - Use content_type "slides" only when a slide deck would teach the idea better than paragraphs. For slide sections, put the slide deck in content as HTML using this exact structure:
              <div data-lesson-slides="true"><section data-lesson-slide="true" data-slide-index="1"><h3>Slide title</h3><p>Short slide body.</p></section></div>
            - Slide sections should contain 3 to 6 concise slides. Do not put slide decks in media.
            - Add one useful activity to most sections, mixing activity types.
            - Include one final reflection or synthesis activity.
            - Include at least one relevant public educational video in a section media array when you know a stable URL.
            - Section media type may only be image, video, or link. Do not use slides as a media type.
            - Do not invent video URLs or fake citations. Use media only when a stable public URL is appropriate; otherwise return an empty media array.
            - difficulty_level must be beginner, intermediate, or advanced.
        PROMPT;
    }

    /**
     * @param  array<string, mixed>  $lessonData
     */
    private function sectionActivityPrompt(array $lessonData): string
    {
        $json = json_encode($lessonData, JSON_PRETTY_PRINT);

        return <<<PROMPT
            You are helping a teacher quickly add one activity to a lesson section.

            Lesson and section data:
            {$json}

            Return JSON only. Return exactly one activity object using one of these types:
            mini_quiz, true_false, fill_blank, matching, sequencing, reflection, clickable_activity.

            Use this shape:
            {
              "type": "mini_quiz",
              "title": "Quick Check",
              "instruction": "Answer the question.",
              "question": "Question text?",
              "choices": ["A choice", "Another choice", "Third choice", "Fourth choice"],
              "correct_answer": "A choice",
              "explanation": "Brief explanation.",
              "record_score": true
            }

            Match the section content. If a preferred_type is provided, use it unless it would be a poor fit. Keep it short enough that a teacher can review quickly.

            Type rules:
            - The type must match the student action. Do not label an identify/select/choose/click task as reflection.
            - Use reflection only for open-ended explain, describe, connect, or personal response prompts.
            - If students identify or select correct items, use clickable_activity and include cards with is_correct values.
            - If students choose one answer from options, use mini_quiz and include exactly four choices.
            - If students decide true/false, use true_false and include statement plus boolean correct_answer.
            - If students complete missing text, use fill_blank and include sentence plus correct_answer.
            - If students pair ideas, use matching and include pairs.
            - If students order steps, use sequencing and include items.
        PROMPT;
    }

    /**
     * @param  array<string, mixed>  $draft
     * @param  array<string, mixed>  $seed
     * @return array<string, mixed>
     */
    private function normalizedLessonDraft(array $draft, array $seed): array
    {
        $draftPayload = is_array($draft['payload'] ?? null) ? $draft['payload'] : [];
        $rawSections = $draft['sections']
            ?? $draft['lesson_sections']
            ?? $draftPayload['sections']
            ?? [];
        $rawActivities = $draft['activities']
            ?? $draftPayload['activities']
            ?? [];

        $sections = collect($rawSections)
            ->filter(fn ($section): bool => is_array($section))
            ->map(function (array $section, int $index): array {
                $sectionPayload = is_array($section['payload'] ?? null)
                    ? $section['payload']
                    : [];
                $sectionData = [
                    ...$sectionPayload,
                    ...$section,
                ];

                return [
                    'title' => (string) ($sectionData['title'] ?? 'Section '.($index + 1)),
                    'content' => (string) ($sectionData['content'] ?? ''),
                    'content_type' => in_array($sectionData['content_type'] ?? null, ['text', 'slides'], true)
                        ? $sectionData['content_type']
                        : (str_contains((string) ($sectionData['content'] ?? ''), 'data-lesson-slides') ? 'slides' : 'text'),
                    'sort_order' => $index + 1,
                    'is_collapsible' => (bool) ($sectionData['is_collapsible'] ?? true),
                    'media' => collect($sectionData['media'] ?? [])
                        ->filter(fn ($media): bool => is_array($media))
                        ->map(fn (array $media): array => [
                            'type' => in_array($media['type'] ?? null, ['image', 'video', 'link'], true)
                                ? $media['type']
                                : 'link',
                            'source' => 'url',
                            'url' => (string) ($media['url'] ?? ''),
                            'caption' => (string) ($media['caption'] ?? ''),
                        ])
                        ->filter(fn (array $media): bool => $media['url'] !== '')
                        ->values()
                        ->all(),
                    'activities' => collect($sectionData['activities'] ?? [])
                        ->filter(fn ($activity): bool => is_array($activity))
                        ->map(fn (array $activity): array => $this->normalizedActivity($activity))
                        ->values()
                        ->all(),
                ];
            })
            ->values()
            ->all();

        if (
            $sections === []
            && trim((string) ($draft['content'] ?? $draftPayload['content'] ?? '')) !== ''
        ) {
            $sections[] = [
                'title' => (string) ($draft['title'] ?? $seed['topic'] ?? 'Lesson overview'),
                'content' => (string) ($draft['content'] ?? $draftPayload['content']),
                'content_type' => 'text',
                'sort_order' => 1,
                'is_collapsible' => true,
                'media' => [],
                'activities' => [],
            ];
        }

        return [
            'title' => (string) ($draft['title'] ?? $draftPayload['title'] ?? $seed['title'] ?? $seed['topic'] ?? 'Untitled lesson draft'),
            'subject' => (string) ($draft['subject'] ?? $draftPayload['subject'] ?? $seed['subject'] ?? ''),
            'topic' => (string) ($draft['topic'] ?? $draftPayload['topic'] ?? $seed['topic'] ?? ''),
            'difficulty_level' => in_array($draft['difficulty_level'] ?? $draftPayload['difficulty_level'] ?? null, ['beginner', 'intermediate', 'advanced'], true)
                ? ($draft['difficulty_level'] ?? $draftPayload['difficulty_level'])
                : ($seed['difficulty_level'] ?? 'beginner'),
            'sections' => $sections,
            'activities' => collect($rawActivities)
                ->filter(fn ($activity): bool => is_array($activity))
                ->map(fn (array $activity): array => $this->normalizedActivity($activity))
                ->values()
                ->all(),
        ];
    }

    /**
     * @param  array<string, mixed>  $draft
     * @return array<string, mixed>
     */
    private function lessonDraftDataFrom(array $draft): array
    {
        foreach (['draft', 'lesson', 'lesson_draft'] as $key) {
            if (is_array($draft[$key] ?? null)) {
                return $draft[$key];
            }
        }

        return $draft;
    }

    /**
     * @param  array<string, mixed>  $activity
     * @return array<string, mixed>
     */
    private function normalizedActivity(array $activity): array
    {
        $activity = $this->activityDataFrom($activity);
        $type = $this->resolvedActivityType($activity);
        $choices = is_array($activity['choices'] ?? null) ? $activity['choices'] : [];
        $pairs = is_array($activity['pairs'] ?? null) ? $activity['pairs'] : [];
        $items = is_array($activity['items'] ?? null) ? $activity['items'] : [];
        $cards = is_array($activity['cards'] ?? null) ? $activity['cards'] : [];
        $correctAnswer = $activity['correct_answer'] ?? null;

        if ($type === 'clickable_activity' && $cards === [] && $choices !== []) {
            $correctValues = collect(is_array($correctAnswer) ? $correctAnswer : [$correctAnswer])
                ->filter(fn ($value): bool => filled($value))
                ->map(fn ($value): string => strtolower((string) $value))
                ->all();

            $cards = collect($choices)
                ->map(fn ($choice): array => [
                    'label' => (string) $choice,
                    'description' => '',
                    'is_correct' => in_array(strtolower((string) $choice), $correctValues, true),
                ])
                ->values()
                ->all();
        }

        return [
            'type' => $type,
            'title' => (string) ($activity['title'] ?? 'Suggested activity'),
            'instruction' => (string) ($activity['instruction'] ?? $activity['prompt'] ?? ''),
            'question' => (string) ($activity['question'] ?? ''),
            'statement' => (string) ($activity['statement'] ?? ''),
            'sentence' => (string) ($activity['sentence'] ?? ''),
            'blank_label' => (string) ($activity['blank_label'] ?? 'missing word'),
            'prompt' => (string) ($activity['prompt'] ?? $activity['instruction'] ?? ''),
            'choices' => array_values(array_pad(array_slice($choices, 0, 4), 4, '')),
            'pairs' => array_values($pairs),
            'items' => array_values($items),
            'cards' => array_values($cards),
            'correct_answer' => $correctAnswer,
            'explanation' => (string) ($activity['explanation'] ?? ''),
            'record_score' => (bool) ($activity['record_score'] ?? $type !== 'reflection'),
        ];
    }

    /**
     * @param  array<string, mixed>  $activity
     * @return array<string, mixed>
     */
    private function activityDataFrom(array $activity): array
    {
        if (
            ($activity['type'] ?? null) === 'section_activity'
            && is_array($activity['activity'] ?? null)
        ) {
            return $this->activityDataFrom($activity['activity']);
        }

        $payload = is_array($activity['payload'] ?? null)
            ? $activity['payload']
            : [];
        $nestedPayload = is_array($payload['payload'] ?? null)
            ? $payload['payload']
            : [];

        return [
            ...$nestedPayload,
            ...$payload,
            ...$activity,
        ];
    }

    /**
     * @param  array<string, mixed>  $activity
     */
    private function resolvedActivityType(array $activity): string
    {
        $declaredType = $activity['type'] ?? null;
        $validTypes = [
            'mini_quiz',
            'true_false',
            'fill_blank',
            'matching',
            'sequencing',
            'reflection',
            'clickable_activity',
        ];
        $text = strtolower(implode(' ', [
            (string) ($activity['title'] ?? ''),
            (string) ($activity['instruction'] ?? ''),
            (string) ($activity['question'] ?? ''),
            (string) ($activity['prompt'] ?? ''),
        ]));
        $choices = is_array($activity['choices'] ?? null)
            ? array_filter($activity['choices'], fn ($choice): bool => filled($choice))
            : [];
        $pairs = is_array($activity['pairs'] ?? null)
            ? array_filter($activity['pairs'])
            : [];
        $items = is_array($activity['items'] ?? null)
            ? array_filter($activity['items'], fn ($item): bool => filled($item))
            : [];
        $cards = is_array($activity['cards'] ?? null)
            ? array_filter($activity['cards'])
            : [];
        $correctAnswer = $activity['correct_answer'] ?? null;

        if ($cards !== []) {
            return 'clickable_activity';
        }

        if ($pairs !== []) {
            return 'matching';
        }

        if ($items !== []) {
            return 'sequencing';
        }

        if (($activity['sentence'] ?? '') !== '') {
            return 'fill_blank';
        }

        if (($activity['statement'] ?? '') !== '' || is_bool($correctAnswer)) {
            return 'true_false';
        }

        if (($activity['question'] ?? '') !== '' && count($choices) >= 2) {
            return 'mini_quiz';
        }

        if ($declaredType === 'reflection' && preg_match('/\b(identify|select|choose|click|tap|pick|which of the following)\b/', $text)) {
            return 'clickable_activity';
        }

        return in_array($declaredType, $validTypes, true)
            ? (string) $declaredType
            : 'reflection';
    }

    private function extractJson(string $text): string
    {
        $trimmed = trim($text);

        if (str_starts_with($trimmed, '```')) {
            $trimmed = preg_replace('/^```(?:json)?\s*/', '', $trimmed) ?? $trimmed;
            $trimmed = preg_replace('/\s*```$/', '', $trimmed) ?? $trimmed;
        }

        $json = $this->firstJsonSubstring($trimmed);

        return trim($json ?? $trimmed);
    }

    private function firstJsonSubstring(string $text): ?string
    {
        $length = strlen($text);

        for ($start = 0; $start < $length; $start++) {
            $opening = $text[$start];

            if ($opening !== '{' && $opening !== '[') {
                continue;
            }

            $closing = $opening === '{' ? '}' : ']';
            $depth = 0;
            $inString = false;
            $escaped = false;

            for ($index = $start; $index < $length; $index++) {
                $char = $text[$index];

                if ($inString) {
                    if ($escaped) {
                        $escaped = false;
                    } elseif ($char === '\\') {
                        $escaped = true;
                    } elseif ($char === '"') {
                        $inString = false;
                    }

                    continue;
                }

                if ($char === '"') {
                    $inString = true;

                    continue;
                }

                if ($char === $opening) {
                    $depth++;
                } elseif ($char === $closing) {
                    $depth--;

                    if ($depth === 0) {
                        $candidate = substr($text, $start, $index - $start + 1);
                        json_decode($candidate, true);

                        if (json_last_error() === JSON_ERROR_NONE) {
                            return $candidate;
                        }

                        break;
                    }
                }
            }
        }

        return null;
    }
}
