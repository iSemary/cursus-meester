<?php

namespace modules\Categories\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use modules\Categories\Entities\Category;

class UpdateCategoryRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'title' => 'required|max:255|unique:categories,title,' . $this->category->id . ',id',
            'slug' => 'required|max:255|unique:categories,slug,' . $this->category->id . ',id',
            'order_number' => 'sometimes|numeric',
            'status' => 'required|numeric',
            'icon' => 'sometimes|mimes:png,jpg,jpeg,gif'
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
