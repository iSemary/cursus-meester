<?php

use Illuminate\Support\Facades\Route;
use modules\Courses\Http\Controllers\Api\CourseController;
use modules\Courses\Http\Controllers\Api\LectureController;
use modules\Courses\Http\Controllers\Api\RateController;

Route::group(['middleware' => 'auth:api'], function () {
    // Courses Routes
    Route::resource('courses', CourseController::class)->except(['edit']);
    // Course Lectures
    Route::get("courses/{slug}/lectures", [LectureController::class, "getCourseLectures"]);
    // Lectures Routes
    Route::apiResource('lectures', LectureController::class)->except(['edit', 'create']);
    // Submit Rate Route
    Route::post("courses/{courseSlug}/rate", [RateController::class, 'submitRate']);
});

Route::get("courses/{courseSlug}/rates", [RateController::class, 'getRates']);
