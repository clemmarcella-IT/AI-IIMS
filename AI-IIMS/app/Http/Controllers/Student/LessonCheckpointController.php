<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Student;
use App\Services\StudentLessonFlowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonCheckpointController extends Controller
{
    public function store(Request $request, Lesson $lesson, StudentLessonFlowService $flowService): JsonResponse
    {
        $student = $request->user()?->student;

        abort_unless($student instanceof Student, 403);
        abort_unless($lesson->is_published, 404);

        $data = $request->validate([
            'step_key' => ['required', 'string', 'max:255'],
        ]);

        return response()->json([
            'flow' => $flowService->completeCheckpoint($lesson, $student, $data['step_key']),
        ]);
    }
}
