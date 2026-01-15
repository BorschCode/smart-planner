<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;

class JsonTwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'message' => 'Login successful',
            'user' => $request->user(),
            'two_factor' => true,
        ]);
    }
}
