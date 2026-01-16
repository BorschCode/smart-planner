<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

describe('Password update (Fortify)', function () {

    it('allows the user to update their password', function () {
        $user = User::factory()->create([
            'password' => Hash::make('old-password'),
        ]);

        $response = $this
            ->actingAs($user)
            ->putJson(route('user-password.update'), [
                'current_password' => 'old-password',
                'password' => 'new-password-123',
                'password_confirmation' => 'new-password-123',
            ]);

        $response->assertOk();

        expect(
            Hash::check('new-password-123', $user->refresh()->password)
        )->toBeTrue();
    });

    it('rejects update if current password is incorrect', function () {
        $user = User::factory()->create([
            'password' => Hash::make('old-password'),
        ]);

        $response = $this
            ->actingAs($user)
            ->putJson(route('user-password.update'), [
                'current_password' => 'wrong-password',
                'password' => 'new-password-123',
                'password_confirmation' => 'new-password-123',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);

        expect(
            Hash::check('old-password', $user->refresh()->password)
        )->toBeTrue();
    });

    it('requires password confirmation', function () {
        $user = User::factory()->create([
            'password' => Hash::make('old-password'),
        ]);

        $response = $this
            ->actingAs($user)
            ->putJson(route('user-password.update'), [
                'current_password' => 'old-password',
                'password' => 'new-password-123',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    });
});
