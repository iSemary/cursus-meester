<?php

// Administration Routes 
// TODO add admin middleware

use Illuminate\Support\Facades\Route;
use modules\Wordings\Http\Controllers\Api\WordingController;

Route::group(['middleware' => 'auth:api'], function () {
    Route::resource('wordings', WordingController::class)->except(['edit', 'create']);
});
