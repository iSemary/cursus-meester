<?php

use Illuminate\Support\Facades\Route;
use modules\Courses\Http\Controllers\Api\CertificateController;
use modules\Courses\Http\Controllers\Api\CourseController;
use modules\Courses\Http\Controllers\Api\LectureController;
use modules\Courses\Http\Controllers\Api\RateController;
use modules\Courses\Http\Controllers\Api\ExamController;
use modules\Courses\Http\Controllers\Api\ListController;
use modules\Courses\Http\Controllers\Api\SearchController;
use modules\Payments\Http\Controllers\Api\CartController;

// Administration Routes 
// TODO add admin middleware
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('courses/all', [CourseController::class, "all"]);
    Route::post('courses/change-status', [CourseController::class, "changeStatus"]);
});

// Builder Routes [For Instructors]
Route::group(['middleware' => 'auth:api'], function () {
    // Courses Routes
    Route::resource('courses', CourseController::class)->except(['edit']);
    // Course Lectures
    Route::get("courses/{courseSlug}/lectures", [LectureController::class, "getCourseLectures"]);
    // Lecture By Slug
    Route::get("courses/{courseSlug}/lectures/{lectureSlug}", [LectureController::class, "getCourseLecture"]);
    // Lectures Routes
    Route::delete("lecture-file/{lectureSlug}/{lectureFileId}", [LectureController::class, "deleteFile"]);
    Route::post("lectures/restore/{lectureSlug}", [LectureController::class, "restore"]);
    Route::apiResource('lectures', LectureController::class)->except(['edit', 'create']);
    // Exam Routes
    Route::group(['prefix' => 'exams'], function () {
        Route::get("{lectureSlug}", [ExamController::class, "getExamByLecture"]);
        Route::post("{lectureSlug}", [ExamController::class, "createOrUpdateExamByLecture"]);
        Route::delete("{examId}/questions/{questionId}", [ExamController::class, "deleteQuestion"]);
    });
});

/** Student Routes */
Route::group(['middleware' => 'auth:api'], function () {
    /** Certificate routes */
    Route::group(['prefix' => 'certificates'], function () {
        // Claim certificate [Generates new one if finished course]
        Route::post("{courseId}/claim", [CertificateController::class, "claimCertificate"]);
        // Get claimed certificate [Fetch exists one]
        Route::get("{courseId}/get", [CertificateController::class, "getCertificate"]);
    });

    /** Wishlist */
    Route::group(['prefix' => 'wishlist'], function () {
        // Get wishlist
        Route::get("/", [ListController::class, "getWishlist"]);
        // Add course into wishlist
        Route::post("/{courseId}", [ListController::class, "setWishlist"]);
        // Delete course from wishlist
        Route::delete("/{courseId}", [ListController::class, "deleteWishList"]);
        // Move course from wishlist to cart
        Route::post("{courseId}/move-cart", [ListController::class, "moveToCart"]);
    });

    // Get enrolled courses
    Route::get("my-courses", [ListController::class, "getEnrolledCourses"]);
    // Cart Routes
    Route::apiResource('cart', CartController::class)->except(['edit', 'create']);
    // Move course from cart to wishlist
    Route::post("cart/{courseId}/move-wishlist", [CartController::class, "moveToWishlist"]);
    // Submit Rate Route
    Route::post("courses/{courseSlug}/rate", [RateController::class, 'submitRate']);
});

// Public Routes
Route::get("courses/{courseSlug}/rates", [RateController::class, 'getRates']);
// Get certificate by reference code [Provide an existing certificate]
Route::get("certificates/{referenceCode}/provide", [CertificateController::class, "getCertificateByReferenceCode"]);
/** Search APIs */
Route::get("search", [SearchController::class, "search"]);
Route::get("search/tiny", [SearchController::class, "searchTiny"]);
