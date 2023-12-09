<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Exception\ApiErrorException;

class StripeController extends ApiController {
    private $stripe;

    public function __construct() {
        Stripe::setApiKey(env("STRIPE_SECRET_KEY"));
        $this->stripe = new \Stripe\StripeClient(env("STRIPE_SECRET_KEY"));
    }

    public function createOrder(array $orders): JsonResponse {
        try {
            $session = $this->stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => [
                    $orders
                ],
                'mode' => 'payment',
                'success_url' => env("APP_URL") . '/payment/success',
                'cancel_url' => env("APP_URL") . '/payment/cancel',
            ]);

            return $this->return(200, "Stripe successfully initiated", ['data', $session]);
        } catch (ApiErrorException $e) {
            return $this->return(500, "Something went wrong!", debug: $e->getMessage());
        }
    }
}
