<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certificate extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'file_name',
        'config',
    ];

    protected $casts = [
        'config' => 'json',
    ];

    public function course() {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
