<?php

namespace modules\Instructors\Entities;

use App\Models\Utilities\Industry;
use App\Models\Utilities\ProfileSocialLink;
use App\Services\Uploader\FileHandler;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use modules\Courses\Entities\Course;
use modules\Courses\Entities\Rate;
use modules\Organizations\Entities\Organization;
use modules\Payments\Entities\EnrolledCourse;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InstructorProfile extends Model {
    use SoftDeletes, LogsActivity;
    protected $filePath = "users/avatar/";

    protected $fillable = ['user_id', 'bio', 'position', 'avatar', 'organization_id', 'industry_id'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }

    protected $appends = ['total_courses', 'total_students', 'overall_rate'];

    public function organization() {
        return $this->belongsTo(Organization::class);
    }

    public function industry() {
        return $this->belongsTo(Industry::class);
    }

    public function courses() {
        return $this->hasMany(Course::class, "user_id", "user_id");
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

    public function getTotalCoursesAttribute() {
        return $this->courses()->count();
    }

    public function getTotalStudentsAttribute() {
        $coursesIds = $this->courses()->pluck("id");
        return EnrolledCourse::whereIn("course_id", $coursesIds)->count();
    }

    public function getOverallRateAttribute() {
        $coursesIds = $this->courses()->pluck("id");
        $overallRate = Rate::whereIn("course_id", $coursesIds)->average("rate");
        return round($overallRate, 2);
    }

    public static function getPublicInfo(int $userId) {
        $data = [];
        $data = self::leftJoin('users', 'users.id', 'instructor_profiles.user_id')->select(['user_id', 'position', 'bio', 'avatar', 'industry_id', 'organization_id', 'users.full_name', 'users.username'])
            ->with(["organization" => function ($query) {
                $query->select(['id', 'name', 'slug', 'logo']);
            }])
            ->with(["industry" => function ($query) {
                $query->select(['id', 'title', 'slug']);
            }])
            ->where("user_id", $userId)->first();

        return $data;
    }

    public static function getSocialLinks(int $userId) {
        return (object) ProfileSocialLink::select(['link_type', 'link_url'])->where("user_id", $userId)->get();
    }

    public static function getCourses(int $userId) {
        return self::where('user_id', $userId)->first()->courses()->selectPreview()->get();
    }

    public static function getCoursesCounter(int $userId) {
        $courses = self::where('user_id', $userId)->first()->courses()
            ->select('courses.id', 'courses.title', 'courses.slug', 'courses.offer_price', 'courses.offer_percentage', 'price')
            ->get();
        return $courses;
    }

    public static function getTopInTypeId(string $type, int $typeId, int $limit = 5) {
        $topInstructorsIds = DB::table('courses')
            ->join('rates', 'rates.course_id', 'courses.id')
            ->where($type, $typeId)
            ->select('courses.user_id')
            ->selectRaw('MAX(rates.rate) AS max_rate')
            ->groupBy('courses.user_id')
            ->orderBy("max_rate", "DESC")
            ->limit($limit)
            ->pluck('courses.user_id');

        $topInstructors = self::leftJoin('users', 'users.id', 'instructor_profiles.user_id')
            ->select(['user_id', 'position', 'avatar', 'industry_id', 'organization_id', 'users.full_name', 'users.username'])
            ->whereIn("user_id", $topInstructorsIds)
            ->with(["organization" => function ($query) {
                $query->select(['id', 'name', 'slug', 'logo']);
            }])
            ->with(["industry" => function ($query) {
                $query->select(['id', 'title', 'slug']);
            }])->get();

        return $topInstructors;
    }
    
    public static function getTop(int $limit = 5) {
        $topInstructorsIds = DB::table('courses')
            ->join('rates', 'rates.course_id', 'courses.id')
            ->select('courses.user_id')
            ->selectRaw('MAX(rates.rate) AS max_rate')
            ->groupBy('courses.user_id')
            ->orderBy("max_rate", "DESC")
            ->limit($limit)
            ->pluck('courses.user_id');

        $topInstructors = self::leftJoin('users', 'users.id', 'instructor_profiles.user_id')
            ->select(['user_id', 'position', 'avatar', 'industry_id', 'organization_id', 'users.full_name', 'users.username'])
            ->whereIn("user_id", $topInstructorsIds)
            ->with(["organization" => function ($query) {
                $query->select(['id', 'name', 'slug', 'logo']);
            }])
            ->with(["industry" => function ($query) {
                $query->select(['id', 'title', 'slug']);
            }])->get();

        return $topInstructors;
    }
}
