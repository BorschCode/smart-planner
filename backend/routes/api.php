<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HabitController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::post('auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth endpoints
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/user', [AuthController::class, 'user']);

    // Legacy user endpoint
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    // Habits
    Route::apiResource('habits', HabitController::class);
    Route::post('habits/{habit}/complete', [HabitController::class, 'complete']);
});

