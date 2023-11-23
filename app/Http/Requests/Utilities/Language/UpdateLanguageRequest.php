<?php

namespace App\Http\Requests\Utilities\Language;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLanguageRequest extends FormRequest {
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
            'name' => 'required|unique:languages,name,' . $this->language->id . ',id',
            'key' => 'required|unique:languages,key,' . $this->language->id . ',id',
        ];
    }
}
