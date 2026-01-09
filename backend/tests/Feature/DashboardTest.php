<?php

use App\Models\User;

// Skip this test - this application uses API-based architecture with a separate frontend
// Traditional Laravel dashboard route is not implemented

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
})->skip('Dashboard route not implemented in API-based architecture');
