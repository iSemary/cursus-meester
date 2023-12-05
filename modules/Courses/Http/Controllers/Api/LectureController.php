<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Services\Formatter\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Courses\Entities\Lecture;
use modules\Courses\Entities\LectureFile;
use modules\Courses\Entities\LectureSection;
use modules\Courses\Http\Requests\Lecture\CreateLectureRequest;
use modules\Courses\Http\Requests\Lecture\UpdateLectureRequest;

class LectureController extends ApiController {
    /**
     * The index function retrieves lectures from the database and returns them as a JSON response.

     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Lectures
     * fetched successfully', and an array of lectures.
     */
    public function index(): JsonResponse {
        $lectures = Lecture::orderBy('title', "DESC")->owned()->withTrashed()->paginate(5);
        return $this->return(200, 'Lectures fetched successfully', ['lectures' => $lectures]);
    }

    /**
     * The function retrieves lectures for a specific course based on the course slug and the authenticated
     * user's ID.
     * 
     * @param string courseSlug The courseSlug parameter is a string that represents the unique identifier
     * or slug of a course. It is used to retrieve the lectures associated with the specified course.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Lectures
     * fetched successfully', and an array containing the lectures fetched.
     */
    public function getCourseLectures(string $courseSlug): JsonResponse {
        $lectures = Lecture::leftJoin('courses', 'courses.id', 'lectures.course_id')
            ->select(['lectures.*'])
            ->where('courses.slug', $courseSlug)
            ->where("courses.user_id", auth()->guard("api")->id())->withTrashed()->orderBy('order_number', "DESC")->paginate(5);
        return $this->return(200, 'Lectures fetched successfully', ['lectures' => $lectures]);
    }

    /**
     * The function retrieves a specific lecture from a course based on the course slug and lecture slug,
     * and returns it as a JSON response.
     * 
     * @param string courseSlug The courseSlug parameter is a string that represents the unique identifier
     * or slug of a course. It is used to retrieve the lecture associated with the specified course.
     * @param string lectureSlug The `lectureSlug` parameter is a string that represents the unique
     * identifier (slug) of a lecture. It is used to retrieve a specific lecture from a course.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a message of 'Lecture fetched
     * successfully', and an array containing the fetched lecture.
     */
    public function getCourseLecture(string $courseSlug, string $lectureSlug): JsonResponse {
        $lectures = Lecture::leftJoin('courses', 'courses.id', 'lectures.course_id')
            ->select(['lectures.*'])
            ->where('courses.slug', $courseSlug)
            ->where('lectures.slug', $lectureSlug)
            ->where("courses.user_id", auth()->guard("api")->id())->withTrashed()->orderBy('order_number', "DESC")->first();
        return $this->return(200, 'Lecture fetched successfully', ['lecture' => $lectures]);
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
        // add or get section id
        $courseData['lecture_section_id'] = $this->returnSectionIdFromSection($courseData['course_id'], $courseData['lecture_section_id']);
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
        $lecture = Lecture::select(['lectures.id'])->where("lectures.slug", $slug)->owned()->withTrashed()->first();
        // Checking if the lecture not exists
        if (!$lecture) {
            return $this->return(400, 'Lecture not exists');
        }
        // Update the lecture with the validated data
        $courseData = $updateLectureRequest->all();
        $courseData['slug'] = Slug::returnFormatted($courseData['slug']);
        $courseData['media_file'] = $updateLectureRequest->file('media_file');
        $lecture->update($courseData);
        return $this->return(200, 'Lecture updated Successfully');
    }

    /**
     * The function takes a course ID and a section (either a numeric ID or a string title), and
     * returns the corresponding section ID.
     * 
     * @param int courseId The courseId parameter is an integer that represents the ID of a course.
     * @param string section The "section" parameter can be either a string or an integer. It
     * represents the title or ID of a lecture section in a course.
     * 
     * @return int an integer value, which is the section ID.
     */
    private function returnSectionIdFromSection(int $courseId, string|int $section): int {
        if (is_numeric($section)) {
            $lectureSection = LectureSection::whereCourseId($courseId)->where('id', $section)->first();
            if ($lectureSection) {
                return $lectureSection->id;
            }
        }
        $newLectureSection = LectureSection::create([
            'course_id' => $courseId,
            'title' => $section,
        ]);
        return $newLectureSection->id;
    }

    /**
     * The function deletes a lecture file based on the lecture slug and file ID, and returns a success
     * message.
     * 
     * @param string lectureSlug The lectureSlug parameter is a string that represents the unique
     * identifier (slug) of a lecture.
     * @param string lectureFileId The lectureFileId parameter is the unique identifier of the lecture
     * file that you want to delete.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message of 'Lecture file
     * deleted Successfully'.
     */
    public function deleteFile(string $lectureSlug, string $lectureFileId): JsonResponse {
        $lectureFile = LectureFile::leftJoin('lectures', 'lectures.id', 'lecture_files.lecture_id')
            ->leftJoin('courses', 'courses.id', 'lectures.course_id')
            ->select(['lecture_files.id'])
            ->where('courses.user_id', auth()->guard()->id())
            ->where('lectures.slug', $lectureSlug)
            ->where("lecture_files.hash_name", $lectureFileId)->first();
        if ($lectureFile) {
            $lectureFile->delete();
        }

        return $this->return(200, 'Lecture file deleted Successfully');
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
        $lecture = Lecture::select(['lectures.id'])->where("lectures.slug", $slug)->owned()->first();
        // Checking if the lecture not exists
        if (!$lecture) {
            return $this->return(400, 'Lecture not exists');
        }
        $lecture->delete();
        return $this->return(200, 'Lecture deleted Successfully');
    }

    /**
     * The function restores a deleted lecture by its slug and returns a JSON response indicating the
     * success or failure of the operation.
     * 
     * @param string slug The slug parameter is a string that represents the unique identifier for a
     * lecture. It is used to find the lecture in the database and perform operations on it.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function restore(string $slug): JsonResponse {
        $lecture = Lecture::select(['lectures.id'])->where("lectures.slug", $slug)->owned()->withTrashed()->first();
        // Checking if the lecture not exists
        if (!$lecture) {
            return $this->return(400, 'Lecture not exists');
        }
        $lecture->restore();
        return $this->return(200, 'Lecture deleted Successfully');
    }
}
