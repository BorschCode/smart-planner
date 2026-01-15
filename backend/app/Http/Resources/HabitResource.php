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
     * Transform the resource into an array.
     *
     * @return array{
     *   id: int,
     *   title: string,
     *   description: string|null,
     *   type: 'task'|'habit',
     *   frequency: 'daily'|'weekly',
     *   is_active: bool,
     *   created_at: string,
     *   updated_at: string,
     *   habit_logs: array<int, array>|null
     * }
     */
    public function toArray(Request $request): array
    {
        /** @var Habit $this */

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'frequency' => $this->frequency,
            'is_active' => (bool) $this->is_active,

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

            'habit_logs' => $this->relationLoaded('habitLogs')
                ? HabitLogResource::collection($this->habitLogs)->resolve()
                : null,
        ];
    }
}
