<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Utilities\CountryController;
use App\Http\Controllers\Api\Utilities\CurrencyController;
use App\Http\Controllers\Api\Utilities\LanguageController;
use App\Http\Controllers\Api\IndustryController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;


/* User Authentication Routes */

Route::group(['prefix' => 'auth'], function () {
    // Registration Routes
    Route::post("register", [AuthController::class, "register"]);
    Route::post("login", [AuthController::class, "login"]);
    // Password Validation Routes
    Route::post("forget-password", [AuthController::class, "forgetPassword"]);
    Route::post("reset-password", [AuthController::class, "resetPassword"]);
    // Verification Routes
    Route::get("verify/email/{token}", [AuthController::class, "verifyEmail"]);

    Route::group(['middleware' => 'auth:api'], function () {
        // Check Authentication
        Route::get("check", [AuthController::class, "checkAuthentication"]);
        // Get authenticated user details
        Route::get("user", [AuthController::class, "getUser"]);
        // Logout / Logout All Devices
        Route::post("logout", [AuthController::class, "logout"]);
        // Verification Routes
        Route::post("send/otp", [AuthController::class, "sendOTP"]);
        Route::post("verify/otp", [AuthController::class, "verifyOTP"]);
        // Send Email Verification
        Route::post("send/verify/email", [AuthController::class, "sendVerifyEmail"]);
        // Get Login Attempt
        Route::get('attempts', [AuthController::class, "attempts"]);
        // Change password [From settings]
        Route::post('update-password', [UserController::class, "updatePassword"]);
        // toggle 2 factor authenticate [From settings]
        Route::post('toggle-factor-authenticate', [UserController::class, "toggleFactorAuthenticate"]);
        // deactivate account [From settings]
        Route::post('deactivate', [UserController::class, "deactivate"]);
    });
});


// Authenticated routes
Route::group(['middleware' => 'auth:api'], function () {
    Route::apiResource('industries', IndustryController::class);
    Route::apiResource('countries', CountryController::class);
    Route::apiResource('currencies', CurrencyController::class);
    Route::apiResource('languages', LanguageController::class);

    // Profile Routes
    Route::get("user/profile", [UserController::class, "getUserDetails"]);
});

// Public routes
Route::apiResource('industries', IndustryController::class)->only(['index', 'show']);
Route::apiResource('countries', CountryController::class)->only(['index', 'show']);
Route::apiResource('currencies', CurrencyController::class)->only(['index', 'show']);
Route::apiResource('languages', LanguageController::class)->only(['index', 'show']);


/* Landing Page APIs */
// Newsletter
Route::group(['prefix' => 'newsletter'], function () {
    Route::post("subscribe", [NewsletterController::class, "subscribe"]);
    Route::post("un-subscribe", [NewsletterController::class, "unSubscribe"]);
});
