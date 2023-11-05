<?php

namespace App\Http\Requests\Utilities\Currency;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCurrencyRequest extends FormRequest {
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
            'name' => 'required|unique:currencies,name|max:255,' . $this->currency->id . ',id',
            'value' => 'required|unique:currencies,value|max:4,' . $this->currency->id . ',id',
            'country_id' => 'required|numeric|unique:currencies,country_id,' . $this->currency->id . ',id',
        ];
    }
}
