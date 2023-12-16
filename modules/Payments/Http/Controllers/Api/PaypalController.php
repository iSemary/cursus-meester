<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use modules\Payments\Entities\PaymentTransaction;
use modules\Payments\Entities\PaymentTransactionItem;
use modules\Payments\Entities\PaypalLog;
use modules\Payments\Interfaces\PaymentStatues;

class PaypalController extends ApiController {
    private array $payload;
    private int $paymentTransactionId;

    private string $endpointURL;

    private string $clientID;
    private string $clientSecret;

    private string $referenceNumber;
    private string $accessToken;

    private string $successURL;
    private string $cancelURL;

    private string $successStatus = "APPROVED";
    private string $failedStatus = "failed";

    public function __construct() {
        $this->endpointURL = "https://api-m.sandbox.paypal.com/";
        $this->clientID = env("PAYPAL_CLIENT_ID");
        $this->clientSecret = env("PAYPAL_CLIENT_SECRET");
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

        $this->successURL = env("APP_URL") . '/api/v1.0/payments/paypal/check-status/' . $this->referenceNumber;
        $this->cancelURL = env("APP_URL") . '/api/v1.0/payments/paypal/check-status/' . $this->referenceNumber;

        $this->generateAccessToken();

        $this->prepareOrderPayload($orders);
        return $this->createOrder($referenceNumber);
    }

    /**
     * The function generates an access token using client credentials and returns an error message if the
     * request is unsuccessful.
     * 
     * @return If the response is successful, the access token is being returned. If the response is not
     * successful, the status code and error message are being returned.
     */
    public function generateAccessToken() {
        $body = ['grant_type' => 'client_credentials'];
        $response = Http::asForm()->withBasicAuth($this->clientID, $this->clientSecret)->post($this->endpointURL . 'v1/oauth2/token', $body);

        if ($response->successful()) {
            $data = $response->json();
            $this->accessToken = $data['access_token'];
        } else {
            $statusCode = $response->status();
            $errorMessage = $response->body();
            return $this->return($statusCode, $errorMessage);
        }
    }


