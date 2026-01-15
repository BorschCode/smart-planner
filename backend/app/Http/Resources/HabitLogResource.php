<?php

namespace App\Http\Resources;

use App\Models\HabitLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin HabitLog
 */
class HabitLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array{
     *   id: int,
     *   habit_id: int,
     *   date: string,
     *   completed: bool,
     *   created_at: string,
     *   updated_at: string
     * }
     */
    public function toArray(Request $request): array
    {
        /** @var HabitLog $this */

        return [
            'id' => $this->id,
            'habit_id' => $this->habit_id,
            'date' => $this->date->toDateString(),
            'completed' => (bool) $this->completed,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
