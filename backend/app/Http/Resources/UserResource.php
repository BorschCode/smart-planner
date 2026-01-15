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
    /**
     * @return array{
     *   id: int,
     *   name: string,
     *   email: string,
     *   email_verified_at: string|null,
     *   two_factor_enabled: bool,
     *   created_at: string,
     *   updated_at: string
     * }
     */
    public function toArray(Request $request): array
    {
        /** @var User $this */

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,

            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'two_factor_enabled' => ! empty($this->two_factor_secret),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
