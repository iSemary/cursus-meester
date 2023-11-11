<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class LectureFile extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['lecture_id', 'original_name', 'name'];

    public function lecture() {
        return $this->belongsTo(Lecture::class, 'lecture_id');
    }
}
