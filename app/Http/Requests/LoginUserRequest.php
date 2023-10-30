<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginUserRequest extends FormRequest {
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
            'email' => 'required|max:255|exists:users,email',
            'password' => 'required|max:255|min:8',
        ];
    }
}
