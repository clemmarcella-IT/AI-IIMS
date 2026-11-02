<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $tableNames = config('permission.table_names');

        foreach (['model_has_roles', 'model_has_permissions'] as $tableName) {
            $table = $tableNames[$tableName] ?? null;

            if ($table !== null && DB::getSchemaBuilder()->hasTable($table)) {
                DB::table($table)
                    ->where('model_type', 'AppModelsUser')
                    ->update(['model_type' => User::class]);
            }
        }
    }

    public function down(): void
    {
        // The corrected model type is compatible with the current application.
    }
};
