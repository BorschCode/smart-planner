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
     * @return array{
     *   id: int,
     *   habit_id: int,
     *   date: string,
     *   completed: bool,
     *   created_at: string|null,
     *   updated_at: string|null
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'habit_id' => $this->resource->habit_id,
            'date' => $this->resource->date->toDateString(),
            'completed' => (bool) $this->resource->completed,
            'created_at' => $this->resource->created_at?->toIso8601String(),
            'updated_at' => $this->resource->updated_at?->toIso8601String(),
        ];
    }
}
