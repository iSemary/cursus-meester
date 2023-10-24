<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;



Route::post("register", [AuthController::class, "register"]);
Route::post("login", [AuthController::class, "login"]);

Route::post('auth/token', 'Api\AuthController@authenticate');
Route::post('auth/refresh', 'Api\AuthController@refreshToken');

Route::group(['middleware' => 'auth:api'], function () {
    Route::post("logout", [AuthController::class, "logout"]);
});
