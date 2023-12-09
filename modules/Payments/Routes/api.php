<?php

use Illuminate\Support\Facades\Route;
use modules\Payments\Http\Controllers\Api\PaymentController;

Route::middleware(["auth:api", "checkRole:student"])->prefix('payments')->group(function () {
    Route::post("purchase/course/{courseId}", [PaymentController::class, "purchaseCourse"]);
    Route::post("purchase/cart", [PaymentController::class, "purchaseCart"]);


});
