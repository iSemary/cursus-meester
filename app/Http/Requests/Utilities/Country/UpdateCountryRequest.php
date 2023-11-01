<?php

namespace App\Http\Requests\Utilities\Country;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCountryRequest extends FormRequest {
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
            'iso' => 'required|unique:countries.iso' . $this->country->id . ',id',
            'name' => 'required|unique:countries.name' . $this->country->id . ',id',
            'iso3' => 'required|unique:countries.iso3' . $this->country->id . ',id',
            'num_code' => 'required|unique:countries.num_code' . $this->country->id . ',id',
            'phone_code' => 'required|unique:countries.phone_code' . $this->country->id . ',id',
            'continent_code' => 'required|unique:countries.continent_code' . $this->country->id . ',id',
            'status' => 'required',
        ];
    }
}
