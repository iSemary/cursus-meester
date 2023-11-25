<?php

use Illuminate\Support\Facades\Route;
use modules\Organizations\Http\Controllers\Api\OrganizationController;


// Public routes
Route::get('organizations', [OrganizationController::class, 'index']);
// Administration routes
Route::group(['middleware' => ['auth:api', 'checkRole:super_admin']], function () {
    Route::apiResource('organizations', OrganizationController::class)->except(['index', 'edit', 'create']);
});

Route::get("organizations/{organizationSlug}/courses", [OrganizationController::class, "getCoursesBySlug"]);
