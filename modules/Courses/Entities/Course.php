<?php

namespace modules\Courses\Entities;

use App\Enums\CourseStatuses;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Models\Utilities\Currency;
use App\Models\Utilities\Language;
use App\Services\Uploader\FileHandler;
use Carbon\Carbon;
use modules\Categories\Entities\Category;
use modules\Organizations\Entities\Organization;
use modules\Payments\Entities\Cart;
use modules\Payments\Entities\EnrolledCourse;

class Course extends Model {
    use HasFactory, SoftDeletes;
    const SHORT_COURSES_DURATION = 7 * 60 * 60; // 7 Hours in seconds

    protected $filePath = "courses/thumbnails";

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'thumbnail',
        'skill_level',
        'category_id',
        'user_id',
        'organization_id',
        'language_id',
        'currency_id',
        'price',
        'offer_price',
        'offer_percentage',
        'offer_expired_at',
        'has_certificate',
        'status',
        'published_at',
    ];

    protected $dates = ['offer_expired_at', 'published_at'];

    protected $casts = ['offer_price' => 'boolean'];

    protected $hidden = [
        "deleted_at",
        "created_at",
    ];

    protected $appends = [
        'duration',
        'status',
        'currency',
        'total_students',
        'total_lectures',
        'final_price',
        'rates',
        'actions',
        'updated_at_diff',
    ];

    public function getActionsAttribute() {
        $user = auth()->guard('api')->user();
        if (!$user) {
            return [
                'cart' => false,
                'wishlist' => false,
                'purchased' => false,
                'can_rate' => false,
                'can_claim_certificate' => false,
                'can_download_certificate' => false,
            ];
        }
        $courseEnrolled = EnrolledCourse::whereUserId($user->id)->whereCourseId($this->attributes['id'])->first();
        $userCertificate = UserCertificate::whereCourseId($this->attributes['id'])->whereUserId($user->id)->exists();
        return [
            'cart' => Cart::whereUserId($user->id)->whereCourseId($this->attributes['id'])->exists(),
            'wishlist' => Wishlist::whereUserId($user->id)->whereCourseId($this->attributes['id'])->exists(),
            'purchased' => $courseEnrolled ? true : false,
            'can_rate' => $courseEnrolled && !Rate::whereUserId($user->id)->whereCourseId($this->attributes['id'])->exists(),
            'can_claim_certificate' => $courseEnrolled && ($courseEnrolled->finished_at != null) && (!$userCertificate),
            'can_download_certificate' => $userCertificate,
        ];
    }

    public function getUpdatedAtDiffAttribute() {
        return (isset($this->attributes['updated_at']) && $this->attributes['updated_at'] ? Carbon::parse($this->attributes['updated_at'])->diffForHumans()  : "");
    }

    public function lectures() {
        return $this->hasMany(Lecture::class);
    }

    public function getTotalLecturesAttribute() {
        return $this->lectures()->count();
    }
    public function getCurrencyAttribute() {
        return "$"; // TODO dynamic currency
    }

    public function enrolled_courses() {
        return $this->hasMany(EnrolledCourse::class);
    }

    public function getTotalStudentsAttribute() {
        $totalStudents = EnrolledCourse::whereCourseId($this->id)->count();
        return $totalStudents;
    }

    public function getRatesAttribute() {
        $rates = [
            'count' => $this->rate()->count(),
            'average' => (int) $this->rate()->average('rate'),
        ];
        return $rates;
    }

    public function getFinalPriceAttribute() {
        if ($this->attributes['offer_price'] == 1) {
            // If offer_price is set to 1, apply the offer percentage
            $offerPercentage = $this->attributes['offer_percentage'];
            $price = $this->attributes['price'];

            $finalPrice = $price - ($price * ($offerPercentage / 100));
        } else {
            // If offer_price is 0, use the regular price
            $finalPrice = $this->attributes['price'];
        }

        return $finalPrice;
    }

    public function getStatusAttribute() {
        $status = CourseStatuses::getTitle($this->attributes['status']);
        return $status;
    }

    public function rate() {
        return $this->hasMany(Rate::class);
    }

    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function instructor() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function organization() {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function language() {
        return $this->belongsTo(Language::class, 'language_id');
    }

    public function currency() {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    public function isPublished() {
        return $this->published_at !== null;
    }

    public function scopePublished($query) {
        return $query->whereNotNull('published_at');
    }

    public function  scopeOwned($query) {
        return $query->where("user_id", auth()->guard('api')->id());
    }

    public function scopeSelectPreview($query) {
        return $query->select(['courses.id', 'courses.user_id', 'courses.thumbnail', 'courses.title', 'courses.status', 'courses.slug', 'courses.description', 'courses.price', 'courses.offer_price', 'courses.offer_percentage']);
    }

    public function setThumbnailAttribute($value) {
        $thumbnail = $this->thumbnail;
        if ($value) {
            // Remove old image if exists
            if ($this->thumbnail) {
                FileHandler::delete([$this->filePath . $this->thumbnail, $this->filePath . 'thumbnails/' . $this->thumbnail]);
            }
            // store uploaded image
            $thumbnail = FileHandler::image($value, $this->filePath, false);
            $this->attributes['thumbnail'] = basename($thumbnail);
        }
    }

    public function getThumbnailAttribute($value): string {
        if ($value) {
            return asset('storage/' . $this->filePath . '/' . $value);
        } else {
            return asset('storage/' . $this->filePath . '/' . 'default.png');
        }
    }

    public function getDurationAttribute() {
        return Lecture::join('lecture_files', 'lecture_files.lecture_id', 'lectures.id')
            ->where("lecture_files.main_file", 1)
            ->where("lectures.course_id", $this->id)
            ->sum("lecture_files.duration");
    }

    public static function scopeTopRated($query) {
        return $query->join('rates', 'rates.course_id', 'courses.id')
            ->selectRaw('MAX(rates.rate) AS max_rate')
            ->groupBy('courses.id')
            ->orderBy("max_rate", "DESC");
    }

    public static function scopeShorts($query) {
        return $query->join('lectures', 'lectures.course_id', 'lectures.id')
            ->join('lecture_files', 'lecture_files.lecture_id', 'lectures.id')
            ->selectRaw('SUM(lecture_files.duration) AS total_lectures_duration')
            ->where("lecture_files.main_file", 1)
            ->havingRaw("SUM(lecture_files.duration) < " . self::SHORT_COURSES_DURATION)
            ->groupBy('lectures.id', 'courses.id')
            ->orderBy("total_lectures_duration", "DESC");
    }
}
