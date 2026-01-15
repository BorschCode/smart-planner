<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LogoutResponse;

class JsonLogoutResponse implements LogoutResponse
{
    public function toResponse($request): JsonResponse
    {
        return response()->json([
            'status' => 'logged_out',
        ]);
    }
}
