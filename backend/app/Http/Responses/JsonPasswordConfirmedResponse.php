<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\PasswordConfirmedResponse;

class JsonPasswordConfirmedResponse implements PasswordConfirmedResponse
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'status' => 'password_confirmed',
        ]);
    }
}
