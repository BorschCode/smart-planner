<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SwaggerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// SPA Auth (session based)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');

// Current logged-in user (SPA)
Route::get('/user', function () {
    return auth()->user();
})->middleware('auth');

// Swagger UI
Route::get('/docs/openapi.yaml', [SwaggerController::class, 'spec']);
Route::get('/docs', [SwaggerController::class, 'ui']);

// React SPA entry
// Route::get('/{any}', fn () => view('app'))->where('any', '.*');
