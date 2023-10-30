<?php

use Illuminate\Support\Facades\Route;
use Modules\Categories\Http\Controllers\Api\CategoryController;


Route::group(['middleware' => 'auth:api'], function () {
    Route::apiResource('categories', CategoryController::class)->except(['edit', 'create']);
});
