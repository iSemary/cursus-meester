<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JoinInstructorRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array {
        return [
            'position' => 'required|max:255',
            'industry_id' => 'required|numeric|exists:industries,id',
            'organization_id' => 'sometimes|numeric|exists:organizations,id',
        ];
    }
}
