<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TokenAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Invalid'], 401);
        }

        $token = $request->user()
            ->createToken('mobile')
            ->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $request->user(),
        ]);
    }
}
