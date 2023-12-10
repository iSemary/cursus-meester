<?php

use Illuminate\Support\Facades\Route;
use modules\Payments\Http\Controllers\Api\PaymentController;
use modules\Payments\Http\Controllers\Api\RedirectionController;

Route::middleware(["auth:api", "checkRole:student"])->prefix('payments')->group(function () {
    Route::post("purchase/course/{courseId}", [PaymentController::class, "purchaseCourse"]);
    Route::post("purchase/cart", [PaymentController::class, "purchaseCart"]);
});

Route::get("payments/success", [RedirectionController::class, "success"]);
Route::get("payments/cancel", [RedirectionController::class, "cancel"]);
Route::post("payments/callback", [RedirectionController::class, "callback"]);
