<?php

use App\Http\Controllers\Api\HabitController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::apiResource('habits', HabitController::class);

    Route::post('habits/{habit}/complete', [HabitController::class, 'complete'])
        ->name('habits.complete');
});
