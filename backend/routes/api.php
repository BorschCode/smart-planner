<?php

use App\Http\Controllers\Api\HabitController;
use App\Http\Controllers\Api\TokenAuthController;
use Illuminate\Support\Facades\Route;

// Token login for mobile / Postman
Route::post('/token/login', [TokenAuthController::class, 'login']);

// Protected token API
Route::middleware('auth:sanctum')->group(function () {

    Route::get('user', function () {
        return auth()->user();
    });

    Route::apiResource('habits', HabitController::class);
    Route::post('habits/{habit}/complete', [HabitController::class, 'complete']);
});
