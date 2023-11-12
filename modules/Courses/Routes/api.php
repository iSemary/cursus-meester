<?php

use Illuminate\Support\Facades\Route;
use modules\Courses\Http\Controllers\Api\CourseController;
use modules\Courses\Http\Controllers\Api\LectureController;
use modules\Courses\Http\Controllers\Api\RateController;

Route::group(['middleware' => 'auth:api'], function () {
    // Courses Routes
    Route::resource('courses', CourseController::class)->except(['edit']);
    // Course Lectures
    Route::get("courses/{courseSlug}/lectures", [LectureController::class, "getCourseLectures"]);
    // Lecture By Slug
    Route::get("courses/{courseSlug}/lectures/{lectureSlug}", [LectureController::class, "getCourseLecture"]);
    // Lectures Routes
    Route::delete("lecture-file/{lectureSlug}/{lectureFileId}", [LectureController::class, "deleteFile"]);
    Route::apiResource('lectures', LectureController::class)->except(['edit', 'create']);
    // Submit Rate Route
    Route::post("courses/{courseSlug}/rate", [RateController::class, 'submitRate']);
});

Route::get("courses/{courseSlug}/rates", [RateController::class, 'getRates']);
