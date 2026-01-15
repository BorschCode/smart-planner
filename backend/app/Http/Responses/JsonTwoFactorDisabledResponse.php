<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorDisabledResponse as TwoFactorDisabledResponseContract;

class JsonTwoFactorDisabledResponse implements TwoFactorDisabledResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'message' => 'Two-factor authentication disabled',
            'two_factor_enabled' => false,
        ]);
    }
}
