<?php

namespace App\Http\Requests\OTP;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class VerifyRequest extends FormRequest {
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
            'otp' => 'required|min:3|exists:user_otps,otp'
        ];
    }
}
