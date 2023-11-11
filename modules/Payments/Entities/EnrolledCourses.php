<?php

namespace modules\Payments\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class EnrolledCourses extends Model {
    use HasFactory, LogsActivity;

    protected $fillable = ['course_id', 'user_id'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }
}
