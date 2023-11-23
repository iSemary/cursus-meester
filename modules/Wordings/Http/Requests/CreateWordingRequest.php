<?php

namespace modules\Wordings\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateWordingRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'wording_key' => 'required|unique:wordings,wording_key',
            'wording_value' => 'required|unique:wordings,wording_value',
            'wording_language_id' => 'required|exists:languages,id',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize() {
        return true;
    }
}
