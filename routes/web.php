<?php

use App\Http\Controllers\AppController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\FacebookController;
use App\Http\Controllers\Auth\LinkedinController;


/**
 * Socialite Routes
 */
$socialMediaRoutes = [
    'google' => GoogleController::class,
    'facebook' => FacebookController::class,
    'linkedin' => LinkedinController::class,
];
foreach ($socialMediaRoutes as $platform => $controller) {
    Route::get("/auth/$platform", [$controller, 'redirect']);
    Route::get("/auth/$platform/callback", [$controller, 'callback']);
}

Route::group(['middleware' => ['auth:api', 'checkRole:super_admin']], function () {
    Route::get('logs', [\Rap2hpoutre\LaravelLogViewer\LogViewerController::class, 'index']);
});

// This route will redirect you to app blade [Which contains the build of nextJS project]  
// Route::get('/{any}', [AppController::class, "index"])->where('any', '.*');
