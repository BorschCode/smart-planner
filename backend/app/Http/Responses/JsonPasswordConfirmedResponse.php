<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\PasswordConfirmedResponse as PasswordConfirmedResponseContract;

class JsonPasswordConfirmedResponse implements PasswordConfirmedResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'message' => 'Password confirmed',
        ]);
    }
}
