<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Models\Utilities\Currency;
use App\Models\Utilities\Language;
use App\Services\Uploader\FileHandler;
use modules\Categories\Entities\Category;
use modules\Organizations\Entities\Organization;
use modules\Payments\Entities\EnrolledCourse;

class Course extends Model {
    use HasFactory, SoftDeletes;

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
        'published_at',
    ];

    protected $dates = ['offer_expired_at', 'published_at'];

    protected $casts = ['offer_price' => 'boolean',];

    protected $hidden = [
        "deleted_at",
        "created_at",
    ];

    protected $appends = [
        'duration',
        'status',
        'total_students',
        'total_lectures',
        'final_price',
        'rates',
    ];

    public function lectures() {
        return $this->hasMany(Lecture::class);
    }

    public function getTotalLecturesAttribute() {
        return $this->lectures()->count();
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
        $status = "Active";
        if ($this->published_at > now()) {
            $status = "In Active";
        }
        if ($this->deleted_at) {
            $status = "Deleted";
        }
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
}
