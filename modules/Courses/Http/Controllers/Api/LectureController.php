<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Services\Formatter\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Courses\Entities\Lecture;
use modules\Courses\Http\Requests\Lecture\CreateLectureRequest;
use modules\Courses\Http\Requests\Lecture\UpdateLectureRequest;

class LectureController extends ApiController {
    /**
     * The index function retrieves lectures from the database and returns them as a JSON response.
     * 
     * @param Request request The  parameter is an instance of the Request class, which represents
     * an HTTP request. It contains information about the request such as the request method, headers,
     * query parameters, and request body. In this case, it is used to retrieve any query parameters that
     * may be passed to the index method.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Lectures
     * fetched successfully', and an array of lectures.
     */
    public function index(Request $request): JsonResponse {
        $lectures = Lecture::orderBy('title', "DESC")->owned()->withTrashed()->paginate(20);
        return $this->return(200, 'Lectures fetched successfully', ['lectures' => $lectures]);
    }


    public function getCourseLectures(string $slug): JsonResponse {
        $lectures = Lecture::leftJoin('courses', 'courses.id', 'lectures.course_id')->where('courses.slug', $slug)
            ->where("courses.user_id", auth()->guard("api")->id())->withTrashed()->orderBy('order_number', "DESC")->paginate(20);
        return $this->return(200, 'Lectures fetched successfully', ['lectures' => $lectures]);
    }


    /**
     * The function retrieves a lecture with a given slug and returns a JSON response with the lecture data
     * if it exists, or an error message if it doesn't.
     * 
     * @param string slug The "slug" parameter is a string that represents a unique identifier for a
     * lecture. It is used to retrieve the lecture from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show(string $slug): JsonResponse {
        $lecture = Lecture::where('slug', $slug)->withTrashed()->first();
        if (!$lecture) {
            return $this->return(400, 'Lecture not exists');
        }
        return $this->return(200, 'Lecture fetched Successfully', ['lecture' => $lecture]);
    }

    /**
     * The function stores a new lecture using the validated data from the CreateLectureRequest and
     * returns a JSON response with a success message.
     * 
     * @param CreateLectureRequest createLectureRequest The  parameter is an
     * instance of the CreateLectureRequest class. It is used to validate and store the data for creating
     * a new lecture.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function store(CreateLectureRequest $createLectureRequest): JsonResponse {
        // create a new lecture from the validated data
        $courseData = $createLectureRequest->all();
        $courseData['user_id'] = auth()->guard('api')->id();
        $courseData['slug'] = Slug::returnFormatted($courseData['slug']);
        $courseData['media_file'] = $createLectureRequest->file('media_file');
        // Create lecture row, with it's files: media video file, and additional files
        Lecture::create($courseData);
        return $this->return(200, 'Lecture Added Successfully');
    }


    /**
     * The function updates a lecture with the validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateLectureRequest updateLectureRequest This is an instance of the UpdateLectureRequest class,
     * which is a custom request class that handles the validation and data retrieval for updating a
     * lecture.
     * @param string slug The "slug" parameter is a unique identifier for the lecture. It is typically a
     * URL-friendly version of the lecture name or title.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateLectureRequest $updateLectureRequest, string $slug): JsonResponse {
        $lecture = Lecture::where("slug", $slug)->owned()->withTrashed()->first();
        // Checking if the lecture not exists
        if (!$lecture) {
            return $this->return(400, 'Lecture not exists');
        }
        // Update the lecture with the validated data
        $lecture->update($updateLectureRequest->validated());
        return $this->return(200, 'Lecture updated Successfully');
    }


    /**
     * The function destroys a lecture by its slug and returns a JSON response indicating whether the lecture
     * was successfully deleted or not.
     * 
     * @param string slug The "slug" parameter is a unique identifier for the lecture. It is used to find the
     * lecture in the database and delete it.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function destroy(string $slug): JsonResponse {
        $lecture = Lecture::where("slug", $slug)->owned()->first();
        // Checking if the lecture not exists
        if (!$lecture) {
            return $this->return(400, 'Lecture not exists');
        }
        $lecture->delete();
        return $this->return(200, 'Lecture deleted Successfully');
    }
}
