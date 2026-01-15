<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorChallengeViewResponse;
use Symfony\Component\HttpFoundation\Response;

class JsonTwoFactorChallengeViewResponse implements TwoFactorChallengeViewResponse
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'status' => 'two_factor_required',
            'two_factor_required' => true,
        ], Response::HTTP_CONFLICT);
    }
}
