<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Request;

class UserAvatarController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        // remove old avatar
        $user->avatar?->delete();

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->avatar()->create([
            'collection' => 'avatar',
            'path' => $path,
            'mime_type' => $request->file('avatar')->getMimeType(),
            'size' => $request->file('avatar')->getSize(),
        ]);

        return response()->json([
            'avatar_url' => $user->avatar->url(),
        ]);
    }

    public function destroy(Request $request)
    {
        $request->user()->avatar?->delete();

        return response()->noContent();
    }
}
