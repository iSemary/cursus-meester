<?php

namespace modules\Courses\Http\Requests\Rate;

use Illuminate\Foundation\Http\FormRequest;

class CreateRateRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'rate' => 'required|numeric|in:1,2,3,4,5',
            'comment' => 'sometimes|max:1024',
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
