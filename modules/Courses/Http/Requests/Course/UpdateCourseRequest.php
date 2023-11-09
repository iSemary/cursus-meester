<?php

namespace modules\Courses\Http\Requests\Course;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest {

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:courses,slug,' . $this->course->slug,
            'description' => 'sometimes|string|max:5000',
            'content' => 'sometimes|string',
            'thumbnail' => 'sometimes|image|mimes:jpeg,png|max:2048',
            'skill_level' => 'sometimes|in:1,2,3',
            'category_id' => 'sometimes|exists:categories,id',
            'organization_id' => 'sometimes|exists:organizations,id',
            'language_id' => 'sometimes|exists:languages,id',
            'currency_id' => 'sometimes|exists:currencies,id',
            'price' => 'sometimes|numeric|min:0',
            'offer_price' => 'sometimes|numeric|min:0',
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
