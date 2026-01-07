<?php

namespace Database\Seeders;

use App\Models\Habit;
use App\Models\HabitLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class HabitLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $habits = Habit::where('is_active', true)->get();

        if ($habits->isEmpty()) {
            $this->command->warn('No active habits found. Please run HabitSeeder first.');

            return;
        }

        // Create logs for the past 30 days
        $endDate = Carbon::today();
        $startDate = $endDate->copy()->subDays(30);

        foreach ($habits as $habit) {
            $currentDate = $startDate->copy();

            while ($currentDate->lte($endDate)) {
                // Different completion rates based on habit type and frequency
                $completionRate = $this->getCompletionRate($habit, $currentDate);
                $completed = rand(1, 100) <= $completionRate;

                HabitLog::create([
                    'habit_id' => $habit->id,
                    'date' => $currentDate->toDateString(),
                    'completed' => $completed,
                ]);

                // For weekly habits, only create logs on specific days
                if ($habit->frequency === 'weekly') {
                    $currentDate->addWeek();
                } else {
                    $currentDate->addDay();
                }
            }
        }

        $this->command->info('Created habit logs for the past 30 days.');
    }

    /**
     * Get completion rate based on habit characteristics.
     */
    private function getCompletionRate(Habit $habit, Carbon $date): int
    {
        // Base completion rate
        $baseRate = 70;

        // Daily habits are more likely to be completed
        if ($habit->frequency === 'daily') {
            $baseRate += 10;
        }

        // Recent dates have higher completion rates (improvement over time)
        $daysAgo = Carbon::today()->diffInDays($date);
        if ($daysAgo < 7) {
            $baseRate += 15;
        } elseif ($daysAgo < 14) {
            $baseRate += 10;
        } elseif ($daysAgo < 21) {
            $baseRate += 5;
        }

        // Weekend effect for daily habits (slightly lower completion)
        if ($habit->frequency === 'daily' && in_array($date->dayOfWeek, [Carbon::SATURDAY, Carbon::SUNDAY])) {
            $baseRate -= 10;
        }

        // Ensure rate is between 0 and 100
        return max(0, min(100, $baseRate));
    }
}
