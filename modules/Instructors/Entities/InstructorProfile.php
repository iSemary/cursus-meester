<?php

namespace modules\Instructors\Entities;

use App\Services\Uploader\FileHandler;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InstructorProfile extends Model {
    use SoftDeletes, LogsActivity;
    protected $filePath = "users/avatar/"; // for AvatarAttribute

    protected $fillable = ['user_id', 'bio', 'position', 'avatar', 'organization_id', 'industry_id'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }

    public function setAvatarAttribute($value) {
        $avatar = $this->avatar;
        if ($value) {
            // Remove old image if exists
            if ($this->avatar) {
                FileHandler::delete([$this->filePath . $this->avatar, $this->filePath . 'thumbnails/' . $this->avatar]);
            }
            // store uploaded image
            $avatar = FileHandler::image($value, $this->filePath, true);
            $this->attributes['avatar'] = basename($avatar);
        }
    }

    public function getAvatarAttribute($value): string {
        if ($value) {
            return asset('storage/' . $this->filePath . '/' . $value);
        } else {
            return asset('storage/' . $this->filePath . '/' . 'default.png');
        }
    }
}
