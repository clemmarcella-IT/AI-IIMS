<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Student;
use App\Models\Teacher;
use Inertia\Inertia;
use Inertia\Response;

class AdminDirectoryController extends Controller
{
    public function students(): Response
    {
        $students = Student::query()
            ->with(['user:id,email', 'testAttempts', 'lessonProgress', 'quarterlyGrades'])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn (Student $student): array => [
                'id' => $student->id,
                'student_code' => $student->student_code,
                'name' => $student->full_name,
                'email' => $student->user?->email,
                'grade_level' => $student->grade_level,
                'section' => $student->section,
                'consent_status' => $student->consent_status,
                'pretest' => $student->testAttempts->firstWhere('test_type', 'pretest')?->percentage,
                'posttest' => $student->testAttempts->firstWhere('test_type', 'posttest')?->percentage,
                'completed_lessons' => $student->lessonProgress->where('status', 'completed')->count(),
                'average_progress' => $this->average($student->lessonProgress->pluck('progress_percentage')),
                'quarterly_average' => $this->average($student->quarterlyGrades->map->average()->filter()),
            ]);

        return Inertia::render('admin/students/index', [
            'students' => $students,
        ]);
    }

    public function teachers(): Response
    {
        $teachers = Teacher::query()
            ->with('user:id,email')
            ->withCount(['lessons', 'aiSuggestions'])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn (Teacher $teacher): array => [
                'id' => $teacher->id,
                'employee_no' => $teacher->employee_no,
                'name' => $teacher->full_name,
                'email' => $teacher->user?->email,
                'department' => $teacher->department,
                'specialization' => $teacher->specialization,
                'position' => $teacher->position,
                'lessons_count' => $teacher->lessons_count,
                'ai_suggestions_count' => $teacher->ai_suggestions_count,
            ]);

        return Inertia::render('admin/teachers/index', [
            'teachers' => $teachers,
        ]);
    }

    public function lessons(): Response
    {
        $lessons = Lesson::query()
            ->with('teacher:id,first_name,last_name')
            ->withCount(['lessonActivities', 'questions', 'progress'])
            ->latest('updated_at')
            ->get()
            ->map(fn (Lesson $lesson): array => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'subject' => $lesson->subject,
                'topic' => $lesson->topic,
                'teacher_name' => $lesson->teacher?->full_name,
                'difficulty_level' => $lesson->difficulty_level,
                'is_published' => $lesson->is_published,
                'activities_count' => $lesson->lesson_activities_count,
                'questions_count' => $lesson->questions_count,
                'students_started' => $lesson->progress_count,
                'updated_at' => $lesson->updated_at?->toDateString(),
            ]);

        return Inertia::render('admin/lessons/index', [
            'lessons' => $lessons,
        ]);
    }

    private function average($values): ?float
    {
        $values = collect($values)->filter(fn ($value): bool => $value !== null);

        return $values->isEmpty() ? null : round($values->avg(), 2);
    }
}
