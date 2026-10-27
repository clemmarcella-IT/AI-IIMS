<?php

use App\Http\Controllers\Admin\AdminAnalyticsController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDirectoryController;
use App\Http\Controllers\Admin\AdminEngagementController;
use App\Http\Controllers\Admin\AdminInstrumentValidationController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminSurveyController;
use App\Http\Controllers\Admin\AdminTestController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\AiFeedbackController;
use App\Http\Controllers\Auth\StudentRegisterController;
use App\Http\Controllers\Auth\TeacherRegisterController;
use App\Http\Controllers\Student\ActivityController as StudentActivityIndexController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\LessonCheckpointController;
use App\Http\Controllers\Student\LessonController as StudentLessonController;
use App\Http\Controllers\Student\LessonCuePointResponseController;
use App\Http\Controllers\Student\LessonQuestionAttemptController;
use App\Http\Controllers\Student\ProgressController as StudentProgressController;
use App\Http\Controllers\Student\RecommendationController as StudentRecommendationController;
use App\Http\Controllers\Student\StudentLessonActivityController;
use App\Http\Controllers\Student\StudentSurveyController;
use App\Http\Controllers\Student\StudentTestController;
use App\Http\Controllers\Student\VideoProgressController;
use App\Http\Controllers\Teacher\AiLessonSuggestionController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\Teacher\LessonController as TeacherLessonController;
use App\Http\Controllers\Teacher\LessonCuePointController;
use App\Http\Controllers\Teacher\QuarterlyGradeController;
use App\Http\Controllers\Teacher\StudentController as TeacherStudentController;
use App\Http\Controllers\Teacher\SurveyController as TeacherSurveyController;
use App\Http\Controllers\Teacher\TestController as TeacherTestController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/register/select-role', function () {
    return Inertia::render('auth/select-role');
})->name('register.select-role');

Route::get('/register/student', function () {
    return Inertia::render('auth/register-student');
})->name('register.student');

Route::post('/register/student', [StudentRegisterController::class, 'store'])->name('register.student.store');

Route::get('/register/teacher', function () {
    return Inertia::render('auth/register-teacher');
})->name('register.teacher');

Route::post('/register/teacher', [TeacherRegisterController::class, 'store'])->name('register.teacher.store');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::inertia('dashboard', 'dashboard')->name('dashboard');
// });

/*
|--------------------------------------------------------------------------
| Authenticated Dashboard Redirect
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        /** @var User $user */
        $user = Auth::user();

        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->hasRole('teacher')) {
            return redirect()->route('teacher.dashboard');
        }

        if ($user->hasRole('student')) {
            return redirect()->route('student.dashboard');
        }

        abort(403);
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

        Route::resource('users', AdminUserController::class)->except(['show']);
        Route::resource('tests', AdminTestController::class)->except(['show']);

        Route::get('/students', [AdminDirectoryController::class, 'students'])->name('students.index');

        Route::get('/teachers', [AdminDirectoryController::class, 'teachers'])->name('teachers.index');

        Route::get('/lessons', [AdminDirectoryController::class, 'lessons'])->name('lessons.index');

        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/export', [AdminReportController::class, 'export'])->name('reports.export');

        Route::get('/analytics', [AdminAnalyticsController::class, 'index'])->name('analytics.index');
        Route::get('/analytics/export', [AdminAnalyticsController::class, 'export'])->name('analytics.export');

        Route::get('/engagement', [AdminEngagementController::class, 'index'])->name('engagement.index');

        Route::get('/instruments', [AdminInstrumentValidationController::class, 'index'])->name('instruments.index');
        Route::post('/instruments/reviews', [AdminInstrumentValidationController::class, 'store'])->name('instruments.reviews.store');

        Route::get('/surveys', [AdminSurveyController::class, 'index'])->name('surveys.index');
        Route::get('/surveys/create', [AdminSurveyController::class, 'create'])->name('surveys.create');
        Route::post('/surveys', [AdminSurveyController::class, 'store'])->name('surveys.store');
        Route::get('/surveys/{survey}/edit', [AdminSurveyController::class, 'edit'])->name('surveys.edit');
        Route::put('/surveys/{survey}', [AdminSurveyController::class, 'update'])->name('surveys.update');
        Route::delete('/surveys/{survey}', [AdminSurveyController::class, 'destroy'])->name('surveys.destroy');
        Route::patch('/surveys/{survey}/toggle-publish', [AdminSurveyController::class, 'togglePublish'])->name('surveys.toggle-publish');
        Route::get('/surveys/{survey}/results', [AdminSurveyController::class, 'results'])->name('surveys.results');
    });

