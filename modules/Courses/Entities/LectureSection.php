<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class LectureSection extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['course_id', 'title'];
}
