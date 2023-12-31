<?php

namespace modules\Categories\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCategoryRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'title' => 'required|max:255|unique:categories,title',
            'slug' => 'required|max:255|unique:categories,slug',
            'parent_id' => 'sometimes|numeric',
            'order_number' => 'sometimes|numeric',
            'status' => 'required|numeric',
            'icon' => 'mimes:png,jpg,jpeg,gif'
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
