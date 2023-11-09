<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use modules\Courses\Entities\Course;
use modules\Courses\Entities\Rate;
use modules\Courses\Http\Requests\Rate\CreateRateRequest;

class RateController extends ApiController {
    /**
     * The function retrieves the rates for a specific course and returns them in a JSON response.
     * 
     * @param string courseSlug The courseSlug parameter is a string that represents the unique identifier
     * or slug of a course. It is used to retrieve the rates associated with that particular course.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function getRates(string $courseSlug): JsonResponse {
        $course = Course::where("slug", $courseSlug)->firstOrFail();
        $rates = $course->rate;

        return $this->return(200, "Rate fetched successfully", ['rates' => $rates]);
    }

    /**
     * The function submits a rate for a course, updating or creating a new rate based on the user id and
     * course id.
     * 
     * @param CreateRateRequest createRateRequest An instance of the CreateRateRequest class, which
     * contains the rate and comment values submitted by the user.
     * @param string courseSlug The `courseSlug` parameter is a string that represents the unique
     * identifier (slug) of a course. It is used to find the course in the database based on its slug
     * value.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message "Rate submitted
     * successfully".
     */
    public function submitRate(CreateRateRequest $createRateRequest, string $courseSlug): JsonResponse {
        $course = Course::where("slug", $courseSlug)->firstOrFail();
        // Update or create the rate based on the user id and the course id
        Rate::updateOrCreate(
            [
                'user_id' => auth()->guard('api')->id(),
                'course_id' => $course->id
            ],
            [
                'rate' => $createRateRequest->rate,
                'comment' => $createRateRequest->comment,
            ]
        );

        return $this->return(200, "Rate submitted successfully");
    }
}
