<?php

use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\HabitController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\TwoFactorController;
use App\Http\Controllers\Api\TwoFactorTokenController;
use Illuminate\Support\Facades\Route;

// Public API routes
Route::post('/register', [RegisterController::class, 'store']);
Route::post('/token/login', [TwoFactorTokenController::class, 'login']);
Route::post('/token/two-factor-challenge', [TwoFactorTokenController::class, 'challenge']);
Route::post('/password/forgot', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password/reset', [PasswordResetController::class, 'reset']);

// Protected token API
Route::middleware('auth:sanctum')->group(function () {

    Route::get('user', function () {
        return auth()->user();
    });

    // Email verification
    Route::post('/email/resend', [EmailVerificationController::class, 'resend']);

    // Two-factor authentication management
    Route::prefix('two-factor')->group(function () {
        Route::post('/', [TwoFactorController::class, 'enable']);
        Route::delete('/', [TwoFactorController::class, 'disable']);
        Route::get('/qr-code', [TwoFactorController::class, 'qrCode']);
        Route::get('/secret-key', [TwoFactorController::class, 'secretKey']);
        Route::post('/confirm', [TwoFactorController::class, 'confirm']);
        Route::get('/recovery-codes', [TwoFactorController::class, 'recoveryCodes']);
        Route::post('/recovery-codes', [TwoFactorController::class, 'regenerateRecoveryCodes']);
    });

    Route::apiResource('habits', HabitController::class);
    Route::post('habits/{habit}/complete', [HabitController::class, 'complete']);
});
