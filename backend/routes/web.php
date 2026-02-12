<?php

use App\Http\Controllers\SwaggerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Fortify handles: login, register, logout, forgot-password, reset-password,
// email verification, two-factor authentication, password confirmation

// Swagger UI
Route::get('/docs/openapi.yaml', [SwaggerController::class, 'spec']);
Route::get('/docs', [SwaggerController::class, 'ui']);
