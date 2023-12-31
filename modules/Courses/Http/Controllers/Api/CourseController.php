<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Jobs\Notifications\CourseStatusChanged;
use App\Models\Utilities\Language;
use App\Services\Formatter\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Categories\Entities\Category;
use modules\Courses\Entities\Course;
use modules\Courses\Entities\Exam\Exam;
use modules\Courses\Entities\Lecture;
use modules\Courses\Entities\LectureFile;
use modules\Courses\Entities\LectureSection;
use modules\Courses\Entities\Rate;
use modules\Courses\Http\Requests\Course\CreateCourseRequest;
use modules\Courses\Http\Requests\Course\UpdateCourseRequest;
use modules\Instructors\Entities\InstructorProfile;
use stdClass;

class CourseController extends ApiController {
    protected array $courseLevels;

    public function __construct() {
        $this->courseLevels = [['id' => 1, 'title' => 'Beginner'], ['id' => 2, 'title' => 'Intermediate'], ['id' => 3, 'title' => 'Expert']];
    }

    /**
     * The index function retrieves courses from the database and returns them as a JSON response.
     * 
     * @param Request request The  parameter is an instance of the Request class, which represents
     * an HTTP request. It contains information about the request such as the request method, headers,
     * query parameters, and request body. In this case, it is used to retrieve any query parameters that
     * may be passed to the index method.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Courses
     * fetched successfully', and an array of courses.
     */
    public function index(Request $request): JsonResponse {
        $courses = Course::orderBy('title', "DESC")->owned()->withTrashed()->paginate(20);
        return $this->return(200, 'Courses fetched successfully', ['courses' => $courses]);
    }


    /**
     * The function "sections" retrieves lecture sections for a given course ID and returns a JSON response
     * with the sections.
     * 
     * @param courseId The `courseId` parameter is the identifier of a course. It is used to filter the
     * lecture sections and retrieve only the sections that belong to the specified course.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function sections($courseId): JsonResponse {
        $sections = LectureSection::select('id', 'title')->whereCourseId($courseId)->get();
        return $this->return(200, 'Courses fetched successfully', ['sections' => $sections]);
    }

    /**
     * The function retrieves all courses with their associated instructors and returns them as a JSON
     * response.
     * 
     * @param Request request The `` parameter is an instance of the `Illuminate\Http\Request`
     * class. It represents an incoming HTTP request and contains information such as the request method,
     * headers, and input data. It is used to retrieve data from the request and perform actions based on
     * the request data.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a message of 'All Courses fetched
     * successfully', and an array containing the fetched courses.
     */
    public function all(Request $request): JsonResponse {
        $courses = Course::orderBy('id', "DESC")->withTrashed()->with(['instructor' => function ($query) {
            $query->select(['id', 'full_name', 'username']);
        }])->paginate(5);
        return $this->return(200, 'All Courses fetched successfully', ['courses' => $courses]);
    }

    /**
     * The function changes the status of a course based on the provided request data and returns a success
     * message.
     * 
     * @param Request request The `` parameter is an instance of the `Illuminate\Http\Request`
     * class. It represents an HTTP request made to the server and contains information such as the request
     * method, headers, and request data.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function changeStatus(Request $request): JsonResponse {
        $course = Course::where("id", $request->id)->first();
        $course->update(['status' => $request->status]);
        // Send notification to instructor
        $data = [
            'user_id' => $course->user_id,
            'status' => $request->status,
            'course_id' => $course->id,
            'course_name' => $course->title,
        ];
        CourseStatusChanged::dispatch($data);
        return $this->return(200, 'Course status changed successfully');
    }

    /**
     * The function retrieves a course with a given slug and returns a JSON response with the course data
     * if it exists, or an error message if it doesn't.
     * 
     * @param string slug The "slug" parameter is a string that represents a unique identifier for a
     * course. It is used to retrieve the course from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show(string $slug): JsonResponse {
        $course = Course::where('slug', $slug)->with(['instructor' => function ($query) {
            $query->select(['id', 'full_name', 'username']);
        }])->first();
        if (!$course) {
            return $this->return(400, 'Course not exists');
        }
        $response = new stdClass();
        $response->course = $course;
        $response->course->counters = $this->courseCounters($course->id);
        $response->resources = Lecture::getByCourseId($course->id);
        $response->rates = Rate::getByCourseId($course->id);
        return $this->return(200, 'Course fetched Successfully', ['data' => $response]);
    }


    /**
     * The function "courseCounters" returns an array with the total number of files and exams associated
     * with a given course ID.
     * 
     * @param int courseId The `courseId` parameter is an integer that represents the ID of a course.
     * 
     * @return array The function `courseCounters` returns an array with two keys: 'total_files' and
     * 'total_exams'. The value of 'total_files' is the count of LectureFile records that are associated
     * with a specific course, and the value of 'total_exams' is the count of Exam records that are
     * associated with the same course.
     */
    public function courseCounters(int $courseId): array {
        return [
            'total_files' => LectureFile::join('lectures', 'lectures.id', 'lecture_files.lecture_id')
                ->join('courses', 'courses.id', 'lectures.course_id')
                ->where("courses.id", $courseId)->where('lecture_files.main_file', 0)->count(),
            'total_exams' => Exam::join('lectures', 'lectures.id', 'exams.lecture_id')
                ->join('courses', 'courses.id', 'lectures.course_id')
                ->where("courses.id", $courseId)->count()
        ];
    }

