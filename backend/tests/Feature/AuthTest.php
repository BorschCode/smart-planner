<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

describe('Authentication', function () {
    describe('Login', function () {
        it('allows users to login with valid credentials', function () {
            $user = User::factory()->create([
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
            ]);

            $response = $this->postJson(loginEndpoint(), [
                'email' => 'test@example.com',
                'password' => 'password123',
            ]);

            $response->assertOk()
                ->assertJson([
                    'message' => 'Login successful',
                    'user' => [
                        'email' => 'test@example.com',
                    ],
                ]);

            $response->assertJsonStructure([
                'token',
                'user' => ['id', 'email'],
            ]);
        });

        it('rejects login with invalid email', function () {
            User::factory()->create([
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
            ]);

            $response = $this->postJson(loginEndpoint(), [
                'email' => 'wrong@example.com',
                'password' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);

            $this->assertGuest();
        });

        it('rejects login with invalid password', function () {
            User::factory()->create([
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
            ]);

            $response = $this->postJson(loginEndpoint(), [
                'email' => 'test@example.com',
                'password' => 'wrongpassword',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);

            $this->assertGuest();
        });

        it('requires email field', function () {
            $response = $this->postJson(loginEndpoint(), [
                'password' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);

        });

        it('requires password field', function () {
            $response = $this->postJson(loginEndpoint(), [
                'email' => 'test@example.com',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['password']);
        });

        it('requires valid email format', function () {
            $response = $this->postJson(loginEndpoint(), [
                'email' => 'invalid-email',
                'password' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);
        });

        it('regenerates session on successful login', function () {
            $user = User::factory()->create([
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
            ]);

            $oldSessionId = session()->getId();

            $this->postJson('/login', [
                'email' => 'test@example.com',
                'password' => 'password123',
            ]);

            expect(session()->getId())->not->toBe($oldSessionId);
        });
    });

    describe('Registration', function () {
        it('allows new users to register', function () {
            $response = $this->postJson('/api/register', [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertCreated()
                ->assertJson([
                    'message' => 'Registration successful',
                    'user' => [
                        'name' => 'Test User',
                        'email' => 'test@example.com',
                    ],
                ]);

            $this->assertDatabaseHas('users', [
                'email' => 'test@example.com',
                'name' => 'Test User',
            ]);

            //            $this->assertAuthenticated();
        });

        it('requires name field', function () {
            $response = $this->postJson(registerEndpoint(), [
                'email' => 'test@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['name']);
        });

        it('requires email field', function () {
            $response = $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);
        });

        it('requires valid email format', function () {
            $response = $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'email' => 'invalid-email',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);
        });

        it('requires unique email', function () {
            User::factory()->create(['email' => 'test@example.com']);

            $response = $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['email']);
        });

        it('requires password field', function () {
            $response = $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['password']);
        });

        it('requires password to be at least 8 characters', function () {
            $response = $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'short',
                'password_confirmation' => 'short',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['password']);
        });

        it('requires password confirmation', function () {
            $response = $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['password']);
        });

        it('requires password confirmation to match', function () {
            $response = $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123',
                'password_confirmation' => 'different',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['password']);
        });

        it('hashes the password', function () {
            $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $user = User::where('email', 'test@example.com')->first();

            expect($user->password)->not->toBe('password123');
            expect(Hash::check('password123', $user->password))->toBeTrue();
        });

        it('logs in the user after registration', function () {
            $response = $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $this->assertAuthenticated();
        });

        it('regenerates session on successful registration', function () {
            $oldSessionId = session()->getId();

            $this->postJson(registerEndpoint(), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            expect(session()->getId())->not->toBe($oldSessionId);
        });
    });

    describe('Logout', function () {
        it('allows authenticated users to logout', function () {
            $user = User::factory()->create();
            $this->actingAs($user);

            $response = $this->postJson(logoutEndpoint());

            $response->assertNoContent();

            $this->assertGuest();
        });

        it('invalidates the session', function () {
            $user = User::factory()->create();
            $this->actingAs($user);

            $oldSessionId = session()->getId();

            $this->postJson(logoutEndpoint());

            expect(session()->getId())->not->toBe($oldSessionId);
        });
    });
});
