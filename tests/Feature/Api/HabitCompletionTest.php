<?php

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\User;

test('can mark habit as complete for today', function () {
    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create();

    $response = $this
        ->actingAs($user)
        ->postJson("/api/habits/{$habit->id}/complete");

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'habit_id' => $habit->id,
        'completed' => true,
    ]);

    $this->assertDatabaseHas('habit_logs', [
        'habit_id' => $habit->id,
        'date' => today()->toDateString(),
        'completed' => true,
    ]);
});

test('updates existing log if already exists for today', function () {
    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create();

    $existingLog = HabitLog::factory()->for($habit)->create([
        'date' => today(),
        'completed' => false,
    ]);

    $response = $this
        ->actingAs($user)
        ->postJson("/api/habits/{$habit->id}/complete");

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'id' => $existingLog->id,
        'completed' => true,
    ]);

    $this->assertDatabaseHas('habit_logs', [
        'id' => $existingLog->id,
        'completed' => true,
    ]);

    expect(HabitLog::where('habit_id', $habit->id)->count())->toBe(1);
});

test('creates new log if none exists for today', function () {
    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create();

    HabitLog::factory()->for($habit)->create([
        'date' => today()->subDay(),
        'completed' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->postJson("/api/habits/{$habit->id}/complete");

    $response->assertSuccessful();

    expect(HabitLog::where('habit_id', $habit->id)->count())->toBe(2);

    $this->assertDatabaseHas('habit_logs', [
        'habit_id' => $habit->id,
        'date' => today()->toDateString(),
        'completed' => true,
    ]);
});

test('cannot complete other users habits', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherHabit = Habit::factory()->for($otherUser)->create();

    $response = $this
        ->actingAs($user)
        ->postJson("/api/habits/{$otherHabit->id}/complete");

    $response->assertNotFound();

    $this->assertDatabaseMissing('habit_logs', [
        'habit_id' => $otherHabit->id,
        'date' => today()->toDateString(),
    ]);
});

test('requires authentication to complete habit', function () {
    $habit = Habit::factory()->create();

    $response = $this->postJson("/api/habits/{$habit->id}/complete");

    $response->assertUnauthorized();
});
