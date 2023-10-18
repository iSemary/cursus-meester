<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;



Route::post("register", [AuthController::class, "register"]);
