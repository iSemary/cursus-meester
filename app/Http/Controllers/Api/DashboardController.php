<?php

namespace App\Http\Controllers\Api;

use modules\Instructors\Entities\InstructorProfile;
use stdClass;

class DashboardController extends ApiController {
    public function index() {
        $response = new stdClass();
        $user = auth()->guard('api')->user();
        // Collect cards counter
        $instructorProfile = InstructorProfile::whereUserId($user->id)->first();
        $response->counter = new stdClass();
        $response->counter->total_courses = $instructorProfile->total_courses;
        $response->counter->total_students = $instructorProfile->total_students;
        $response->counter->overall_rate = 2.5;
        $response->counter->total_revenue = 100000;

        // Charts data
        $response->charts = new stdClass();
        $coursesCounter = InstructorProfile::getCoursesCounter($user->id);
        $response->charts->top_courses = new stdClass();
        $response->charts->top_courses->labels = $coursesCounter->pluck("title");
        $response->charts->top_courses->values = $coursesCounter->pluck("total_students");

        return $this->return(200, "Dashboard report fetched", ['response' => $response]);
    }
}
