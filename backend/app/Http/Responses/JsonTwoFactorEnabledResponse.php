<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorEnabledResponse;

class JsonTwoFactorEnabledResponse implements TwoFactorEnabledResponse
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'two_factor_enabled' => true,
        ]);
    }
}
