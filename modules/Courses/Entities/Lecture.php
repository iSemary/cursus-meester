<?php

namespace modules\Courses\Entities;

use App\Services\Uploader\FileHandler;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Lecture extends Model {
    use HasFactory, SoftDeletes;

    public static $mediaPath = "lectures";
    public static $additionalFilePath = "lectures/additional";

    protected $fillable = ['course_id', 'title', 'slug', 'description', 'lecture_media_id', 'order_number'];

    public function course() {
        return $this->belongsTo(Course::class, 'course_id');
    }

    protected $appends = ['media_file'];
    // protected $attributes = ['media_file'];


    // public function getMediaFileAttribute($value): string {
    //     if ($value) {
    //         return asset('storage/' . $this->mediaPath . '/' . $value);
    //     } else {
    //         return asset('storage/' . $this->mediaPath . '/' . 'default.png');
    //     }
    // }

    // set multiple lecture files
}
