<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;

class NotificationController extends ApiController {
    /**
     * The index function retrieves a paginated list of notifications for the authenticated user and
     * returns it as a JSON response.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a message of "Notification fetched
     * successfully", and an array containing the paginated list of notifications.
     */
    public function index(): JsonResponse {
        $notifications = Notification::whereUserId(auth()->guard('api')->id())->selectList()->paginate(10);
        return $this->return(200, "Notification fetched successfully", ['notifications' => $notifications]);
    }

    /**
     * The function updates a notification's "seen" status to 1 and returns a JSON response indicating
     * that the notification has been marked as seen.
     * 
     * @param int notificationId The parameter `notificationId` is an integer that represents the ID of
     * the notification that needs to be marked as seen.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message "Notification marked
     * as seen".
     */
    public function seen(int $notificationId): JsonResponse {
        Notification::where("id", $notificationId)->whereUserId(auth()->guard('api')->id())->update(['read_at' => now()]);
        return $this->return(200, "Notification marked as seen");
    }
}
