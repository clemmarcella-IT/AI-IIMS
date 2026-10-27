<?php

use App\Enums\Role as RoleEnum;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

function createTeacherStudentCreateUser(): User
{
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    Role::firstOrCreate(['name' => RoleEnum::TEACHER->value]);
    Role::firstOrCreate(['name' => RoleEnum::STUDENT->value]);

    $user = User::factory()->create();
    $user->assignRole(RoleEnum::TEACHER->value);

    Teacher::query()->create([
        'user_id' => $user->id,
        'employee_no' => 'T-'.str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
        'first_name' => 'Ada',
        'last_name' => 'Lovelace',
    ]);

    return $user;
}

it('allows teachers to add student accounts', function () {
    $teacher = createTeacherStudentCreateUser();

    $response = $this->actingAs($teacher)->post(route('teacher.students.store'), [
        'name' => 'Grace Hopper',
        'email' => 'grace@example.com',
        'password' => 'password',
        'student_code' => 'STU-1001',
        'first_name' => 'Grace',
        'last_name' => 'Hopper',
        'grade_level' => 'Grade 11',
        'section' => 'STEM A',
        'consent_status' => true,
    ]);

    $response->assertRedirect(route('teacher.students.index'));

    $studentUser = User::query()->where('email', 'grace@example.com')->firstOrFail();

    expect($studentUser->hasRole(RoleEnum::STUDENT->value))->toBeTrue()
        ->and(Student::query()->where('student_code', 'STU-1001')->exists())->toBeTrue();
});

it('validates unique student account details', function () {
    $teacher = createTeacherStudentCreateUser();

    User::factory()->create(['email' => 'taken@example.com']);
    Student::query()->create([
        'user_id' => User::factory()->create()->id,
        'student_code' => 'STU-1001',
        'first_name' => 'Existing',
        'last_name' => 'Student',
        'grade_level' => 'Grade 11',
        'section' => 'STEM A',
    ]);

    $response = $this->actingAs($teacher)
        ->from(route('teacher.students.create'))
        ->post(route('teacher.students.store'), [
            'name' => 'New Student',
            'email' => 'taken@example.com',
            'password' => 'password',
            'student_code' => 'STU-1001',
            'first_name' => 'New',
            'last_name' => 'Student',
            'grade_level' => 'Grade 11',
            'section' => 'STEM B',
        ]);

    $response->assertRedirect(route('teacher.students.create'));
    $response->assertSessionHasErrors(['email', 'student_code']);
});
