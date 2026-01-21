<?php

namespace App\Http\Requests\Habits;

use App\Enums\HabitFrequency;
use App\Enums\HabitType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class IndexHabitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'active' => ['nullable', 'boolean'],
            'type' => ['nullable', new Enum(HabitType::class)],
            'frequency' => ['nullable', new Enum(HabitFrequency::class)],
        ];
    }

    public function filters(): array
    {
        return [
            'active' => $this->has('active')
                ? (bool) $this->boolean('active')
                : null,

            'type' => $this->filled('type')
                ? HabitType::from($this->string('type'))
                : null,

            'frequency' => $this->filled('frequency')
                ? HabitFrequency::from($this->string('frequency'))
                : null,
        ];
    }

}

