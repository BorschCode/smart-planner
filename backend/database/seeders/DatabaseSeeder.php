<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        if (! $user->avatar()->exists()) {
            $this->createAvatarForUser($user);
        }

        $this->call([
            HabitSeeder::class,
            HabitLogSeeder::class,
        ]);
    }

    private function createAvatarForUser(User $user): void
    {
        $disk = 'public';
        $filename = Str::random(10).'.png';
        $path = 'avatars/'.$filename;

        $response = Http::timeout(5)->get(
            'https://ui-avatars.com/api/',
            [
                'name' => $user->name,
                'size' => 256,
                'background' => '6366f1',
                'color' => 'ffffff',
                'format' => 'png',
            ]
        );

        if (! $response->successful()) {
            // ❗ Якщо аватар не отримали — просто виходимо
            return;
        }

        Storage::disk($disk)->put($path, $response->body());

        $user->avatar()->create([
            'collection' => 'avatar',
            'disk' => $disk,
            'path' => $path,
            'mime_type' => 'image/png',
            'size' => Storage::disk($disk)->size($path),
        ]);
    }
}
