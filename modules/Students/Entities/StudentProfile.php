<?php

namespace modules\Students\Entities;

use App\Traits\AvatarAttribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentProfile extends Model {
    use SoftDeletes, LogsActivity, AvatarAttribute;

    protected $filePath = "users/avatar";
    protected $fillable = ['user_id', 'bio', 'position', 'avatar'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }
}
