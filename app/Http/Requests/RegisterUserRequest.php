<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest {
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
            'email' => 'required|max:255|unique:users,email|email:dns',
            'password' => 'required|confirmed|max:255|min:8',
            'phone' => 'required|numeric|unique:users,phone',
            'country_id' => 'required|numeric',
        ];
    }
}
