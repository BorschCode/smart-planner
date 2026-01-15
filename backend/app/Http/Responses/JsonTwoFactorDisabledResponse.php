<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorDisabledResponse;

class JsonTwoFactorDisabledResponse implements TwoFactorDisabledResponse
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'two_factor_enabled' => false,
        ]);
    }
}
