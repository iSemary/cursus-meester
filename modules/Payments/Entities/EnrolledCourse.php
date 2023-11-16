<?php

namespace modules\Payments\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class EnrolledCourse extends Model {
    use HasFactory, LogsActivity;

    protected $fillable = ['course_id', 'user_id', 'finished_at'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }
}
