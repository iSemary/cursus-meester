<?php

use Illuminate\Support\Facades\Route;
use modules\Courses\Http\Controllers\Api\CourseController;

Route::group(['middleware' => 'auth:api'], function () {
    Route::apiResource('courses', CourseController::class)->except(['edit', 'create']);
});
