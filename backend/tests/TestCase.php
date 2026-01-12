<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Safety check: Prevent tests from running on non-SQLite databases
        $connection = config('database.default');
        $database = config("database.connections.{$connection}.database");

        if ($connection !== 'sqlite' || $database !== ':memory:') {
            $this->fail(
                "Tests must use SQLite in-memory database for safety. " .
                "Current connection: {$connection}, database: {$database}. " .
                "Please run 'php artisan config:clear' and try again."
            );
        }
    }
}
