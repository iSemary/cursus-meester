<?php

use Illuminate\Support\Facades\Route;
use modules\Wordings\Http\Controllers\Api\WordingController;

Route::group(['middleware' => ['auth:api', 'checkRole:super_admin']], function () {
    Route::get("wordings/generate", [WordingController::class, "generate"]);
    Route::resource('wordings', WordingController::class)->except(['edit', 'create']);
});
