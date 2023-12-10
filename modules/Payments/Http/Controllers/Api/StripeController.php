<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Payments\Entities\PaymentTransaction;
use modules\Payments\Entities\StripeLog;
use modules\Payments\Interfaces\PaymentStatues;
use Stripe\Stripe;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;
use Stripe\WebhookEndpoint;

class StripeController extends ApiController {
    private StripeClient $stripe;
    private array $payload;
    private int $paymentTransactionId;

    private string $successURL;
    private string $cancelURL;
    private string $webhookURL;
    private array $allowedPaymentTypes = ["card"];

    private string $successStatus = "paid";
    private string $failedStatus = "failed";

    public function __construct() {
        Stripe::setApiKey(env("STRIPE_SECRET_KEY"));
        $this->stripe = new \Stripe\StripeClient(env("STRIPE_SECRET_KEY"));

        $this->successURL = env("APP_URL") . '/api/v1.0/payments/success';
        $this->cancelURL = env("APP_URL") . '/api/v1.0/payments/cancel';
        $this->webhookURL = 'https://fd63-196-158-195-231.ngrok-free.app/api/v1.0/payments/callback';
    }

    /**
     * The `init` function initializes a payment transaction with a given ID and an array of orders,
     * prepares the order payload, and creates the order.
     * 
     * @param int paymentTransactionId The paymentTransactionId is an integer that represents the unique
     * identifier for a payment transaction. It is used to associate the payment transaction with the
     * created order.
     * @param array orders An array of orders. Each order is represented as an associative array with the
     * following keys:
     * 
     */
    public function init(int $paymentTransactionId, array $orders) {
        $this->paymentTransactionId = $paymentTransactionId;

        $this->prepareOrderPayload($orders);
        return $this->createOrder();
    }

    /**
     * The function prepares the payload for a Stripe payment by looping over an array of orders and
     * appending the required product details for each order.
     * 
     * @param array orders An array of order items, where each item contains the following properties:
     */
    private function prepareOrderPayload(array $orders): void {
        $preparedOrder = [];
        // Loop over each course item and append the required product details
        foreach ($orders as $order) {
            $preparedOrder[] = [
                'price_data' => [
                    'currency' => 'usd',
                    'unit_amount' => $order['price'] * 100,
                    'product_data' => [
                        'name' => $order['name'],
                        'description' => $order['description']
                    ]
                ],
                'quantity' => 1
            ];
        }
        // Prepare payload for stripe
        $payload = [
            'payment_method_types' => $this->allowedPaymentTypes,
            'line_items' => [
                $preparedOrder
            ],
            'mode' => 'payment',
            'success_url' => $this->successURL,
            'cancel_url' => $this->cancelURL,
        ];

        $this->payload = $payload;
    }



    /**
     * The function updates the transaction number of a payment transaction with the value from a session
     * object.
     * 
     * @param object session The `` parameter is an object that contains information about the
     * current session.
     */
    private function updateTransactionId(object $session): void {
        PaymentTransaction::whereId($this->paymentTransactionId)->update([
            'transaction_number' => $session['id']
        ]);
    }

    /**
     * The logRequest function logs a Stripe payment request with the transaction number, status, payload,
     * and response.
     * 
     * @param array payload The `` parameter is an array that contains the data related to the
     * request being logged. It could include information such as the customer's details, the payment
     * amount, and any other relevant data.
     * @param object|array response The `response` parameter is an object that contains the response data
     * received from a Stripe API request. It is expected to have an `id` property, which represents the
     * transaction number associated with the payment.
     */
    private function logRequest(array $payload, array|object $response): void {
        StripeLog::create([
            'transaction_number' => $response['id'],
            'status' => PaymentStatues::PENDING,
            'payload' => serialize($payload),
            'response' => serialize($response),
        ]);
    }

    public function callback(array $notification): void {
        $transactionNumber = $notification['data']['object']['id'];

        $status = PaymentStatues::EXPIRED;
        if ($notification['data']['object']['payment_status'] == $this->successStatus) {
            $status = PaymentStatues::SUCCESS;
        }

        (new PaymentController)->changeStatus($transactionNumber, $status);

        $this->logNotification($transactionNumber, $notification, $status);
    }


    private function logNotification(string $transactionNumber, array $notification, int $status): void {
        StripeLog::where("transaction_number", $transactionNumber)->update([
            'status' => $status,
            'notification' => serialize($notification)
        ]);
    }

    /**
     * The function creates a Stripe order, sets up a webhook endpoint, and returns a JSON response with
     * the session data.
     * 
     * @return JsonResponse The `createOrder()` function returns a `JsonResponse` object.
     */
    public function createOrder(): JsonResponse {
        try {
            WebhookEndpoint::create([
                'url' => $this->webhookURL,
                'enabled_events' => [
                    'charge.succeeded',
                    'charge.failed',
                ],
            ]);
            $session = $this->stripe->checkout->sessions->create([$this->payload]);

            $this->updateTransactionId($session);
            $this->logRequest($this->payload, $session);

            $paymentLink = $session['url'];

            return $this->return(200, "Payment link generated successfully", ['payment_link' => $paymentLink]);
        } catch (ApiErrorException $e) {
            return $this->return(500, "Something went wrong!", debug: $e->getMessage());
        }
    }
}
