<?php

namespace App\Services\SMS;

use App\Services\SMS\Twilio;

class Driver {
    protected $smsService;

    /**
     * The constructor function initializes the `` variable with a new instance of the Twilio
     * class.
     */
    public function __construct() {
        $this->smsService = new Twilio();
    }

    /**
     * The function sends an SMS message to a specified phone number.
     * 
     * @param int phoneNumber An integer representing the phone number to which the message will be sent.
     * @param string message The message parameter is a string that represents the content of the SMS
     * message that you want to send.
     * 
     * @return bool A boolean value is being returned.
     */
    public function send(int $phoneNumber, string $message): bool {
        return $this->smsService->send($phoneNumber, $message);
    }
}
