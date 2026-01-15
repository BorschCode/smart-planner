<?php

namespace App\Enums;

enum HabitType: string
{
    case TASK = 'task';
    case HABIT = 'habit';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
