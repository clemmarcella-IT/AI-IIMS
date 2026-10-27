<?php

namespace App\Http\Controllers\Auth;

use App\Enums\Role as RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class StudentRegisterController extends Controller
{
    public function create(){
        return inertia('auth/register-student');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            /*
            |--------------------------------------------------------------------------
            | USER FIELDS
            |--------------------------------------------------------------------------
            */

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

            /*
            |--------------------------------------------------------------------------
            | STUDENT FIELDS
            |--------------------------------------------------------------------------
            */

            'student_code' => [
                'required',
                'string',
                'max:255',
                'unique:students,student_code',
            ],

            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],

            'grade_level' => ['required', 'string', 'max:255'],
            'section' => ['required', 'string', 'max:255'],

            /*
            |--------------------------------------------------------------------------
            | CONSENT
            |--------------------------------------------------------------------------
            */

            'consent_status' => ['required', 'boolean'],
        ]);

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | CREATE USER
            |--------------------------------------------------------------------------
            */

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            /*
            |--------------------------------------------------------------------------
            | ASSIGN ROLE
            |--------------------------------------------------------------------------
            */

            $user->assignRole(RoleEnum::STUDENT->value);

            /*
            |--------------------------------------------------------------------------
            | CREATE STUDENT PROFILE
            |--------------------------------------------------------------------------
            */

            Student::create([
                'user_id' => $user->id,

                'student_code' => $validated['student_code'],

                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],

                'grade_level' => $validated['grade_level'],
                'section' => $validated['section'],

                'consent_status' => $validated['consent_status'],
            ]);

            DB::commit();

            /*
            |--------------------------------------------------------------------------
            | FIRE REGISTER EVENT
            |--------------------------------------------------------------------------
            */

            event(new Registered($user));

            /*
            |--------------------------------------------------------------------------
            | AUTO LOGIN
            |--------------------------------------------------------------------------
            */

            Auth::login($user);

            /*
            |--------------------------------------------------------------------------
            | REDIRECT
            |--------------------------------------------------------------------------
            */

            return redirect()->route('dashboard');

        } catch (\Throwable $th) {

            DB::rollBack();

            return back()->withErrors([
                'register' => 'Failed to create student account.',
            ]);
        }
    }
}
