<?php

namespace App\Http\Resources;

use App\Models\Habit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Habit
 */
class HabitResource extends JsonResource
{
    /**
     * @return array{
     *   id: int,
     *   title: string,
     *   description: string|null,
     *   type: 'task'|'habit',
     *   frequency: 'daily'|'weekly',
     *   is_active: bool,
     *   created_at: string|null,
     *   updated_at: string|null,
     *   habit_logs: list<array{
     *     id: int,
     *     habit_id: int,
     *     date: string,
     *     completed: bool,
     *     created_at: string|null,
     *     updated_at: string|null
     *   }>|null
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'description' => $this->resource->description,

            // enums → API-safe scalars
            'type' => $this->resource->type->value,
            'frequency' => $this->resource->frequency->value,

            'is_active' => (bool) $this->resource->is_active,
            'created_at' => $this->resource->created_at?->toIso8601String(),
            'updated_at' => $this->resource->updated_at?->toIso8601String(),

            'habit_logs' => $this->resource->relationLoaded('habitLogs')
                ? HabitLogResource::collection($this->resource->habitLogs)->resolve()
                : null,
        ];
    }
}