    /**
     * The function retrieves a course and its associated instructor and lecture sections based on a given
     * slug.
     * 
     * @param string slug The "slug" parameter is a string that represents a unique identifier for a
     * course. It is used to retrieve a specific course from the database.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function getForModify(string $slug): JsonResponse {
        $course = Course::where('slug', $slug)->with(['instructor' => function ($query) {
            $query->select(['id', 'full_name', 'username']);
        }])->first();
        if (!$course) {
            return $this->return(400, 'Course not exists');
        }
        $response = new stdClass();
        $response->course = $course;
        $response->course->sections = LectureSection::select('id', 'title')->whereCourseId($course->id)->get();
        return $this->return(200, 'Course fetched Successfully', ['course' => $course]);
    }

    /**
     * The function creates a JSON response with essential data including categories, languages, and
     * levels.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function create(): JsonResponse {
        $data['categories'] = Category::select(['id', 'title'])->where("status", 1)->orderBy("order_number")->get();
        $data['languages'] = Language::select(['id', 'name'])->get();
        $data['levels'] = $this->courseLevels;
        return $this->return(200, 'Essentials data fetched', ['data' => $data]);
    }

    /**
     * The function stores a new course using the validated data from the CreateCourseRequest and
     * returns a JSON response with a success message.
     * 
     * @param CreateCourseRequest createCourseRequest The  parameter is an
     * instance of the CreateCourseRequest class. It is used to validate and store the data for creating
     * a new course.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function store(CreateCourseRequest $createCourseRequest): JsonResponse {
        // create a new course from the validated data
        $courseData = $createCourseRequest->validated();
        $courseData['user_id'] = auth()->guard('api')->id();
        $courseData['slug'] = Slug::returnFormatted($courseData['slug']);
        $courseData['offer_price'] = isset($courseData['offer_price']) && in_array($courseData['offer_price'], ["true", 1]) ? 1 : 0;
        $courseData['has_certificate'] = isset($courseData['has_certificate']) && in_array($courseData['has_certificate'], ["true", 1]) ? 1 : 0;
        $courseData['currency_id'] = 1;
        $isOrganization = isset($courseData['organization_id']) && $courseData['organization_id'] == "false" ? 0 : 1;
        $courseData['organization_id'] = null;
        if ($isOrganization) {
            $instructorProfile = InstructorProfile::where("user_id", auth()->guard('api')->id())->first();
            $courseData['organization_id'] = $instructorProfile->organization_id;
        }
        Course::create($courseData);
        return $this->return(200, 'Course Added Successfully', ['slug' => $courseData['slug']]);
    }


    /**
     * The function updates a course with the validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateCourseRequest updateCourseRequest This is an instance of the UpdateCourseRequest class,
     * which is a custom request class that handles the validation and data retrieval for updating a
     * course.
     * @param string slug The "slug" parameter is a unique identifier for the course. It is typically a
     * URL-friendly version of the course name or title.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateCourseRequest $updateCourseRequest, string $slug): JsonResponse {
        $course = Course::where("slug", $slug)->owned()->withTrashed()->first();
        // Checking if the course not exists
        if (!$course) {
            return $this->return(400, 'Course not exists');
        }
        // Update the course with the validated data
        $courseData = $updateCourseRequest->validated();
        $courseData['slug'] = Slug::returnFormatted($courseData['slug']);
        $courseData['offer_price'] = isset($courseData['offer_price']) && in_array($courseData['offer_price'], ["true", 1]) ? 1 : 0;
        $courseData['has_certificate'] = isset($courseData['has_certificate']) && in_array($courseData['has_certificate'], ["true", 1]) ? 1 : 0;
        $courseData['currency_id'] = 1;
        $isOrganization = isset($courseData['organization_id']) && $courseData['organization_id'] == "false" ? 0 : 1;
        $courseData['organization_id'] = null;
        if ($isOrganization) {
            $instructorProfile = InstructorProfile::where("user_id", auth()->guard('api')->id())->first();
            $courseData['organization_id'] = $instructorProfile->organization_id;
        }
        $course->update($courseData);
        return $this->return(200, 'Course updated Successfully');
    }


    /**
     * The function destroys a course by its slug and returns a JSON response indicating whether the course
     * was successfully deleted or not.
     * 
     * @param string slug The "slug" parameter is a unique identifier for the course. It is used to find the
     * course in the database and delete it.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function destroy(string $slug): JsonResponse {
        $course = Course::where("slug", $slug)->owned()->first();
        // Checking if the course not exists
        if (!$course) {
            return $this->return(400, 'Course not exists');
        }
        $course->delete();
        return $this->return(200, 'Course deleted Successfully');
    }
}
