<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar?->url(),
            'created_at' => $this->created_at,
            'email_verified_at' => $this->email_verified_at,
            'two_factor_confirmed_at' => $this->two_factor_confirmed_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