    /**
     * The function prepares the payload for a PayPal order by calculating the total price and formatting
     * the order details.
     * 
     * @param array orders An array of orders, where each order has the following properties:
     */
    private function prepareOrderPayload(array $orders): void {
        $preparedOrder = [];
        $totalPrice = 0;

        // Loop over each course item and append the required product details
        foreach ($orders as $order) {
            $preparedOrder[] = [
                'name' => $order['name'],
                'description' => $order['description'],
                'quantity' => "1",
                "unit_amount" => [
                    "currency_code" => "USD",
                    "value" => $order['price']
                ]
            ];

            $totalPrice += $order['price'];
        }

        // Prepare payload for paypal
        $payload = [
            'intent' => "CAPTURE",
            'purchase_units' => [[
                "items" => $preparedOrder,
                "amount" => [
                    "currency_code" => "USD",
                    "value" => $totalPrice,
                    "breakdown" => [
                        "item_total" => [
                            "currency_code" => "USD",
                            "value" => $totalPrice
                        ]
                    ]
                ]
            ]],
            "application_context" => [
                "return_url" => $this->successURL,
                "cancel_url" => $this->cancelURL,
            ]
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
            'transaction_number' => $session->id
        ]);
    }


    /**
     * The logRequest function logs a PayPal transaction by creating a new entry in the PaypalLog table
     * with the transaction number, status, payload, and response.
     * 
     * @param array payload The `` parameter is an array that contains the data related to the
     * request being logged. It could include information such as the user's details, the payment amount,
     * and any other relevant data.
     * @param object response The `response` parameter is an array or object that contains the response
     * data from a PayPal transaction. It typically includes information such as the transaction ID,
     * status, and other relevant details.
     */
    private function logRequest(array $payload, array|object $response): void {
        PaypalLog::create([
            'transaction_number' => $response->id,
            'status' => PaymentStatues::PENDING,
            'payload' => serialize($payload),
            'response' => serialize($response),
        ]);
    }

    /**
     * The `createOrder` function sends a POST request to a specified endpoint with a JSON payload, and
     * returns a JSON response containing a payment link and reference number.
     * 
     * @param string referenceNumber The `referenceNumber` parameter is a string that represents the
     * reference number for the order. It is used to uniquely identify the order and can be used for
     * tracking or referencing purposes.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function createOrder(string $referenceNumber): JsonResponse {
        try {
            $body = $this->payload;
            $headers = [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'Accept-Language' => 'en_US',
                'Authorization' => 'Bearer ' . $this->accessToken,
            ];

            $client = new \GuzzleHttp\Client();
            $response = $client->request(
                'POST',
                $this->endpointURL . 'v2/checkout/orders',
                [
                    'json' => $body,
                    'headers' => $headers
                ]
            );

            if ($response->getStatusCode() == 201) {
                $response = json_decode($response->getBody());
                $this->logRequest($body, $response);
                $this->updateTransactionId($response);
                if (isset($response->id)) {
                    $paymentLink = $response->links[1]->href;

                    return $this->return(200, "Payment link generated successfully", ['payment_link' => $paymentLink, 'reference_number', $referenceNumber]);
                }
            } else {
                return $this->return(400, "Something went wrong!");
            }
        } catch (Exception $e) {
            return $this->return(500, "Something went wrong!", debug: $e->getMessage());
        }
    }

    /**
     * The function `checkStatus` sends a POST request to an endpoint with basic authentication, retrieves
     * the response, decodes it as JSON, determines the payment status based on the response status, and
     * logs the notification.
     * 
     * @param string referenceNumber The reference number is a unique identifier for a specific
     * transaction. It is used to retrieve the details and status of a payment transaction.
     */
    public function checkStatus(string $referenceNumber) {
        $transactionNumber = PaymentTransaction::where("reference_number", $referenceNumber)->first()->transaction_number;

        $headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Accept-Language' => 'en_US',
            'Authorization' => 'Basic ' . base64_encode($this->clientID . ':' . $this->clientSecret),
        ];

        $client = new \GuzzleHttp\Client();
        $response = $client->request(
            'GET',
            $this->endpointURL . 'v2/checkout/orders/' . $transactionNumber,
            [
                'headers' => $headers
            ]
        );


        if ($response->getStatusCode() == 201) {
            $response = json_decode($response->getBody());
            
            $status = ($response['status'] == $this->successStatus) ? PaymentStatues::SUCCESS : PaymentStatues::FAILED;

            $this->logNotification($transactionNumber, $response, $status);

            (new PaymentController)->changeStatus($referenceNumber, $status);

            if ($status == PaymentStatues::SUCCESS) {
                $paymentTransaction = PaymentTransaction::where("reference_number", $referenceNumber)->first();
                $coursesId = PaymentTransactionItem::where("payment_transaction_id", $paymentTransaction->id)->pluck("course_id")->toArray();
                $userId = $paymentTransaction->user_id;
                (new PaymentController)->enrollCourses($coursesId, $userId);
                (new RedirectionController)->success($referenceNumber);
            } else {
                (new RedirectionController)->cancel($referenceNumber);
            }
        } else {
            (new RedirectionController)->cancel($referenceNumber);
        }
    }

    /**
     * The logNotification function updates the status and notification fields of a PaypalLog entry with
     * the given transaction number.
     * 
     * @param string transactionNumber The transaction number associated with the notification.
     * @param array notification The `` parameter is an array that contains information about
     * the notification. It is being serialized using the `serialize()` function before being stored in the
     * database.
     * @param int status The status parameter is an integer that represents the status of the notification.
     * It is used to update the 'status' field in the PaypalLog table.
     */

    private function logNotification(string $transactionNumber, array $notification, int $status): void {
        PaypalLog::where("transaction_number", $transactionNumber)->update([
            'status' => $status,
            'notification' => serialize($notification)
        ]);
    }
}
