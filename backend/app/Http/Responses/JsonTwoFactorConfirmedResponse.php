<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorConfirmedResponse;

class JsonTwoFactorConfirmedResponse implements TwoFactorConfirmedResponse
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'two_factor_confirmed' => true,
        ]);
    }
}
