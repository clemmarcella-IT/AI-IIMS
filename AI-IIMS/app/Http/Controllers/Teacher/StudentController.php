<?php

namespace App\Http\Controllers\Teacher;

use App\Enums\Role as RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('teacher/students/create', [
            'student' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        DB::transaction(function () use ($data): void {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);

            $user->assignRole(RoleEnum::STUDENT->value);

            Student::query()->create([
                'user_id' => $user->id,
                'student_code' => $data['student_code'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'grade_level' => $data['grade_level'],
                'section' => $data['section'],
                'consent_status' => (bool) ($data['consent_status'] ?? false),
            ]);
        });

        return redirect()
            ->route('teacher.students.index')
            ->with('success', 'Student added.');
    }

    public function edit(Student $student): Response
    {
        $student->load('user');

        return Inertia::render('teacher/students/edit', [
            'student' => $this->serializeStudent($student),
        ]);
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $student->load('user');
        $data = $this->validatedData($request, $student);

        DB::transaction(function () use ($data, $student): void {
            $student->user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                ...(! empty($data['password']) ? ['password' => $data['password']] : []),
            ]);

            $student->update([
                'student_code' => $data['student_code'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'grade_level' => $data['grade_level'],
                'section' => $data['section'],
                'consent_status' => (bool) ($data['consent_status'] ?? false),
            ]);

            $student->user->assignRole(RoleEnum::STUDENT->value);
        });

        return redirect()
            ->route('teacher.students.index')
            ->with('success', 'Student updated.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        $student->load('user');

        $student->user->delete();

        return back()->with('success', 'Student deleted.');
    }

    private function validatedData(Request $request, ?Student $student = null): array
    {
        $student?->loadMissing('user');

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($student?->user)],
            'password' => [$student ? 'nullable' : 'required', Rules\Password::defaults()],
            'student_code' => ['required', 'string', 'max:255', Rule::unique('students', 'student_code')->ignore($student)],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'grade_level' => ['required', 'string', 'max:255'],
            'section' => ['required', 'string', 'max:255'],
            'consent_status' => ['nullable', 'boolean'],
        ]);
    }

    private function serializeStudent(Student $student): array
    {
        return [
            'id' => $student->id,
            'name' => $student->user?->name ?? $student->full_name,
            'email' => $student->user?->email ?? '',
            'student_code' => $student->student_code,
            'first_name' => $student->first_name,
            'last_name' => $student->last_name,
            'grade_level' => $student->grade_level,
            'section' => $student->section,
            'consent_status' => $student->consent_status,
        ];
    }
}
