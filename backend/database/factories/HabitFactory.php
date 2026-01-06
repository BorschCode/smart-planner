<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Habit>
 */
class HabitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->optional()->paragraph(),
            'type' => fake()->randomElement(['task', 'habit']),
            'frequency' => fake()->randomElement(['daily', 'weekly']),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the habit is a task.
     */
    public function task(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'task',
        ]);
    }

    /**
     * Indicate that the habit is a habit.
     */
    public function habit(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'habit',
        ]);
    }

    /**
     * Indicate that the habit is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
