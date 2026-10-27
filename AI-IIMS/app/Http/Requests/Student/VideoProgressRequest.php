<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class VideoProgressRequest extends FormRequest
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
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'lesson_id' => ['required', 'integer', 'exists:lessons,id'],
            'media_id' => ['nullable', 'integer', 'exists:lesson_media,id'],
            'position_seconds' => ['required', 'integer', 'min:0'],
            'completed' => ['nullable', 'boolean'],
        ];
    }
}
