<?php

namespace App\Http\Controllers\Api;

use stdClass;

class DashboardController extends ApiController {
    public function index() {
        $response = new stdClass();

        $response->total_courses = 50;
        $response->total_students = 500000;
        $response->overall_rate = 500000;
        $response->total_revenue = 100000;

        return $this->return(200, "Dashboard report fetched", ['response' => $response]);
    }
}
