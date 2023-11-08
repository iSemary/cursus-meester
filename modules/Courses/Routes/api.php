<?php

use Illuminate\Support\Facades\Route;
use modules\Courses\Http\Controllers\Api\CourseController;
use modules\Courses\Http\Controllers\Api\RateController;

Route::group(['middleware' => 'auth:api'], function () {
    Route::apiResource('courses', CourseController::class)->except(['edit', 'create']);

    // Rate Routes
    Route::post("courses/{courseSlug}/rate", [RateController::class, 'submitRate']);
});
Route::get("courses/{courseSlug}/rates", [RateController::class, 'getRates']);
