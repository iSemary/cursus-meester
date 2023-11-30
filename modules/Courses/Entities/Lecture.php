<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use modules\Courses\Entities\Exam\Exam;

class Lecture extends Model {
    use HasFactory, SoftDeletes;

    public static $mediaPath = "lectures";
    public static $additionalFilePath = "lectures/additional";

    protected $fillable = ['course_id', 'title', 'slug', 'description', 'lecture_media_id', 'order_number', 'lecture_section_id'];

    public function course() {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function scopeOwned($query) {
        return $query->leftJoin('courses', 'courses.id', 'lectures.course_id')->where("courses.user_id", auth()->guard('api')->id());
    }

    public function getStatusAttribute() {
        $status = "Active";
        if ($this->deleted_at) {
            $status = "Deleted";
        }
        return $status;
    }


    protected $appends = ['has_exam', 'total_files', 'status', 'media_file', 'additional_files'];
    // protected $attributes = ['media_file'];

    public function getHasExamAttribute() {
        return Exam::where("lecture_id", $this->id)->count();
    }

    public function getTotalFilesAttribute() {
        return LectureFile::where("lecture_id", $this->id)->where("main_file", 0)->count();
    }

    public function getMediaFileAttribute() {
        return $this->lecture_media_id ? LectureFile::getMediaFile($this->lecture_media_id) : null;
    }

    public function getAdditionalFilesAttribute() {
        return LectureFile::getAdditionalFiles($this->id);
    }

    public static function getByCourseId(int $courseId) {
        $lectures = self::where('course_id', $courseId)->get();
        return $lectures;
    }

    // public function getMediaFileAttribute($value): string {
    //     if ($value) {
    //         return asset('storage/' . $this->mediaPath . '/' . $value);
    //     } else {
    //         return asset('storage/' . $this->mediaPath . '/' . 'default.png');
    //     }
    // }

    // set multiple lecture files
}
