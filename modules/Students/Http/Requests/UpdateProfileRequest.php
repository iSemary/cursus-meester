<?php

namespace modules\Students\Http\Requests;

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
            'full_name' => 'required|max:164',
            'email' => 'required|max:255|unique:users,email,', $this->user->id,
            'phone' => 'required|numeric|unique:users,phone', $this->user->id,
            'country_id' => 'required|numeric',
            'language_id' => 'required|numeric',
            'country_dial_code' => 'required|max:15',
            'position' => 'sometimes|max:255',
            'bio' => 'sometimes|max:5000',
            'image' => 'sometimes|mimes:png,jpg,jpeg,gif'
        ];
    }
}
