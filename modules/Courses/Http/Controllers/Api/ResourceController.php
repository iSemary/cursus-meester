<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use modules\Courses\Entities\Course;
use modules\Courses\Entities\Exam\Exam;
use modules\Courses\Entities\Lecture;
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

    /**
     * The function `checkFileExists` checks if a file exists based on the given resource ID and resource
     * type ID, and returns true if it exists, false otherwise.
     * 
     * @param int resourceId The `resourceId` parameter is an integer that represents the ID of the
     * resource. It is used to retrieve the specific resource from the database.
     * @param int resourceTypeId The `resourceTypeId` parameter is an integer that represents the type of
     * resource. It is used in a switch statement to determine the type of resource and perform different
     * actions based on the type. The possible values for `resourceTypeId` are defined in the
     * `ResourceTypes` class.
     * 
     * @return bool a boolean value. It returns true if the file exists and false if it does not.
     */
    private function checkFileExists(int $resourceId, int $resourceTypeId): bool {
        $resource = [];
        switch ($resourceTypeId) {
            case ResourceTypes::LECTURE_TYPE:
                $lecture = Lecture::whereId($resourceId)->first();
                $file = LectureFile::where("id", $lecture->lecture_media_id)->first();
                if (!$file) return false;
                $resource = [
                    'path' => $file->hash_name . '.' . $file->extension,
                ];
                break;
            case ResourceTypes::FILE_TYPE:
                $file = LectureFile::where("id", $resourceId)->first();
                if (!$file) return false;
                $resource = [
                    'path' => 'protected/' . Lecture::$additionalFilePath . '/' . $file->hash_name . '.' . $file->extension,
                    'name' => $file->original_name . '.' . $file->extension
                ];
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

    /**
     * The function "lecture" fetches a lecture resource based on the provided course ID and resource ID.
     * 
     * @param int courseId The courseId parameter is an integer that represents the ID of the course for
     * which the lecture is being fetched.
     * @param int resourceId The `` parameter is an integer that represents the unique
     * identifier of the lecture resource that you want to fetch.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function lecture(int $courseId, int $resourceId): JsonResponse {
        $eligibilityCheck = $this->checkEligibility($courseId, $resourceId, ResourceTypes::LECTURE_TYPE);
        if ($eligibilityCheck !== true) return $eligibilityCheck;

        return $this->return(200, "Lecture fetched successfully", ['data' => $this->resource]);
    }

    /**
     * The function fetches a file resource for a given course and resource ID, after checking eligibility.
     * 
     * @param int courseId An integer representing the ID of the course that the file belongs to.
     * @param int resourceId The `` parameter is an integer that represents the unique
     * identifier of a resource. It is used to identify a specific resource within a course.
     * 
     * @return JsonResponse a JsonResponse object.
     */
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


    /**
     * The function returns a file as a response with appropriate headers.
     * 
     * @param Request request The `` parameter is an instance of the `Illuminate\Http\Request`
     * class. It represents the HTTP request made to the server and contains information such as the
     * request method, headers, and input data.
     * 
     * @return blob file content as a response with appropriate headers.
     */
    public function returnBlob(Request $request) {
        // Get the file content
        $fileContent = Storage::get($request->file_path);
        // Check if the file exists
        if (!Storage::exists($request->file_path)) {
            return $this->return(400, "File not exists");
        }
        $fileMimeType = File::mimeType(storage_path("app/{$request->file_path}"));
        // Set the appropriate content type header
        $headers = [
            'Content-Type' => $fileMimeType,
            'Content-Disposition' => 'attachment; filename="' . $request->file_name . '"',
        ];
        // Return the file content as a response with headers
        return response($fileContent, 200, $headers);
    }

    /**
     * The function `returnMedia` checks if a file exists, verifies the user's authentication token,
     * checks if the file is associated with a valid course, checks if the user is enrolled in the course,
     * and returns the file if all conditions are met.
     * 
     * @param string fileName The fileName parameter is a string that represents the name of the file that
     * you want to return. It should include the file extension as well (e.g., "example.pdf").
     * @param string accessToken The `accessToken` parameter is a string that represents the access token
     * of the user. It is used to authenticate the user and verify their identity before allowing them to
     * access the media file.
     * 
     * @return response object that contains the file specified by the `path` variable.
     */
    public function returnMedia(string $fileName, string $accessToken) {
        $this->user = User::manualCheckToken($accessToken);
        $path = storage_path("app/protected/lectures/{$fileName}");
        // check file exists
        if (!file_exists($path)) {
            return $this->return(400, "File not exists");
        }
        // Check auth token
        if (!$this->user) {
            return $this->returnUnAuthenticated();
        }
        $hashName = explode('.', $fileName);
        $hashName = $hashName[0];
        $course = Course::leftJoin("lectures", "lectures.course_id", "courses.id")
            ->leftJoin("lecture_files", "lecture_files.lecture_id", "lectures.id")
            ->select("courses.id")
            ->where("lecture_files.hash_name", $hashName)
            ->first();
        if (!$course) {
            return $this->return(400, "Course not exists");
        }
        // check enrolled 
        $isEnrolled = $this->checkEnrolled($course->id);
        if (!$isEnrolled) {
            return $this->returnUnAuthorized();
        }
        return response()->file($path);
    }
}
