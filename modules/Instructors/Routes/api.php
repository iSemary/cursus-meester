<?php

use Illuminate\Support\Facades\Route;
use modules\Instructors\Http\Controllers\Api\ProfileController;

Route::group(['middleware' => 'auth:api', 'prefix' => 'instructor'], function () {
    Route::get('profile', [ProfileController::class, 'getProfile']);
    Route::post('profile', [ProfileController::class, 'updateProfile']);
});
