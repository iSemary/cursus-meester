<?php

use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;
use modules\Instructors\Http\Controllers\Api\ProfileController;

Route::group(['middleware' => ['auth:api', 'checkRole:instructor'], 'prefix' => 'instructor'], function () {
    Route::post('profile', [ProfileController::class, 'updateProfile']);
});

// Reports routes
Route::group(['middleware' => ['auth:api', 'checkRole:instructor']], function () {
    Route::get('dashboard/index', [DashboardController::class, "index"]);
});

// Public Route
Route::get('instructor/{username}', [ProfileController::class, 'getProfile']);
