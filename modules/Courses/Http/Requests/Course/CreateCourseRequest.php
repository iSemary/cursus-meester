<?php

namespace modules\Courses\Http\Requests\Course;

use Illuminate\Foundation\Http\FormRequest;

class CreateCourseRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:courses,slug',
            'description' => 'required|string|max:5000',
            'content' => 'required|string',
            'thumbnail' => 'sometimes|image|mimes:jpeg,png|max:2048',
            'skill_level' => 'required|in:1,2,3',
            'category_id' => 'required|exists:categories,id',
            'organization_id' => 'nullable',
            'language_id' => 'required|exists:languages,id',
            'currency_id' => 'sometimes|exists:currencies,id',
            'price' => 'required|numeric|min:0',
            'offer_price' => 'nullable|in:true,false',
            'has_certificate' => 'nullable|in:true,false,0,1',
            'offer_percentage' => 'sometimes|numeric|between:0,100',
            'offer_expired_at' => 'sometimes|date',
            'published_at' => 'sometimes|date',
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
