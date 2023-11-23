<?php

namespace modules\Wordings\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWordingRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'wording_key' => 'required|unique:wordings,wording_key,' . $this->wording->id . ',id',
            'wording_value' => 'required|unique:wordings,wording_value,' . $this->wording->id . ',id',
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
