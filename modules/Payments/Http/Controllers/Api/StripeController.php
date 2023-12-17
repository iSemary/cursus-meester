<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Payments\Entities\PaymentTransaction;
use modules\Payments\Entities\PaymentTransactionItem;
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

    private string $referenceNumber;

    private string $successURL;
    private string $cancelURL;
    private string $webhookURL;
    private array $allowedPaymentTypes = ["card"];

    private string $successStatus = "paid";
    private string $failedStatus = "failed";

    public function __construct() {
        Stripe::setApiKey(env("STRIPE_SECRET_KEY"));
        $this->stripe = new \Stripe\StripeClient(env("STRIPE_SECRET_KEY"));
        $this->webhookURL = env("APP_URL") . '/api/v1.0/payments/stripe/callback';
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
    public function init(int $paymentTransactionId, string $referenceNumber, array $orders) {
        $this->paymentTransactionId = $paymentTransactionId;
        $this->referenceNumber = $referenceNumber;

        $this->successURL = env("APP_URL") . '/api/v1.0/payments/success?reference_number=' . $this->referenceNumber;
        $this->cancelURL = env("APP_URL") . '/api/v1.0/payments/cancel?reference_number=' . $this->referenceNumber;

        $this->prepareOrderPayload($orders);
        return $this->createOrder($referenceNumber);
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
            'line_items' => [$preparedOrder],
            'client_reference_id' => $this->referenceNumber,
            'payment_intent_data' => ['metadata' => ['reference_number' => $this->referenceNumber]],
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
            'reference_number' => $this->referenceNumber,
            'status' => PaymentStatues::PENDING,
            'payload' => serialize($payload),
            'response' => serialize($response),
        ]);
    }


    /**
     * The function checks if a webhook endpoint with a specific URL already exists.
     * 
     * @return bool a boolean value indicating whether a webhook with the specified URL exists or not.
     */
    public function checkForExistingWebhooks(): bool {
        $existingEndpoints = \Stripe\WebhookEndpoint::all();
        $webhookExists = false;
        foreach ($existingEndpoints as $endpoint) {
            if ($endpoint->url === $this->webhookURL) {
                $webhookExists = true;
                break;
            }
        }
        return $webhookExists;
    }

    /**
     * The function `appendWebhook` creates a new webhook endpoint with a specified URL and enabled events.
     */
    public function appendWebhook(): void {
        WebhookEndpoint::create([
            'url' => $this->webhookURL,
            'enabled_events' => [
                'charge.succeeded',
                'charge.failed',
            ],
        ]);
    }

    /**
     * The function receives a callback request, extracts relevant data from the request, changes the
     * payment transaction status based on the callback, and if the status is successful, enrolls the user
     * in the corresponding courses.
     * 
     * @param Request request The `` parameter is an instance of the `Illuminate\Http\Request`
     * class. It represents an incoming HTTP request and contains information such as the request method,
     * headers, and payload.
     * 
     * @return JsonResponse a JsonResponse with a success status code of 200.
     */
    public function callback(Request $request): JsonResponse {
        $notification = $request->all();
        $referenceNumber = $notification['data']['object']['metadata']['reference_number'];
        $status = PaymentStatues::FAILED;

        if ($notification['data']['object']['paid']) {
            $status = PaymentStatues::SUCCESS;
        }
        // Change payment transaction status to success or fail based on callback 
        (new PaymentController)->changeStatus($referenceNumber, $status);
        // if the callback returned success status, then add the payment transaction items into enrolled course
        if ($status == PaymentStatues::SUCCESS) {
            $paymentTransaction = PaymentTransaction::where("reference_number", $referenceNumber)->first();
            $coursesId = PaymentTransactionItem::where("payment_transaction_id", $paymentTransaction->id)->pluck("course_id")->toArray();
            $userId = $paymentTransaction->user_id;
            (new PaymentController)->enrollCourses($coursesId, $userId);
            (new PaymentController)->addToPayouts($paymentTransaction->id);
            (new PaymentController)->pushNotification($userId, $paymentTransaction->id);
        }

        $this->logNotification($referenceNumber, $notification, $status);

        return response()->json(['success' => true], 200);
    }


    /**
     * The logNotification function updates the status and notification fields of a StripeLog entry with
     * the given reference number.
     * 
     * @param string referenceNumber The reference number is a string that is used to identify a specific
     * Stripe log entry. It is used to query the StripeLog table and find the corresponding log entry to
     * update.
     * @param array notification The `` parameter is an array that contains information about
     * the notification. It is being serialized using the `serialize()` function before being stored in the
     * database.
     * @param int status The status parameter is an integer that represents the status of the notification.
     * It is used to update the 'status' field in the StripeLog table.
     */
    private function logNotification(string $referenceNumber, array $notification, int $status): void {
        StripeLog::where("reference_number", $referenceNumber)->update([
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
    public function createOrder(string $referenceNumber): JsonResponse {
        try {
            if (!$this->checkForExistingWebhooks()) {
                $this->appendWebhook();
            }
            $session = $this->stripe->checkout->sessions->create([$this->payload]);

            $this->updateTransactionId($session);
            $this->logRequest($this->payload, $session);

            $paymentLink = $session['url'];

            return $this->return(200, "Payment link generated successfully", ['payment_link' => $paymentLink, 'reference_number' => $referenceNumber]);
        } catch (ApiErrorException $e) {
            return $this->return(500, "Something went wrong!", debug: $e->getMessage());
        }
    }
}
