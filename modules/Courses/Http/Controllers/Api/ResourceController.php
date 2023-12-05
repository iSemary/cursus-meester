<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use modules\Courses\Entities\Exam\Exam;
use modules\Courses\Entities\LectureFile;
use modules\Courses\Interfaces\ResourceTypes;
use modules\Payments\Entities\EnrolledCourse;

class ResourceController extends ApiController {
    private $user;
    private $resource;
    public function __construct() {
        $this->user = auth()->guard('api')->user();
    }

    /**
     * The function checks the eligibility of a user to access a file based on their enrollment in a course
     * and the existence of the file.
     * 
     * @param int courseId The courseId parameter represents the ID of the course that the user wants to
     * check eligibility for.
     * @param int fileId The `fileId` parameter represents the ID of the file that needs to be checked for
     * eligibility.
     * @param int fileTypeId The `fileTypeId` parameter represents the type of the file being checked. It
     * is an integer value that is used to identify the type of the file, such as an image, document,
     * video, etc.
     * 
     * @return JsonResponse|bool either a JsonResponse object or a boolean value.
     */
    private function checkEligibility(int $courseId, int $resourceId, int $resourceTypeId): JsonResponse|bool {
        $enrolled = $this->checkEnrolled($courseId);
        if (!$enrolled) {
            return $this->return(400, "You have to be enrolled to this course");
        }
        $resourceExists = $this->checkFileExists($resourceId,  $resourceTypeId);
        if (!$resourceExists) {
            return $this->return(400, "Requested resource not exists");
        }
        return true;
    }

    /**
     * The function checks if a user is enrolled in a specific course.
     * 
     * @param int courseId The courseId parameter is an integer that represents the ID of a course.
     * 
     * @return bool a boolean value.
     */
    private function checkEnrolled(int $courseId): bool {
        return EnrolledCourse::where("user_id", $this->user->id)->where("course_id", $courseId)->exists();
    }

    private function checkFileExists(int $resourceId, int $resourceTypeId): bool {
        $resource = [];
        switch ($resourceTypeId) {
            case ResourceTypes::LECTURE_TYPE:
                $file = LectureFile::where("id", $resourceId)->first();
                if (!$file) return false;
                $resource = $file->path;
                break;
            case ResourceTypes::FILE_TYPE:
                $file = LectureFile::where("id", $resourceId)->first();
                if (!$file) return false;
                $resource = ['path' => $file->path, 'name' => $file->original_name];
                break;
            case ResourceTypes::EXAM_TYPE:
                $exam = Exam::select(['id', 'title', 'description'])->where("exams.id", $resourceId)->first();
                if (!$exam) return false;
                $resource = (new ExamController)->prepareExamForStudent($exam);
                break;
            default:
                return false;
                break;
        }

        $this->setResource($resource);
        return true;
    }

    /**
     * The function sets the resource property of an object.
     * 
     * @param `resource` The "resource" parameter is the value that you want to set for the "resource"
     * property of the object.
     */
    public function setResource($resource): void {
        $this->resource = $resource;
    }

    public function lecture(int $courseId, int $resourceId): JsonResponse {
        $eligibilityCheck = $this->checkEligibility($courseId, $resourceId, ResourceTypes::LECTURE_TYPE);
        if ($eligibilityCheck !== true) return $eligibilityCheck;

        return $this->return(200, "Lecture fetched successfully", ['data' => $this->resource]);
    }

    public function file(int $courseId, int $resourceId): JsonResponse {
        $eligibilityCheck = $this->checkEligibility($courseId, $resourceId, ResourceTypes::FILE_TYPE);
        if ($eligibilityCheck !== true) return $eligibilityCheck;

        return $this->return(200, "File fetched successfully", ['data' => $this->resource]);
    }

    /**
     * The function "exam" checks the eligibility of a resource and returns a JSON response with the
     * fetched exam data if eligible.
     * 
     * @param int courseId The courseId parameter is an integer that represents the ID of a course. It is
     * used to identify a specific course in the system.
     * @param int resourceId The `` parameter is an integer that represents the ID of a specific
     * resource.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function exam(int $courseId, int $resourceId): JsonResponse {
        $eligibilityCheck = $this->checkEligibility($courseId, $resourceId, ResourceTypes::EXAM_TYPE);
        if ($eligibilityCheck !== true) return $eligibilityCheck;

        return $this->return(200, "Exam fetched successfully", ['data' => $this->resource]);
    }
}
