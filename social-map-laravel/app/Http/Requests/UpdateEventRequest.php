<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'preview_image' => 'nullable|file|max:2048',
            'title' => 'required|string|max:255',
            'location' => 'nullable|array',
            'location.*.road' => 'nullable|string',
            'location.*.house_number' => 'nullable|string',
            'location.*.locality' => 'nullable|string',
            'location.*.state' => 'nullable|string',
            'location.*.country' => 'nullable|string',
            'location.*.display_name' => 'nullable|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'categories' => 'nullable|array|max:2',
            'categories.*' => 'integer|exists:categories,id',
            'start_time' => 'required|date|after_or_equal:today',
            'end_time' => 'required|date|after_or_equal:start_time',
        ];
    }
}
