<?php

use App\Models\Habit;
use App\Models\User;

test('can list habits for authenticated user', function () {
    $user = User::factory()->create();
    $habits = Habit::factory()->count(3)->for($user)->create();

    $response = $this
        ->actingAs($user)
        ->getJson('/api/habits');

    $response->assertSuccessful();
    $response->assertJsonCount(3, 'data');
    $response->assertJsonFragment(['title' => $habits->first()->title]);
});

test('can create habit for authenticated user', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/api/habits', [
            'title' => 'Exercise daily',
            'description' => 'Go for a 30 minute run',
            'type' => 'habit',
            'frequency' => 'daily',
            'is_active' => true,
        ]);

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'title' => 'Exercise daily',
        'type' => 'habit',
    ]);

    $this->assertDatabaseHas('habits', [
        'title' => 'Exercise daily',
        'user_id' => $user->id,
    ]);
});

test('can show single habit', function () {
    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create();

    $response = $this
        ->actingAs($user)
        ->getJson("/api/habits/{$habit->id}");

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'id' => $habit->id,
        'title' => $habit->title,
    ]);
});

test('can update habit', function () {
    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create([
        'title' => 'Old Title',
    ]);

    $response = $this
        ->actingAs($user)
        ->putJson("/api/habits/{$habit->id}", [
            'title' => 'New Title',
        ]);

    $response->assertSuccessful();
    $response->assertJsonFragment(['title' => 'New Title']);

    $this->assertDatabaseHas('habits', [
        'id' => $habit->id,
        'title' => 'New Title',
    ]);
});

test('can delete habit', function () {
    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create();

    $response = $this
        ->actingAs($user)
        ->deleteJson("/api/habits/{$habit->id}");

    $response->assertNoContent();

    $this->assertDatabaseMissing('habits', [
        'id' => $habit->id,
    ]);
});

test('cannot access other users habits', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherHabit = Habit::factory()->for($otherUser)->create();

    $response = $this
        ->actingAs($user)
        ->getJson("/api/habits/{$otherHabit->id}");

    $response->assertNotFound();
});

test('requires authentication for all endpoints', function () {
    $habit = Habit::factory()->create();

    $this->getJson('/api/habits')->assertUnauthorized();
    $this->postJson('/api/habits')->assertUnauthorized();
    $this->getJson("/api/habits/{$habit->id}")->assertUnauthorized();
    $this->putJson("/api/habits/{$habit->id}")->assertUnauthorized();
    $this->deleteJson("/api/habits/{$habit->id}")->assertUnauthorized();
});

test('validates habit creation with invalid data', function ($field, $value, $error) {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/api/habits', [
            'title' => 'Valid Title',
            'type' => 'habit',
            'frequency' => 'daily',
            $field => $value,
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors($field);
})->with([
    'title required' => ['title', null, 'required'],
    'title max length' => ['title', str_repeat('a', 256), 'max'],
    'type required' => ['type', null, 'required'],
    'type invalid' => ['type', 'invalid', 'in'],
    'frequency required' => ['frequency', null, 'required'],
    'frequency invalid' => ['frequency', 'invalid', 'in'],
    'description max length' => ['description', str_repeat('a', 1001), 'max'],
]);

test('validates habit update with invalid data', function ($field, $value) {
    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create();

    $response = $this
        ->actingAs($user)
        ->putJson("/api/habits/{$habit->id}", [
            $field => $value,
        ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors($field);
})->with([
    'title max length' => ['title', str_repeat('a', 256)],
    'type invalid' => ['type', 'invalid'],
    'frequency invalid' => ['frequency', 'invalid'],
    'description max length' => ['description', str_repeat('a', 1001)],
]);
