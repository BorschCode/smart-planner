<?php

namespace App\Http\Requests\Habits;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHabitRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'type' => ['sometimes', 'required', Rule::in(['task', 'habit'])],
            'frequency' => ['sometimes', 'required', Rule::in(['daily', 'weekly'])],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
