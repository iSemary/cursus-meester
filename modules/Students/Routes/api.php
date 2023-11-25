<?php

use Illuminate\Support\Facades\Route;
use modules\Students\Http\Controllers\Api\ProfileController;

Route::group(['middleware' => 'auth:api', 'prefix' => 'student'], function () {
    Route::post('profile', [ProfileController::class, 'updateProfile']);
});

Route::get('student/{username}', [ProfileController::class, 'getProfile']);
