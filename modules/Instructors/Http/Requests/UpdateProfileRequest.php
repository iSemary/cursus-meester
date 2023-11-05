<?php

namespace modules\Instructors\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest {
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
            'position' => 'sometimes|max:255',
            'bio' => 'sometimes|max:5000',
            'image' => 'sometimes|mimes:png,jpg,jpeg,gif',
            'organization_id' => 'sometimes|numeric',
            'industry_id' => 'sometimes|numeric',
        ];
    }
}
