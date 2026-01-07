<?php

namespace Database\Seeders;

use App\Models\Habit;
use App\Models\User;
use Illuminate\Database\Seeder;

class HabitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a test user
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create daily habits
        $dailyHabits = [
            [
                'title' => 'Morning Meditation',
                'description' => '10 minutes of mindfulness meditation',
                'type' => 'habit',
                'frequency' => 'daily',
                'is_active' => true,
            ],
            [
                'title' => 'Exercise',
                'description' => '30 minutes of physical activity',
                'type' => 'habit',
                'frequency' => 'daily',
                'is_active' => true,
            ],
            [
                'title' => 'Read',
                'description' => 'Read for at least 20 minutes',
                'type' => 'habit',
                'frequency' => 'daily',
                'is_active' => true,
            ],
            [
                'title' => 'Drink Water',
                'description' => 'Drink 8 glasses of water',
                'type' => 'habit',
                'frequency' => 'daily',
                'is_active' => true,
            ],
        ];

        foreach ($dailyHabits as $habitData) {
            Habit::create(array_merge($habitData, ['user_id' => $user->id]));
        }

        // Create weekly habits
        $weeklyHabits = [
            [
                'title' => 'Grocery Shopping',
                'description' => 'Buy groceries for the week',
                'type' => 'task',
                'frequency' => 'weekly',
                'is_active' => true,
            ],
            [
                'title' => 'Clean House',
                'description' => 'Deep clean the entire house',
                'type' => 'task',
                'frequency' => 'weekly',
                'is_active' => true,
            ],
            [
                'title' => 'Meal Prep',
                'description' => 'Prepare meals for the week',
                'type' => 'task',
                'frequency' => 'weekly',
                'is_active' => true,
            ],
        ];

        foreach ($weeklyHabits as $habitData) {
            Habit::create(array_merge($habitData, ['user_id' => $user->id]));
        }

        // Create some inactive habits
        Habit::create([
            'user_id' => $user->id,
            'title' => 'Old Habit',
            'description' => 'This habit is no longer active',
            'type' => 'habit',
            'frequency' => 'daily',
            'is_active' => false,
        ]);
    }
}
