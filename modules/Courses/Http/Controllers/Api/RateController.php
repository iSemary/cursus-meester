<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use modules\Courses\Entities\Course;
use modules\Courses\Entities\Rate;
use modules\Courses\Http\Requests\Rate\CreateRateRequest;

class RateController extends ApiController {

    public function getRates(string $courseSlug): JsonResponse {
        $course = Course::where("slug", $courseSlug)->firstOrFail();
        $rates = $course->rate;

        return $this->return(200, "Rate fetched successfully", ['rates' => $rates]);
    }

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
