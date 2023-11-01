<?php

namespace modules\Students\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentProfile extends Model {
    use SoftDeletes, LogsActivity;

    protected $fillable = ['user_id', 'bio', 'position', 'image'];
    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }
}
