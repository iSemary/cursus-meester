<?php

namespace App\Services\SMS;

use GuzzleHttp\Client;

class Twilio {
    private $twilioAccountSID;
    private $twilioAccountToken;
    private $twilioVerifyServiceSID;

    public function __construct() {
        $this->twilioAccountSID = env("TWILIO_ACCOUNT_SID");
        $this->twilioAccountToken = env("TWILIO_ACCOUNT_TOKEN");
        $this->twilioVerifyServiceSID = env("TWILIO_VERIFY_SERVICE_SID");
    }

    /**
     * The function sends a verification request with a phone number and OTP (one-time password).
     * 
     * @param int phoneNumber The phoneNumber parameter is an integer that represents the phone number to
     * which the OTP (One-Time Password) will be sent.
     * @param int otp The "otp" parameter stands for "One-Time Password". It is a unique code that is
     * generated and sent to a user's phone number for the purpose of verifying their identity or
     * completing a specific action.
     * 
     * @return bool A boolean value is being returned.
     */
    public function send(int $phoneNumber, int $otp): bool {
        return $this->sendVerificationRequest($phoneNumber, $otp);
    }

    /**
     * The function sends a verification request to Twilio using the provided phone number and OTP, and
     * returns true if the request is pending, otherwise false.
     * 
     * @param int phoneNumber The phoneNumber parameter is an integer that represents the phone number to
     * which the verification request will be sent.
     * @param int otp The `otp` parameter stands for "One-Time Password". It is a unique code that is
     * generated and sent to the user's phone number for verification purposes. The user needs to enter
     * this code to complete the verification process.
     * 
     * @return bool a boolean value. If the verification request is successful and the response status is
     * 'pending', it will return true. Otherwise, it will return false.
     */
    public function sendVerificationRequest(int $phoneNumber, int $otp): bool {
        // Create a Guzzle client instance
        $client = new Client();
        // Send the initial verification request
        $response = $client->post("https://verify.twilio.com/v2/Services/$this->twilioVerifyServiceSID/Verifications", [
            'form_params' => [
                'Channel' => 'sms',
                'To' => "+" . $phoneNumber,
                'Code' => $otp
            ],
            'auth' => [$this->twilioAccountSID, $this->twilioAccountToken],
        ]);
        $responseBody = $response->getBody()->getContents();
        $responseBody = json_decode($responseBody, true);
        if ($responseBody['status'] == 'pending') {
            return true;
        }

        return false;
    }
}
