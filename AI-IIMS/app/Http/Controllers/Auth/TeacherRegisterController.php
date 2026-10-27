<?php

namespace App\Http\Controllers\Auth;

use App\Enums\Role as RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class TeacherRegisterController extends Controller
{
    public function create()
    {
        return inertia('auth/register-teacher');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // User fields
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'confirmed',
                Rules\Password::defaults(),
            ],

            // Teacher fields
            'employee_no' => [
                'required',
                'string',
                'max:255',
                'unique:teachers,employee_no',
            ],

            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],

            'department' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $user->assignRole(RoleEnum::TEACHER->value);

            Teacher::create([
                'user_id' => $user->id,
                'employee_no' => $validated['employee_no'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'department' => $validated['department'] ?? null,
                'specialization' => $validated['specialization'] ?? null,
                'position' => $validated['position'] ?? null,
            ]);

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            return redirect()->route('dashboard');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors([
                'register' => 'Failed to create teacher account.',
            ]);
        }
    }
}
