<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;

class JsonLogoutResponse implements LogoutResponseContract
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
