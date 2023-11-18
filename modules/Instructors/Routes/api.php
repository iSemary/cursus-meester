<?php

use Illuminate\Support\Facades\Route;
use modules\Instructors\Http\Controllers\Api\ProfileController;

Route::group(['middleware' => 'auth:api', 'prefix' => 'instructor'], function () {
    Route::post('profile', [ProfileController::class, 'updateProfile']);
});
// Public Route
Route::get('instructor/{username}', [ProfileController::class, 'getProfile']);
