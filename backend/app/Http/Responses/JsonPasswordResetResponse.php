<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\PasswordResetResponse;

class JsonPasswordResetResponse implements PasswordResetResponse
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'status' => 'password_reset',
        ]);
    }
}
