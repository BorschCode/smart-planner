<?php

namespace App\Enums;

enum HabitFrequency: string
{
    case DAILY = 'daily';
    case WEEKLY = 'weekly';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
