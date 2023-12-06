<?php

namespace modules\Courses\Entities\Exam;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Exam extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['title', 'description', 'lecture_id', 'status'];

    public function scopeOwned($query) {
        return $query->leftJoin('courses', 'courses.id', 'lectures.course_id')->where("courses.user_id", auth()->guard('api')->id());
    }

    protected $appends = ['total_questions'];

    public function getTotalQuestionsAttribute() {
        return ExamQuestion::where("exam_id", $this->attributes['id'])->count();
    }
}
