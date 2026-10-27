<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;

class TestController extends Controller
{
    public function index(): Response
    {
        $tests = Test::query()
            ->withCount(['questions', 'attempts'])
            ->latest('updated_at')
            ->get()
            ->map(fn (Test $test): array => [
                'id' => $test->id,
                'title' => $test->title,
                'test_type' => $test->test_type,
                'subject' => $test->subject,
                'topic' => $test->topic,
                'is_active' => $test->is_active,
                'questions_count' => $test->questions_count,
                'attempts_count' => $test->attempts_count,
                'updated_at' => $test->updated_at?->toDateString(),
            ]);

        return Inertia::render('teacher/tests/index', [
            'tests' => $tests,
        ]);
    }
}
