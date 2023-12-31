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
    public static $finishedTime = 5; // 5seconds of minimum seconds before lecture ends [to mark the student as finished it]

    protected $fillable = ['course_id', 'title', 'slug', 'description', 'lecture_media_id', 'order_number', 'lecture_section_id'];

    public function course() {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function scopeOwned($query) {
        return $query->leftJoin('courses', 'courses.id', 'lectures.course_id')->where("courses.user_id", auth()->guard('api')->id());
    }

    public function getStatusAttribute() {
        $status = "Active";
        if ($this->attributes['deleted_at']) {
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
                $sectionData['section'] = $section;
                $sectionData['section']['resources'] = [];

                $lectures = self::where('course_id', $courseId)->where("lecture_section_id", $section->id)->get();

                $lecturesResources = [];
                foreach ($lectures as $i => $lecture) {
                    $lectureFile = LectureFile::where("id", $lecture->lecture_media_id)->first();
                    $lecture->duration = $lectureFile ? $lectureFile->duration : "";
                    $lecturesResources = array_merge($lecturesResources, self::prepareLectureResources($lecture));
                }


                $sectionData['section']['resources'] = $lecturesResources;
                $resources[] = $sectionData;
            }
        }

        return $resources;
    }

    public static function prepareLectureResources(Lecture $lecture): array {
        $resources = [];
        /** Main Lecture */
        $resources[] = self::formatResource($lecture, ResourceTypes::LECTURE_TYPE);
        /** Lecture Exam */
        if ($lecture->has_exam) {
            $exam = Exam::select(['id', 'title', 'description'])->where("lecture_id", $lecture->id)->first();
            $resources[] = self::formatResource($exam, ResourceTypes::EXAM_TYPE);
        }
        /** Lecture Files */
        if ($lecture->additional_files && count($lecture->additional_files)) {
            foreach ($lecture->additional_files as $additionalFile) {
                $resources[] = self::formatResource($additionalFile, ResourceTypes::FILE_TYPE);
            }
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
                $duration = "";
                if ($resource['duration']) {
                    $duration = self::formatTime($resource['duration']);
                }
                $formattedResource['duration'] = $duration;
                $formattedResource['type_id'] = ResourceTypes::LECTURE_TYPE;
                $formattedResource['type'] = "lecture";
                break;

            case ResourceTypes::EXAM_TYPE:
                $formattedResource['id'] = $resource['id'];
                $formattedResource['title'] = $resource['title'];
                $formattedResource['duration'] = $resource['total_questions'] . " Questions";
                $formattedResource['type_id'] = ResourceTypes::EXAM_TYPE;
                $formattedResource['type'] = "exam";
                break;
            case ResourceTypes::FILE_TYPE:
                $formattedResource['id'] = $resource['id'];
                $formattedResource['title'] = $resource['original_name'] . '.' . $resource['extension'];
                $formattedResource['duration'] = $resource['size'] ? (round($resource['size'] / (1024 * 1024)) . " MB") : "";
                $formattedResource['type_id'] = ResourceTypes::FILE_TYPE;
                $formattedResource['type'] = "file";
                break;
            default:
                break;
        }

        return $formattedResource;
    }


    public static function formatTime($seconds): string {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $seconds = $seconds % 60;

        return sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
    }
}
