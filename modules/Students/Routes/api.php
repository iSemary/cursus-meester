<?php

use Illuminate\Support\Facades\Route;
use modules\Students\Http\Controllers\Api\ProfileController;

Route::group(['middleware' => 'auth:api', 'prefix' => 'student'], function () {
    Route::get('profile', [ProfileController::class, 'getProfile']);
    Route::post('profile', [ProfileController::class, 'updateProfile']);
});
