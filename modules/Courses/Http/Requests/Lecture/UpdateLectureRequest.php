<?php

namespace modules\Courses\Http\Requests\Lecture;

use Illuminate\Foundation\Http\FormRequest;
use modules\Courses\Entities\Lecture;

class UpdateLectureRequest extends FormRequest {
    protected $lecture;
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        // default php maximum file upload size
        $maxFileSize = str_replace('M', '', ini_get('upload_max_filesize')) * 1024;

        return [
            'course_id' => 'required|numeric',
            'title' => 'required|max:255',
            'slug' => 'required|string|max:255|unique:lectures,slug,' . $this->lecture->id,
            'description' => 'required|string|max:5000',
            'order_number' => 'required|numeric',
            'media_file.file' => 'sometimes|file|mimes:mp4,mov,avi,wmv|max:' . $maxFileSize,
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize() {
        $slug = $this->route('lecture');
        $this->lecture = Lecture::select(['lectures.id'])->owned()->where("lectures.slug", $slug)->withTrashed()->first();
        return true;
    }
}
