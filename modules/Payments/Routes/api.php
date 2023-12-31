<?php

use Illuminate\Support\Facades\Route;
use modules\Payments\Http\Controllers\Api\PaymentController;
use modules\Payments\Http\Controllers\Api\PaypalController;
use modules\Payments\Http\Controllers\Api\RedirectionController;
use modules\Payments\Http\Controllers\Api\StripeController;

Route::middleware(["auth:api", "checkRole:student"])->prefix('payments')->group(function () {
    Route::post("purchase/course/{courseId}", [PaymentController::class, "purchaseCourse"]);
    Route::post("purchase/cart", [PaymentController::class, "purchaseCart"]);
    Route::any("check/{referenceNumber}", [PaymentController::class, "checkPayment"]);

    Route::get("history", [PaymentController::class, "history"]);
});

Route::middleware(["auth:api", "checkRole:instructor"])->prefix('payments')->group(function () {
    Route::get("payout/details", [PaymentController::class, "payoutDetails"]);
    Route::post("payout", [PaymentController::class, "payout"]);
    Route::get("payout/history", [PaymentController::class, "payoutHistory"]);
});

Route::get("payments/success", [RedirectionController::class, "success"]);
Route::get("payments/cancel", [RedirectionController::class, "cancel"]);

Route::post("payments/stripe/callback", [StripeController::class, "callback"]);

Route::get("payments/paypal/check-status/{referenceNumber}", [PaypalController::class, "checkStatus"]);
