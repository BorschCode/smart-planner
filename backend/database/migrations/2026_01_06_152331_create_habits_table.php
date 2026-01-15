<?php

use App\Enums\HabitFrequency;
use App\Enums\HabitType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('title');
            $table->text('description')->nullable();

            $table->string('type', 20)->default(HabitType::HABIT->value);
            $table->string('frequency', 20)->default(HabitFrequency::DAILY->value);

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'type', 'frequency']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};
