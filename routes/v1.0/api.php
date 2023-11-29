<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\Utilities\CountryController;
use App\Http\Controllers\Api\Utilities\CurrencyController;
use App\Http\Controllers\Api\Utilities\LanguageController;
use App\Http\Controllers\Api\IndustryController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;
use modules\Categories\Http\Controllers\Api\CategoryController;

/**
 * Please note that file doesn't contain all the APIs on the application
 * There's also another APIs exists in each module for ex:
 * modules/courses/routes/api.php
 * modules/payments/routes/api.php
 */

// Home API
Route::get("/", [HomeController::class, "index"]);
/* User Authentication Routes */
Route::group(['prefix' => 'auth'], function () {
    // Registration Routes
    Route::post("register", [AuthController::class, "register"]);
    Route::post("register/instructor", [AuthController::class, "registerAsInstructor"]);
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
        // Join as instructor
        Route::post("join/instructor", [AuthController::class, "joinAsInstructor"]);
        // deactivate account [From settings]
        Route::post('deactivate', [UserController::class, "deactivate"]);
    });
});

// Administration routes
Route::group(['middleware' => ['auth:api', 'checkRole:super_admin']], function () {
    Route::apiResource('industries', IndustryController::class)->except(['index', 'show']);
    Route::apiResource('countries', CountryController::class)->except(['index', 'show']);
    Route::apiResource('currencies', CurrencyController::class)->except(['index', 'show']);
    Route::apiResource('languages', LanguageController::class)->except(['index', 'show']);
});

// Authenticated routes
Route::group(['middleware' => 'auth:api'], function () {
    // Profile Route
    Route::get("user/profile", [UserController::class, "getUserDetails"]);
    // Notification
    Route::get("notifications", [NotificationController::class, "index"]);
    Route::post("notifications/{id}/seen", [NotificationController::class, "seen"]);
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
