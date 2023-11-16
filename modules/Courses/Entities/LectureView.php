<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LectureView extends Model {
    use HasFactory;

    protected $fillable = ['lecture_id', 'user_id', 'view_time', 'finished'];
}
