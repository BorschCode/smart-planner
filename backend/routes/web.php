<?php

use App\Http\Controllers\SwaggerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/docs/openapi.yaml', [SwaggerController::class, 'spec']);
Route::get('/docs', [SwaggerController::class, 'ui']);
