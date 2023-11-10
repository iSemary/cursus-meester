<?php

namespace App\Http\Requests\Industry;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIndustryRequest extends FormRequest {
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
            'title' => 'required|max:255|unique:industries,title,' . $this->industry->id . ',id',
            'slug' => 'required|max:255|unique:industries,slug,' . $this->industry->id . ',id',
            'description' => 'required|max:1024'
        ];
    }
}
