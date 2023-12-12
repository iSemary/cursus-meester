<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use modules\Payments\Entities\PaymentTransaction;
use modules\Payments\Entities\PaypalLog;
use modules\Payments\Interfaces\PaymentStatues;

class PaypalController extends ApiController {
    private array $payload;
    private int $paymentTransactionId;

    private string $endpointURL;

    private string $clientID;
    private string $clientSecret;

    private string $accessToken;

    private string $cancelURL;
    private string $webhookURL;

    private string $successStatus = "paid";
    private string $failedStatus = "failed";

    public function __construct() {
        $this->endpointURL = "https://api-m.sandbox.paypal.com/";
        $this->clientID = env("PAYPAL_CLIENT_ID");
        $this->clientSecret = env("PAYPAL_CLIENT_SECRET");


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
    public function init(int $paymentTransactionId, string $referenceNumber, array $orders) {
        $this->paymentTransactionId = $paymentTransactionId;

        $this->generateAccessToken();

        $this->prepareOrderPayload($orders);
        return $this->createOrder($referenceNumber);
    }

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


    private function prepareOrderPayload(array $orders): void {
        $preparedOrder = [];

        // Loop over each course item and append the required product details
        foreach ($orders as $order) {
            $preparedOrder[] = [
                'name' => $order['name'],
                'description' => $order['description'],
                'quantity' => "1",
                "unit_amount" => [
                    "currency_code" => "USD",
                    "value" => "100.00"
                ]
            ];
        }
        // Prepare payload for paypal
        $payload = [
            'intent' => "CAPTURE",
            'purchase_units' => [[
                "items" => $preparedOrder,
                "amount" => [
                    "currency_code" => "USD",
                    "value" => "100.00",
                    "breakdown" => [
                        "item_total" => [
                            "currency_code" => "USD",
                            "value" => "100.00" // TODO Dynamic
                        ]
                    ]
                ]
            ]],
            "application_context" => [
                "return_url" => $this->webhookURL,
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


    private function logRequest(array $payload, array|object $response): void {
        PaypalLog::create([
            'transaction_number' => $response->id,
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
        PaypalLog::where("transaction_number", $transactionNumber)->update([
            'status' => $status,
            'notification' => serialize($notification)
        ]);
    }

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
}
