<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorChallengeViewResponse as TwoFactorChallengeViewResponseContract;

class JsonTwoFactorChallengeViewResponse implements TwoFactorChallengeViewResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'two_factor' => true,
            'message' => 'Two-factor authentication required',
        ]);
    }
}
