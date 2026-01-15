<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class JsonLoginResponse implements LoginResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'status' => 'authenticated',
            'two_factor_required' => false,
            'user' => new UserResource($request->user()),
        ]);
    }
}
