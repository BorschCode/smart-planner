<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\PasswordResetResponse as PasswordResetResponseContract;

class JsonPasswordResetResponse implements PasswordResetResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'message' => 'Password has been reset successfully',
        ]);
    }
}
