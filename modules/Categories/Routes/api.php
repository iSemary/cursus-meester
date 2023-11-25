<?php

use Illuminate\Support\Facades\Route;
use modules\Categories\Http\Controllers\Api\CategoryController;

// Public routes
Route::get('categories', [CategoryController::class, "index"]);
// Administration routes
Route::group(['middleware' => ['auth:api', 'checkRole:super_admin']], function () {
    Route::apiResource('categories', CategoryController::class)->except(['index', 'edit', 'create']);
});
