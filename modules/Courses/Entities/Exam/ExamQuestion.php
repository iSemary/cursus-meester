<?php

namespace modules\Courses\Entities\Exam;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExamQuestion extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['exam_id', 'title', 'type'];
}
