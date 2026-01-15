<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class JsonLoginResponse implements LoginResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'message' => 'Login successful',
            'user' => $request->user(),
            'two_factor' => false,
        ]);
    }
}
