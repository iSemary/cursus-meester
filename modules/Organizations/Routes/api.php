<?php

use Illuminate\Support\Facades\Route;
use modules\Organizations\Http\Controllers\Api\OrganizationController;


Route::group(['middleware' => 'auth:api'], function () {
    Route::apiResource('organizations', OrganizationController::class)->except(['edit', 'create']);
});

Route::get("organizations/{organizationSlug}/courses", [OrganizationController::class, "getCoursesBySlug"]);
