<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $description
 * @property string $type
 * @property string $frequency
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\HabitLog> $habitLogs
 * @property-read int|null $habit_logs_count
 * @property-read \App\Models\User $user
 *
 * @method static \Database\Factories\HabitFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit whereFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Habit whereUserId($value)
 *
 * @mixin \Eloquent
 */
class Habit extends Model
{
    /** @use HasFactory<\Database\Factories\HabitFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'type',
        'frequency',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the habit.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the habit logs for the habit.
     */
    public function habitLogs(): HasMany
    {
        return $this->hasMany(HabitLog::class);
    }
}
