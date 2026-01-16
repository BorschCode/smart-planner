<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorTokenController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'device_name' => ['sometimes', 'string', 'max:255'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if 2FA is enabled and confirmed
        if ($this->userHasTwoFactorEnabled($user)) {
            return response()->json([
                'two_factor' => true,
                'message' => 'Two-factor authentication required',
                'two_factor_token' => encrypt([
                    'user_id' => $user->id,
                    'device_name' => $request->device_name ?? 'mobile',
                ]),
            ]);
        }

        $deviceName = $request->device_name ?? 'mobile';
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'two_factor' => false,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function challenge(Request $request): JsonResponse
    {
        $request->validate([
            'two_factor_token' => ['required', 'string'],
            'code' => ['nullable', 'string'],
            'recovery_code' => ['nullable', 'string'],
        ]);

        if (! $request->code && ! $request->recovery_code) {
            throw ValidationException::withMessages([
                'code' => ['Please provide a 2FA code or recovery code.'],
            ]);
        }

        try {
            $payload = decrypt($request->two_factor_token);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'two_factor_token' => ['Invalid two-factor token.'],
            ]);
        }

        $user = User::find($payload['user_id']);

        if (! $user || ! $this->userHasTwoFactorEnabled($user)) {
            throw ValidationException::withMessages([
                'two_factor_token' => ['Invalid two-factor token.'],
            ]);
        }

        $valid = false;

        if ($request->code) {
            $valid = $this->verifyCode($user, $request->code);
        } elseif ($request->recovery_code) {
            $valid = $this->verifyRecoveryCode($user, $request->recovery_code);
        }

        if (! $valid) {
            throw ValidationException::withMessages([
                'code' => ['The provided two-factor authentication code was invalid.'],
            ]);
        }

        $deviceName = $payload['device_name'] ?? 'mobile';
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    protected function userHasTwoFactorEnabled(User $user): bool
    {
        return $user->two_factor_secret !== null && $user->two_factor_confirmed_at !== null;
    }

    protected function verifyCode(User $user, string $code): bool
    {
        $google2fa = app(Google2FA::class);
        $secret = decrypt($user->two_factor_secret);

        return $google2fa->verifyKey($secret, $code);
    }

    protected function verifyRecoveryCode(User $user, string $code): bool
    {
        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);

        if (in_array($code, $recoveryCodes)) {
            // Remove used recovery code
            $user->forceFill([
                'two_factor_recovery_codes' => encrypt(json_encode(
                    array_values(array_diff($recoveryCodes, [$code]))
                )),
            ])->save();

            return true;
        }

        return false;
    }
}
