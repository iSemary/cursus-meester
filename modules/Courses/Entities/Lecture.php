<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lecture extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['course_id', 'title', 'slug', 'description', 'file_name', 'order_number'];

    public function course() {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
