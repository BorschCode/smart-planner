<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\GenerateNewRecoveryCodes;

class TwoFactorController extends Controller
{
    public function enable(Request $request, EnableTwoFactorAuthentication $enable): JsonResponse
    {
        $enable($request->user(), $request->boolean('force', false));

        return response()->json([
            'message' => 'Two-factor authentication enabled',
            'two_factor_enabled' => true,
        ]);
    }

    public function disable(Request $request, DisableTwoFactorAuthentication $disable): JsonResponse
    {
        $disable($request->user());

        return response()->json([
            'message' => 'Two-factor authentication disabled',
            'two_factor_enabled' => false,
        ]);
    }

    public function qrCode(Request $request): JsonResponse
    {
        if (! $request->user()->two_factor_secret) {
            return response()->json([
                'message' => 'Two-factor authentication not enabled',
            ], Response::HTTP_BAD_REQUEST);
        }

        return response()->json([
            'svg' => $request->user()->twoFactorQrCodeSvg(),
            'url' => $request->user()->twoFactorQrCodeUrl(),
        ]);
    }

    public function secretKey(Request $request): JsonResponse
    {
        if (! $request->user()->two_factor_secret) {
            return response()->json([
                'message' => 'Two-factor authentication not enabled',
            ], Response::HTTP_BAD_REQUEST);
        }

        return response()->json([
            'secretKey' => decrypt($request->user()->two_factor_secret),
        ]);
    }

    public function confirm(Request $request, ConfirmTwoFactorAuthentication $confirm): JsonResponse
    {
        $confirm($request->user(), $request->input('code'));

        return response()->json([
            'message' => 'Two-factor authentication confirmed',
            'two_factor_confirmed' => true,
            'recovery_codes' => json_decode(decrypt($request->user()->two_factor_recovery_codes), true),
        ]);
    }

    public function recoveryCodes(Request $request): JsonResponse
    {
        if (! $request->user()->two_factor_secret) {
            return response()->json([
                'message' => 'Two-factor authentication not enabled',
            ], Response::HTTP_BAD_REQUEST);
        }

        return response()->json(
            json_decode(decrypt($request->user()->two_factor_recovery_codes), true)
        );
    }

    public function regenerateRecoveryCodes(Request $request, GenerateNewRecoveryCodes $generate): JsonResponse
    {
        $generate($request->user());

        return response()->json(
            json_decode(decrypt($request->user()->two_factor_recovery_codes), true)
        );
    }
}
