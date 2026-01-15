<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse;

class JsonVerifyEmailResponse implements VerifyEmailResponse
{
    public function toResponse($request): JsonResponse|RedirectResponse
    {
        if ($request->wantsJson()) {
            return response()->json([
                'email_verified' => true,
            ]);
        }

        return redirect()->away(
            config('app.frontend_url') . '/email-verified'
        );
    }
}
