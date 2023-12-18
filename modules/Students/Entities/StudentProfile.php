<?php

namespace modules\Students\Entities;

use App\Models\Utilities\ProfileSocialLink;
use App\Services\Uploader\FileHandler;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use modules\Courses\Entities\Course;
use modules\Payments\Entities\EnrolledCourse;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class StudentProfile extends Model {
    use SoftDeletes, LogsActivity;

    protected $filePath = "users/avatar";
    protected $fillable = ['user_id', 'bio', 'position', 'avatar'];

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

    public static function getPublicInfo(int $userId) {
        $data = [];
        $data = self::leftJoin('users', 'users.id', 'student_profiles.user_id')
            ->select(['user_id', 'position', 'bio', 'avatar', 'users.full_name', 'users.username', 'users.username'])
            ->where("user_id", $userId)->first();

        return $data;
    }

    public static function getSocialLinks(int $userId) {
        return (object) ProfileSocialLink::select(['link_type', 'link_url'])->where("user_id", $userId)->get();
    }

    public static function getCourses(int $userId) {
        $enrolledCoursesIds = EnrolledCourse::whereUserId($userId)->orderByDesc("id")->pluck("course_id");
        $courses = Course::selectPreview()
            ->whereIn("id", $enrolledCoursesIds)
            ->with(["instructor" => function ($query) {
                $query->select(['id', 'full_name', 'username']);
            }])
            ->get();
        return $courses;
    }
}
