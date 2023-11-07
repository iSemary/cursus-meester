<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rate extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['course_id', 'user_id', 'rate', 'comment'];

    public function course() {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
