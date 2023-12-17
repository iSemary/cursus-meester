<?php

namespace App\Http\Controllers\Api;

use modules\Instructors\Entities\InstructorProfile;
use modules\Payments\Entities\Payout;
use stdClass;

class DashboardController extends ApiController {
    private $user;
    public function __construct() {
        $this->user = auth()->guard('api')->user();
    }
    public function index() {
        $response = new stdClass();
        // Collect cards counter
        $instructorProfile = InstructorProfile::whereUserId($this->user->id)->first();
        $response->counter = new stdClass();
        $response->counter->total_courses = $instructorProfile->total_courses;
        $response->counter->total_students = $instructorProfile->total_students;
        $response->counter->overall_rate = $instructorProfile->overall_rate;
        $response->counter->total_revenue = $this->getTotalRevenue();

        // Charts data
        $response->charts = new stdClass();
        $coursesCounter = InstructorProfile::getCoursesCounter($this->user->id);
        $response->charts->top_courses = new stdClass();
        $response->charts->top_courses->labels = $coursesCounter->pluck("title");
        $response->charts->top_courses->values = $coursesCounter->pluck("total_students");

        return $this->return(200, "Dashboard report fetched", ['response' => $response]);
    }

    private function getTotalRevenue(): float|null {
        return Payout::whereUserId($this->user->id)->sum("total_price");
    }
}
