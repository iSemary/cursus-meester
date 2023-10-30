<?php

use Illuminate\Support\Facades\Route;
use Modules\Course\Http\Controllers\Api\CourseController;

Route::group(['middleware' => 'auth:api'], function () {
    Route::apiResource('courses', CourseController::class);
});
