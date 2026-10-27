<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $role = (string) $request->query('role', 'all');

        $users = User::query()
            ->with(['roles:id,name', 'student', 'teacher'])
            ->where('email', '!=', env('ADMIN_EMAIL', 'admin@admin.com'))
            ->where('name', '!=', 'System Administrator')
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('student', fn ($query) => $query
                        ->where('student_code', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%"))
                    ->orWhereHas('teacher', fn ($query) => $query
                        ->where('employee_no', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%"));
            }))
            ->when(in_array($role, ['admin', 'teacher', 'student'], true), fn ($query) => $query->role($role))
            ->latest('updated_at')
            ->get()
            ->map(fn (User $user): array => $this->serializeUser($user));

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'user' => null,
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

            $this->syncRoleAndProfile($user, $data);
        });

        return redirect()->route('admin.users.index')->with('success', 'User created.');
    }

    public function edit(User $user): Response
    {
        $user->load(['roles:id,name', 'student', 'teacher']);

        return Inertia::render('admin/users/edit', [
            'user' => $this->serializeUser($user),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $this->validatedData($request, $user);

        DB::transaction(function () use ($data, $user): void {
            $user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                ...(! empty($data['password']) ? ['password' => $data['password']] : []),
            ]);

            $this->syncRoleAndProfile($user, $data);
        });

        return redirect()->route('admin.users.index')->with('success', 'User updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'User deleted.');
    }

    private function validatedData(Request $request, ?User $user = null): array
    {
        $role = (string) $request->input('role');
        $student = $user?->student;
        $teacher = $user?->teacher;

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'password' => [$user ? 'nullable' : 'required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['admin', 'teacher', 'student'])],
            'student_code' => [Rule::requiredIf($role === 'student'), 'nullable', 'string', 'max:255', Rule::unique('students', 'student_code')->ignore($student)],
            'student_first_name' => [Rule::requiredIf($role === 'student'), 'nullable', 'string', 'max:255'],
            'student_last_name' => [Rule::requiredIf($role === 'student'), 'nullable', 'string', 'max:255'],
            'grade_level' => [Rule::requiredIf($role === 'student'), 'nullable', 'string', 'max:255'],
            'section' => [Rule::requiredIf($role === 'student'), 'nullable', 'string', 'max:255'],
            'consent_status' => ['nullable', 'boolean'],
            'employee_no' => [Rule::requiredIf($role === 'teacher'), 'nullable', 'string', 'max:255', Rule::unique('teachers', 'employee_no')->ignore($teacher)],
            'teacher_first_name' => [Rule::requiredIf($role === 'teacher'), 'nullable', 'string', 'max:255'],
            'teacher_last_name' => [Rule::requiredIf($role === 'teacher'), 'nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function syncRoleAndProfile(User $user, array $data): void
    {
        $role = $data['role'];

        $user->syncRoles([$role]);

        if ($role === 'student') {
            $user->student()->updateOrCreate([], [
                'student_code' => $data['student_code'],
                'first_name' => $data['student_first_name'],
                'last_name' => $data['student_last_name'],
                'grade_level' => $data['grade_level'],
                'section' => $data['section'],
                'consent_status' => (bool) ($data['consent_status'] ?? false),
            ]);
            $this->deleteTeacherProfileIfSafe($user);

            return;
        }

        if ($role === 'teacher') {
            $user->teacher()->updateOrCreate([], [
                'employee_no' => $data['employee_no'],
                'first_name' => $data['teacher_first_name'],
                'last_name' => $data['teacher_last_name'],
                'department' => $data['department'] ?? null,
                'specialization' => $data['specialization'] ?? null,
                'position' => $data['position'] ?? null,
            ]);
            $this->deleteStudentProfileIfSafe($user);

            return;
        }

        $this->deleteStudentProfileIfSafe($user);
        $this->deleteTeacherProfileIfSafe($user);
    }

    private function deleteStudentProfileIfSafe(User $user): void
    {
        $student = $user->student;

        if ($student && $student->lessonProgress()->doesntExist() && $student->testAttempts()->doesntExist()) {
            $student->delete();
            $user->unsetRelation('student');
        }
    }

    private function deleteTeacherProfileIfSafe(User $user): void
    {
        $teacher = $user->teacher;

        if ($teacher && $teacher->lessons()->doesntExist() && $teacher->aiSuggestions()->doesntExist()) {
            $teacher->delete();
            $user->unsetRelation('teacher');
        }
    }

    private function serializeUser(User $user): array
    {
        $role = $user->roles->pluck('name')->first() ?? 'student';

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $role,
            'created_at' => $user->created_at?->toDateString(),
            'student' => $user->student ? [
                'id' => $user->student->id,
                'student_code' => $user->student->student_code,
                'first_name' => $user->student->first_name,
                'last_name' => $user->student->last_name,
                'grade_level' => $user->student->grade_level,
                'section' => $user->student->section,
                'consent_status' => $user->student->consent_status,
            ] : null,
            'teacher' => $user->teacher ? [
                'id' => $user->teacher->id,
                'employee_no' => $user->teacher->employee_no,
                'first_name' => $user->teacher->first_name,
                'last_name' => $user->teacher->last_name,
                'department' => $user->teacher->department,
                'specialization' => $user->teacher->specialization,
                'position' => $user->teacher->position,
            ] : null,
        ];
    }
}
