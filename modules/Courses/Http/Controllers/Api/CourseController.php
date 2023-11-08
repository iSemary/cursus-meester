<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Services\Formatter\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Courses\Entities\Course;
use modules\Courses\Http\Requests\Course\CreateCourseRequest;
use modules\Courses\Http\Requests\Course\UpdateCourseRequest;

class CourseController extends ApiController {
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
        $courses = Course::orderBy('title', "DESC")->paginate(20);
        return $this->return(200, 'Courses fetched successfully', ['courses' => $courses]);
    }

    /**
     * The function "show" retrieves a course by its ID and returns a JSON response with the course's
     * title, parent ID, and icon if it exists, or an error message if it doesn't.
     * 
     * @param String $slug The parameter "slug" is an string of the Course model. It is used
     * to retrieve the course with the specified slug from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show($slug): JsonResponse {
        $course = Course::where('slug', $slug)->first();
        if (!$course) {
            return $this->return(400, 'Course not exists');
        }
        return $this->return(200, 'Course fetched Successfully', ['course' => $course]);
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
        Course::create($courseData);
        return $this->return(200, 'Course Added Successfully');
    }

    /**
     * This PHP function updates a course with validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateCourseRequest updateCourseRequest An instance of the UpdateCourseRequest class,
     * which is a request object that contains the data to update the course.
     * @param Course course The "course" parameter is an instance of the Course model. It
     * represents the course that needs to be updated.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateCourseRequest $updateCourseRequest, Course $course): JsonResponse {
        // Checking if the course not exists
        if (!$course) {
            return $this->return(400, 'Course not exists');
        }
        // Update the course with the validated data
        $course->update($updateCourseRequest->validated());
        return $this->return(200, 'Course updated Successfully');
    }

    /**
     * The function destroys a course object and returns a JSON response indicating whether the deletion
     * was successful or not.
     * 
     * @param Course course The parameter "course" is an instance of the Course model. It is used
     * to identify the course that needs to be deleted.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */

    public function destroy(Course $course): JsonResponse {
        // Checking if the course not exists
        if (!$course) {
            return $this->return(400, 'Course not exists');
        }
        $course->delete();
        return $this->return(200, 'Course deleted Successfully');
    }
}
