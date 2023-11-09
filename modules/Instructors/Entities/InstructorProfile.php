<?php

namespace modules\Instructors\Entities;

use App\Traits\AvatarAttribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InstructorProfile extends Model {
    use SoftDeletes, LogsActivity, AvatarAttribute;
    protected $filePath = "users/avatar/"; // for AvatarAttribute

    protected $fillable = ['user_id', 'bio', 'position', 'avatar', 'organization_id', 'industry_id'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }
}
