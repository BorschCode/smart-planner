<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

describe('API Token Authentication', function () {
    describe('Token Login', function () {
        it('allows users to login with valid credentials and returns token', function () {
            $user = User::factory()->create([
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
            ]);

            $response = $this->postJson('/api/token/login', [
                'email' => 'test@example.com',
                'password' => 'password123',
            ]);

            $response->assertOk()
                ->assertJsonStructure([
                    'token',
                    'user' => [
                        'id',
                        'name',
                        'email',
                    ],
                ])
                ->assertJson([
                    'user' => [
                        'email' => 'test@example.com',
                    ],
                ]);

            expect($response->json('token'))->toBeString();
        });

        it('rejects login with invalid credentials', function () {
            User::factory()->create([
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
            ]);

            $response = $this->postJson('/api/token/login', [
                'email' => 'test@example.com',
                'password' => 'wrongpassword',
            ]);

            $response->assertUnauthorized()
                ->assertJson([
                    'error' => 'Invalid',
                ]);
        });

        it('rejects login with non-existent email', function () {
            $response = $this->postJson('/api/token/login', [
                'email' => 'nonexistent@example.com',
                'password' => 'password123',
            ]);

            $response->assertUnauthorized()
                ->assertJson([
                    'error' => 'Invalid',
                ]);
        });

        it('requires email field', function () {
            $response = $this->postJson('/api/token/login', [
                'password' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);
        });

        it('requires password field', function () {
            $response = $this->postJson('/api/token/login', [
                'email' => 'test@example.com',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['password']);
        });

        it('requires valid email format', function () {
            $response = $this->postJson('/api/token/login', [
                'email' => 'invalid-email',
                'password' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);
        });

        it('generates token with correct name', function () {
            $user = User::factory()->create([
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
            ]);

            $this->postJson('/api/token/login', [
                'email' => 'test@example.com',
                'password' => 'password123',
            ]);

            expect($user->tokens()->count())->toBe(1);
            expect($user->tokens->first()->name)->toBe('mobile');
        });

        it('can use returned token for authenticated requests', function () {
            $user = User::factory()->create([
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
            ]);

            $response = $this->postJson('/api/token/login', [
                'email' => 'test@example.com',
                'password' => 'password123',
            ]);

            $token = $response->json('token');

            $authenticatedResponse = $this->withHeader('Authorization', "Bearer {$token}")
                ->getJson('/api/user');

            $authenticatedResponse->assertOk()
                ->assertJson([
                    'email' => 'test@example.com',
                ]);
        });

        it('allows multiple logins creating multiple tokens', function () {
            $user = User::factory()->create([
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
            ]);

            $this->postJson('/api/token/login', [
                'email' => 'test@example.com',
                'password' => 'password123',
            ]);

            $this->postJson('/api/token/login', [
                'email' => 'test@example.com',
                'password' => 'password123',
            ]);

            expect($user->tokens()->count())->toBe(2);
        });
    });
});
