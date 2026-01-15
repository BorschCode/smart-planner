<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class JsonRegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'message' => 'Registration successful',
            'user' => $request->user(),
        ], 201);
    }
}
