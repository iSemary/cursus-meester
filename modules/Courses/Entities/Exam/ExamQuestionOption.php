<?php

namespace modules\Courses\Entities\Exam;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExamQuestionOption extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['exam_question_id', 'title', 'order_number', 'valid_answer'];
}
