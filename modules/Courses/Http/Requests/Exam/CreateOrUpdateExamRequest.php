<?php

namespace modules\Courses\Http\Requests\Exam;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrUpdateExamRequest extends FormRequest {
    protected $course;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {

        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'status' => 'required',
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
