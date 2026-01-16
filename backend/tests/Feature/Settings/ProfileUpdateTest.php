<?php

use App\Models\User;

describe('Profile update (Fortify)', function () {

    it('updates profile information', function () {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this
            ->actingAs($user)
            ->putJson(route('user-profile-information.update'), [
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
            ]);

        $response->assertOk();

        $user->refresh();

        expect($user->name)->toBe('Updated Name');
        expect($user->email)->toBe('updated@example.com');
        expect($user->email_verified_at)->toBeNull(); // email changed → unverified
    });

    it('does not reset email verification when email is unchanged', function () {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this
            ->actingAs($user)
            ->putJson(route('user-profile-information.update'), [
                'name' => 'Same Email Name',
                'email' => $user->email,
            ]);

        $response->assertOk();

        expect($user->refresh()->email_verified_at)->not->toBeNull();
    });

    it('requires a valid email', function () {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->putJson(route('user-profile-information.update'), [
                'name' => 'Invalid Email',
                'email' => 'not-an-email',
            ]);

        $response
            ->assertStatus(\Symfony\Component\HttpFoundation\Response::HTTP_UNPROCESSABLE_ENTITY)
            ->assertJsonValidationErrors(['email']);
    });
});
