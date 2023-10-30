<?php

use Illuminate\Support\Facades\Route;
use Modules\Categories\Http\Controllers\Api\OrganizationController;


Route::group(['middleware' => 'auth:api'], function () {
    Route::apiResource('organizations', OrganizationController::class)->except(['edit', 'create']);
});
