<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use modules\Courses\Entities\Exam\Exam;
use modules\Courses\Interfaces\ResourceTypes;

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
        $sections = LectureSection::select('id', 'title')->whereCourseId($courseId)->orderBy("id")->get();
        $resources = [];
        if ($sections) {
            foreach ($sections as $key => $section) {
                $resources[$key]['section'] = $section;
                $lectures = self::where('course_id', $courseId)->where("lecture_section_id", $section->id)->get();

                foreach ($lectures as $i => $lecture) {
                    $resources[$key]['section']['resources'] = self::prepareLectureResources($lecture);
                }
            }
        }

        return $resources;
    }

    public static function prepareLectureResources(Lecture $lecture) {
        $resources = [];
        if ($lecture) {
            $resources[] = self::formatResource($lecture, ResourceTypes::LECTURE_TYPE);
        }
        if ($lecture->additional_files && count($lecture->additional_files)) {
            foreach ($lecture->additional_files as $additionalFile) {
                $resources[] = self::formatResource($additionalFile, ResourceTypes::FILE_TYPE);
            }
        }
        if ($lecture->has_exam) {
            $exam = Exam::select(['id', 'title', 'description'])->where("lecture_id", $lecture->id)->first();
            $resources[] = self::formatResource($exam, ResourceTypes::EXAM_TYPE);
        }
        return $resources;
    }


    public static function formatResource($resource, $typeId) {
        $formattedResource = [];
        switch ($typeId) {
            case ResourceTypes::LECTURE_TYPE:
                $formattedResource['id'] = $resource['id'];
                $formattedResource['title'] = $resource['title'];
                $formattedResource['slug'] = $resource['slug'];
                $formattedResource['duration'] = $resource['duration'];
                $formattedResource['type_id'] = ResourceTypes::LECTURE_TYPE;
                $formattedResource['type'] = "lecture";
                break;
            case ResourceTypes::FILE_TYPE:
                $formattedResource['id'] = $resource['id'];
                $formattedResource['title'] = $resource['original_name'] . '.' . $resource['extension'];
                $formattedResource['path'] = $resource['path'];
                $formattedResource['size'] = $resource['size'];
                $formattedResource['type_id'] = ResourceTypes::FILE_TYPE;
                $formattedResource['type'] = "file";
                break;
            case ResourceTypes::EXAM_TYPE:
                $formattedResource['id'] = $resource['id'];
                $formattedResource['title'] = $resource['title'];
                $formattedResource['total_questions'] = $resource['total_questions'];
                $formattedResource['type_id'] = ResourceTypes::EXAM_TYPE;
                $formattedResource['type'] = "exam";
                break;
            default:
                break;
        }

        return $formattedResource;
    }
}
