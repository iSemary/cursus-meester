<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Newsletter\SubscribeRequest;
use App\Http\Requests\Newsletter\UnSubscribeRequest;
use App\Models\Newsletter;
use Illuminate\Http\JsonResponse;

class NewsletterController extends ApiController {

    /**
     * The `subscribe` function creates a new entry in the Newsletter table using the validated data from
     * the SubscribeRequest and returns a JSON response indicating successful subscription.
     * 
     * @param SubscribeRequest subscribeRequest An instance of the SubscribeRequest class, which is a
     * request object containing the data needed to subscribe to a newsletter.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function subscribe(SubscribeRequest $subscribeRequest): JsonResponse {
        Newsletter::create($subscribeRequest->validated());
        return $this->return(200, "Subscribed to newsletter successfully");
    }


    /**
     * The function unSubscribe() deletes a record from the Newsletter table based on the provided email and
     * returns a success message.
     * 
     * @param UnSubscribeRequest unSubscribeRequest An object of type UnSubscribeRequest, which contains
     * the email of the user who wants to unsubscribe from the newsletter.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function unSubscribe(UnSubscribeRequest $unSubscribeRequest): JsonResponse {
        Newsletter::where('email', $unSubscribeRequest->email)->delete();
        return $this->return(200, "Unsubscribed from newsletter successfully");
    }
}
