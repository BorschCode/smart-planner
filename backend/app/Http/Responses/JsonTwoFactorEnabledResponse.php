<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorEnabledResponse as TwoFactorEnabledResponseContract;

class JsonTwoFactorEnabledResponse implements TwoFactorEnabledResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'message' => 'Two-factor authentication enabled',
            'two_factor_enabled' => true,
        ]);
    }
}
