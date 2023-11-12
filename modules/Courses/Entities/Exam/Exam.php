<?php

namespace modules\Courses\Entities\Exam;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Exam extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['lecture_id', 'title', 'description', 'lecture_id', 'status'];
}
