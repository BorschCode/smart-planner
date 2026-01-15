<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $habit_id
 * @property \Illuminate\Support\Carbon $date
 * @property bool $completed
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Habit $habit
 * @method static \Database\Factories\HabitLogFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HabitLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HabitLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HabitLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HabitLog whereCompleted($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HabitLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HabitLog whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HabitLog whereHabitId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HabitLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HabitLog whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class HabitLog extends Model
{
    /** @use HasFactory<\Database\Factories\HabitLogFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'habit_id',
        'date',
        'completed',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'completed' => 'boolean',
        ];
    }

    /**
     * Get the habit that owns the log.
     */
    public function habit(): BelongsTo
    {
        return $this->belongsTo(Habit::class);
    }
}
