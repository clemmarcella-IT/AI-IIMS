<?php

namespace Database\Seeders;

use App\Enums\Permission;
use App\Enums\Role as RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission as SpatiePermission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | CREATE ALL PERMISSIONS
        |--------------------------------------------------------------------------
        */

        foreach (Permission::cases() as $permission) {
            SpatiePermission::firstOrCreate([
                'name' => $permission->value,
                'guard_name' => 'web',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | CREATE ROLES
        |--------------------------------------------------------------------------
        */

        foreach (RoleEnum::cases() as $roleEnum) {
            $role = Role::firstOrCreate([
                'name' => $roleEnum->value,
                'guard_name' => 'web',
            ]);

            $this->syncPermissionsToRole($role);
        }

        $this->createAdmin();
    }

    /**
     * Assign permissions to role
     */
    private function syncPermissionsToRole(Role $role): void
    {
        $permissions = [];

        switch ($role->name) {

            /*
            |--------------------------------------------------------------------------
            | ADMIN
            |--------------------------------------------------------------------------
            */

            case RoleEnum::ADMIN->value:
                $permissions = Permission::cases();
                break;

                /*
                |--------------------------------------------------------------------------
                | TEACHER
                |--------------------------------------------------------------------------
                */

            case RoleEnum::TEACHER->value:
                $permissions = [

                    // Dashboard
                    Permission::DASHBOARD_TEACHER,

                    // Students
                    Permission::STUDENT_VIEW,

                    // Lessons
                    Permission::LESSON_VIEW,
                    Permission::LESSON_CREATE,
                    Permission::LESSON_UPDATE,
                    Permission::LESSON_DELETE,

                    // Activities
                    Permission::ACTIVITY_VIEW,
                    Permission::ACTIVITY_CREATE,
                    Permission::ACTIVITY_UPDATE,

                    // Tests
                    Permission::TEST_VIEW,
                    Permission::TEST_CREATE,
                    Permission::TEST_UPDATE,

                    // Results
                    Permission::RESULT_VIEW,
                    Permission::RESULT_EXPORT,

                    // Surveys
                    Permission::SURVEY_VIEW,
                    Permission::SURVEY_CREATE,

                    // AI
                    Permission::AI_FEEDBACK_GENERATE,
                    Permission::AI_RECOMMENDATION_VIEW,
                ];
                break;

                /*
                |--------------------------------------------------------------------------
                | STUDENT
                |--------------------------------------------------------------------------
                */

            case RoleEnum::STUDENT->value:
                $permissions = [

                    // Dashboard
                    Permission::DASHBOARD_STUDENT,

                    // Lessons
                    Permission::LESSON_VIEW,

                    // Activities
                    Permission::ACTIVITY_VIEW,
                    Permission::ACTIVITY_TAKE,

                    // Tests
                    Permission::TEST_VIEW,
                    Permission::TEST_TAKE,

                    // Survey
                    Permission::SURVEY_TAKE,

                    // AI
                    Permission::AI_FEEDBACK_GENERATE,
                    Permission::AI_RECOMMENDATION_VIEW,
                ];
                break;
        }

        $role->syncPermissions(
            collect($permissions)
                ->map(fn ($permission) => $permission->value)
                ->toArray()
        );
    }

    private function createAdmin(): void
    {
        $admin = User::firstOrCreate(
            [
                'email' => env('ADMIN_EMAIL', 'admin@admin.com'),
            ],
            [
                'name' => 'System Administrator',
                'password' => bcrypt(env('ADMIN_PASSWORD', 'password')),
            ]
        );

        $admin->assignRole(RoleEnum::ADMIN->value);
    }
}
