<?php

namespace modules\Courses\Entities\Exam;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExamResult extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['exam_id', 'exam_question_id', 'user_id', 'answer_id', 'answer_text'];
}