/*
|--------------------------------------------------------------------------
| Teacher Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {
        Route::get('/dashboard', TeacherDashboardController::class)
            ->name('dashboard');

        Route::get('/students', [TeacherLessonController::class, 'index'])
            ->name('students.index');
        Route::get('/students/create', [TeacherStudentController::class, 'create'])
            ->name('students.create');
        Route::post('/students', [TeacherStudentController::class, 'store'])
            ->name('students.store');
        Route::get('/students/{student}/edit', [TeacherStudentController::class, 'edit'])
            ->name('students.edit');
        Route::put('/students/{student}', [TeacherStudentController::class, 'update'])
            ->name('students.update');
        Route::delete('/students/{student}', [TeacherStudentController::class, 'destroy'])
            ->name('students.destroy');

        Route::get('/lessons', [TeacherLessonController::class, 'index'])
            ->name('lessons.index');
        Route::get('/lessons/create', [TeacherLessonController::class, 'create'])
            ->name('lessons.create');
        Route::post('/lessons', [TeacherLessonController::class, 'store'])
            ->name('lessons.store');
        Route::post('/lessons/ai-suggestions/draft', [AiLessonSuggestionController::class, 'draft'])
            ->name('lessons.ai-suggestions.draft');
        Route::post('/lessons/ai-suggestions/generate', [AiLessonSuggestionController::class, 'generate'])
            ->name('lessons.ai-suggestions.generate');
        Route::post('/lessons/ai-suggestions/section-activity', [AiLessonSuggestionController::class, 'sectionActivity'])
            ->name('lessons.ai-suggestions.section-activity');
        Route::post('/lessons/ai-suggestions/{suggestion}/accept', [AiLessonSuggestionController::class, 'accept'])
            ->name('lessons.ai-suggestions.accept');
        Route::post('/lessons/ai-suggestions/{suggestion}/discard', [AiLessonSuggestionController::class, 'discard'])
            ->name('lessons.ai-suggestions.discard');
        Route::post('/lessons/batch-delete', [TeacherLessonController::class, 'batchDestroy'])
            ->name('lessons.batch-destroy');
        Route::post('/lessons/batch-republish', [TeacherLessonController::class, 'batchRepublish'])
            ->name('lessons.batch-republish');
        Route::post('/lessons/{lesson}/duplicate', [TeacherLessonController::class, 'duplicate'])
            ->name('lessons.duplicate');
        Route::get('/lessons/{lesson}/edit', [TeacherLessonController::class, 'edit'])
            ->name('lessons.edit');
        Route::put('/lessons/{lesson}', [TeacherLessonController::class, 'update'])
            ->name('lessons.update');
        Route::delete('/lessons/{lesson}', [TeacherLessonController::class, 'destroy'])
            ->name('lessons.destroy');
        Route::post('/lesson-media/{media}/cue-points', [LessonCuePointController::class, 'store'])
            ->name('cue-points.store');
        Route::put('/cue-points/{cuePoint}', [LessonCuePointController::class, 'update'])
            ->name('cue-points.update');
        Route::delete('/cue-points/{cuePoint}', [LessonCuePointController::class, 'destroy'])
            ->name('cue-points.destroy');
        Route::get('/questions', fn () => redirect()
            ->route('teacher.lessons.index')
            ->with('info', 'Quiz items now live inside each lesson as Mini Quiz activities. Open a lesson to edit them.'))
            ->name('questions.index');
        Route::post('/questions', [TeacherLessonController::class, 'storeQuestion'])
            ->name('questions.store');
        Route::put('/questions/{question}', [TeacherLessonController::class, 'updateQuestion'])
            ->name('questions.update');
        Route::delete('/questions/{question}', [TeacherLessonController::class, 'destroyQuestion'])
            ->name('questions.destroy');
        Route::get('/export', [TeacherLessonController::class, 'export'])
            ->name('export');

        Route::get('/activities', [TeacherLessonController::class, 'index'])
            ->name('activities.index');
        Route::get('/activities/{student}/{lesson}', [TeacherLessonController::class, 'reviewActivityAnswers'])
            ->name('activities.review');

        Route::get('/tests', [TeacherTestController::class, 'index'])->name('tests.index');

        Route::get('/quarterly-grades', [QuarterlyGradeController::class, 'index'])
            ->name('quarterly-grades.index');
        Route::put('/quarterly-grades/{student}', [QuarterlyGradeController::class, 'update'])
            ->name('quarterly-grades.update');

        Route::get('/results', [TeacherLessonController::class, 'index'])
            ->name('results.index');

        Route::get('/surveys', [TeacherSurveyController::class, 'index'])->name('surveys.index');
        Route::get('/surveys/create', [TeacherSurveyController::class, 'create'])->name('surveys.create');
        Route::post('/surveys', [TeacherSurveyController::class, 'store'])->name('surveys.store');
        Route::get('/surveys/{survey}/edit', [TeacherSurveyController::class, 'edit'])->name('surveys.edit');
        Route::put('/surveys/{survey}', [TeacherSurveyController::class, 'update'])->name('surveys.update');
        Route::delete('/surveys/{survey}', [TeacherSurveyController::class, 'destroy'])->name('surveys.destroy');
        Route::patch('/surveys/{survey}/toggle-publish', [TeacherSurveyController::class, 'togglePublish'])->name('surveys.toggle-publish');
        Route::get('/surveys/{survey}/results', [TeacherSurveyController::class, 'results'])->name('surveys.results');
    });

/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/dashboard', StudentDashboardController::class)
            ->name('dashboard');

        Route::get('/lessons', [StudentLessonController::class, 'index'])
            ->name('lessons.index');

        Route::get('/lessons/{lesson}', [StudentLessonController::class, 'show'])
            ->name('lessons.show');
        Route::post('/lessons/{lesson}/checkpoints', [LessonCheckpointController::class, 'store'])
            ->name('lessons.checkpoints.store');
        Route::post('/lesson-questions/{question}/attempts', [LessonQuestionAttemptController::class, 'store'])
            ->name('lesson-questions.attempts.store');

        Route::get('/activities', [StudentActivityIndexController::class, 'index'])->name('activities.index');

        Route::get('/pretest', [StudentTestController::class, 'pretest'])
            ->name('pretest');

        Route::get('/posttest', [StudentTestController::class, 'posttest'])
            ->name('posttest');

        Route::post('/tests/{test}/submit', [StudentTestController::class, 'submit'])
            ->name('tests.submit');

        Route::post('/activities/{activity}/submit', [StudentLessonActivityController::class, 'submit'])
            ->name('activities.submit');
        Route::post('/cue-points/{cuePoint}/respond', [LessonCuePointResponseController::class, 'store'])
            ->name('cue-points.respond');
        Route::post('/video-progress', [VideoProgressController::class, 'store'])
            ->name('video-progress.update');

        Route::get('/progress', [StudentProgressController::class, 'index'])->name('progress.index');

        Route::get('/recommendations', [StudentRecommendationController::class, 'index'])->name('recommendations.index');

        Route::get('/survey', [StudentSurveyController::class, 'index'])->name('survey.index');
        Route::post('/survey/{survey}/submit', [StudentSurveyController::class, 'submit'])->name('survey.submit');
    });

Route::post('/student/ai/explain-wrong-answer', [AiFeedbackController::class, 'explain'])
    ->middleware(['auth', 'verified', 'role:student']);

Route::get('/test-gemini', function () {

    $response = Http::post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='.config('services.gemini.key'),
        [
            'contents' => [
                [
                    'parts' => [
                        [
                            'text' => 'Hello Gemini',
                        ],
                    ],
                ],
            ],
        ]
    );

    return $response->json();
});

require __DIR__.'/settings.php';
// require __DIR__.'/api.php';
