<?php

use App\Http\Controllers\AiFeedbackController;
use Illuminate\Support\Facades\Route;


Route::post('/ai/explain-wrong-answer', [AiFeedbackController::class, 'explain'])
    ->middleware(['auth']);
