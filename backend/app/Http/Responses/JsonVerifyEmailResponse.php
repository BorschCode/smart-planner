<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;

class JsonVerifyEmailResponse implements VerifyEmailResponseContract
{
    public function toResponse($request): JsonResponse|RedirectResponse
    {
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Email verified successfully',
            ]);
        }

        // Redirect to frontend verified page
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

        return redirect()->away($frontendUrl . '/email-verified');
    }
}
