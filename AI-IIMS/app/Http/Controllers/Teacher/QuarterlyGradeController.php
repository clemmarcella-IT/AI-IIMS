<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuarterlyGradeController extends Controller
{
    public function index(): Response
    {
        $students = Student::query()
            ->with('quarterlyGrades')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn (Student $student): array => [
                'id' => $student->id,
                'student_code' => $student->student_code,
                'name' => $student->full_name,
                'grade_level' => $student->grade_level,
                'section' => $student->section,
                'grades' => $student->quarterlyGrades
                    ->map(fn ($grade): array => [
                        'id' => $grade->id,
                        'subject' => $grade->subject,
                        'school_year' => $grade->school_year,
                        'quarter_1' => $grade->quarter_1 !== null ? (float) $grade->quarter_1 : null,
                        'quarter_2' => $grade->quarter_2 !== null ? (float) $grade->quarter_2 : null,
                        'quarter_3' => $grade->quarter_3 !== null ? (float) $grade->quarter_3 : null,
                        'quarter_4' => $grade->quarter_4 !== null ? (float) $grade->quarter_4 : null,
                        'average' => $grade->average(),
                    ])
                    ->values(),
            ]);

        return Inertia::render('teacher/quarterly-grades/index', [
            'students' => $students,
        ]);
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'school_year' => ['nullable', 'string', 'max:50'],
            'quarter_1' => ['nullable', 'numeric', 'between:0,100'],
            'quarter_2' => ['nullable', 'numeric', 'between:0,100'],
            'quarter_3' => ['nullable', 'numeric', 'between:0,100'],
            'quarter_4' => ['nullable', 'numeric', 'between:0,100'],
        ]);

        $student->quarterlyGrades()->updateOrCreate([
            'subject' => $data['subject'],
            'school_year' => $data['school_year'] ?? null,
        ], $data);

        return back()->with('success', 'Quarterly grades saved.');
    }
}
