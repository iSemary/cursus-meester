<?php

use Illuminate\Support\Facades\Route;
use modules\Payments\Http\Controllers\Api\CartController;
use modules\Courses\Http\Controllers\Api\{
    CertificateController,
    CourseController,
    LectureController,
    RateController,
    ExamController,
    ListController,
    SearchController,
    ResourceController,
};

// Administration Routes 
Route::group(['middleware' => ['auth:api', 'checkRole:super_admin']], function () {
    Route::get('courses/all', [CourseController::class, "all"]);
    Route::post('courses/change-status', [CourseController::class, "changeStatus"]);
});

// Builder Routes [For Instructors]
Route::group(['middleware' => ['auth:api', 'checkRole:instructor']], function () {
    // Courses Routes
    Route::resource('courses', CourseController::class)->except(['edit']);
    Route::get("courses/modify/{courseSlug}", [CourseController::class, "getForModify"]);
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
    Route::get("exam-results", [ExamController::class, "getResults"]);
    Route::get("exam-results/{id}", [ExamController::class, "getExamResult"]);
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

    /**
     *  Requesting a resource file for ex: [lecture media file, lecture additional file, exam]
     */
    Route::get("resources/course/{courseId}/lecture/{fileId}", [ResourceController::class, "lecture"]);
    Route::get("resources/course/{courseId}/file/{fileId}", [ResourceController::class, "file"]);
    Route::get("resources/course/{courseId}/exam/{fileId}", [ResourceController::class, "exam"]);
    Route::get("resources/blob", [ResourceController::class, "returnBlob"]);

    // Get enrolled courses
    Route::get("my-courses", [ListController::class, "getEnrolledCourses"]);
    // Cart Routes
    Route::apiResource('cart', CartController::class)->except(['edit', 'create']);
    // Move course from cart to wishlist
    Route::post("cart/{courseId}/move-wishlist", [CartController::class, "moveToWishlist"]);
    // Submit Rate Route
    Route::post("courses/{courseSlug}/rate", [RateController::class, 'submitRate']);
    // Mark lecture video as watched
    Route::get("lectures/view/{id}", [LectureController::class, "markViewed"]);
});

/**  Public Routes */

/**
 * Course Details Page
 */
Route::get("courses/{courseSlug}", [CourseController::class, "show"]);

// Rate Course
Route::get("courses/{courseSlug}/rates", [RateController::class, 'getRates']);
// Get certificate by reference code [Provide an existing certificate]
Route::get("certificates/{referenceCode}/provide", [CertificateController::class, "getCertificateByReferenceCode"]);
/** Search APIs */
Route::get("search", [SearchController::class, "search"]);
Route::get("search/tiny", [SearchController::class, "searchTiny"]);
