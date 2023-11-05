<?php

namespace App\Http\Requests\Utilities\Country;

use Illuminate\Foundation\Http\FormRequest;

class CreateCountryRequest extends FormRequest {
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
            'iso' => 'required|unique:countries.iso',
            'name' => 'required|unique:countries.name',
            'iso3' => 'required|unique:countries.iso3',
            'num_code' => 'required|unique:countries.num_code',
            'phone_code' => 'required|unique:countries.phone_code',
            'continent_code' => 'required|unique:countries.continent_code',
            'status' => 'required',
        ];
    }
}
