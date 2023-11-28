<?php

use Illuminate\Support\Facades\Route;
use modules\Chats\Http\Controllers\Api\ChatController;

Route::middleware(['auth:api'])->prefix('chat')->group(function () {
    Route::get("conversations", [ChatController::class, "conversations"]);
    Route::get("conversations/{id}/messages", [ChatController::class, "messages"]);

    Route::post("initiate", [ChatController::class, "initiate"]);
    Route::post("send", [ChatController::class, "send"]);
    Route::post("conversations/{id}/seen", [ChatController::class, "seen"]);
});
