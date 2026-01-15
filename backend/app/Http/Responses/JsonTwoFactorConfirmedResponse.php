<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorConfirmedResponse as TwoFactorConfirmedResponseContract;

class JsonTwoFactorConfirmedResponse implements TwoFactorConfirmedResponseContract
{
    public function toResponse($request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'message' => 'Two-factor authentication confirmed',
            'two_factor_confirmed' => true,
            'recovery_codes' => json_decode(decrypt($user->two_factor_recovery_codes), true),
        ]);
    }
}
