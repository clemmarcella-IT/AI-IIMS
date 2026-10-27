<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CuePointRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'timestamp_seconds' => ['required', 'integer', 'min:0'],
            'type' => ['required', Rule::in(['quiz_mcq', 'quiz_open', 'pause_reflect', 'info'])],
            'question' => ['nullable', 'string'],
            'options' => ['nullable', 'array'],
            'options.*' => ['nullable', 'string', 'max:255'],
            'correct_option' => ['nullable', 'string', 'max:255'],
            'explanation' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
        ];
    }
}
