<?php

namespace modules\Chats\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InitiateConversationRequest extends FormRequest {

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
            'receiver_username' => 'required|max:255|exists:users,username',
        ];
    }
}
